import os
import subprocess
import logging
from jinja2 import Template

logger = logging.getLogger(__name__)

def escape_latex(text: str) -> str:
    """
    Escapes special characters for LaTeX.
    """
    if not text:
        return ""
    chars = {
        "&": r"\&",
        "%": r"\%",
        "$": r"\$",
        "#": r"\#",
        "_": r"\_",
        "{": r"\{",
        "}": r"\}",
        "~": r"\textasciitilde{}",
        "^": r"\textasciicircum{}",
        "\\": r"\textbackslash{}",
    }
    return "".join(chars.get(c, c) for c in text)

def compile_latex(tex_source: str, output_dir: str, filename_base: str = "slides") -> str:
    """
    Compiles LaTeX source to PDF using pdflatex.
    Returns the path to the generated PDF or raises an exception.
    """
    tex_path = os.path.join(output_dir, f"{filename_base}.tex")
    pdf_path = os.path.join(output_dir, f"{filename_base}.pdf")
    
    # Write .tex file
    with open(tex_path, "w", encoding="utf-8") as f:
        f.write(tex_source)
    
    # Check if pdflatex is available
    # Use full path or default to PATH
    pdflatex_cmd = "pdflatex"
    # If on Mac and not in path, try common locations (though the shell running python should have it if activated correctly)
    # For now relying on PATH.
    
    try:
        subprocess.run([pdflatex_cmd, "--version"], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except (FileNotFoundError, subprocess.CalledProcessError):
        # Try absolute path for MacTeX
        if os.path.exists("/Library/TeX/texbin/pdflatex"):
             pdflatex_cmd = "/Library/TeX/texbin/pdflatex"
        else:
            logger.warning("pdflatex not found. Returning raw LaTeX source.")
            return tex_path # Fallback to returning the source file path

    # Compile
    # Run twice for references/page numbers if needed, but once is usually enough for simple slides
    try:
        # Use -interaction=nonstopmode to prevent hanging on errors
        cmd = [pdflatex_cmd, "-interaction=nonstopmode", "-output-directory", output_dir, tex_path]
        logger.info(f"Running compilation: {' '.join(cmd)}")
        
        result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=30)
        
        if result.returncode != 0:
            logger.error(f"LaTeX compilation failed:\n{result.stdout}\n{result.stderr}")
            # Even if it fails, sometimes a PDF is produced. If not, return tex path.
            if not os.path.exists(pdf_path):
                raise RuntimeError(f"LaTeX compilation failed. Check log at {output_dir}/{filename_base}.log")
        
        return pdf_path
        
    except subprocess.TimeoutExpired:
        logger.error("LaTeX compilation timed out.")
        raise RuntimeError("LaTeX compilation timed out.")
    except Exception as e:
        logger.error(f"Error during LaTeX compilation: {e}")
        return tex_path

def render_beamer_template(content_body: str) -> str:
    """
    Reads the beamer_template.tex and injects the content.
    """
    template_path = os.path.join(os.path.dirname(__file__), "templates", "beamer_template.tex")
    try:
        with open(template_path, "r", encoding="utf-8") as f:
            template_str = f.read()
        
        # Simple string replacement or Jinja2 if we change the template to be Jinja2-compliant
        # The current template uses {{CONTENT}} which is compatible with Jinja2 variable syntax {{ CONTENT }}
        # provided we pass CONTENT.
        
        template = Template(template_str)
        return template.render(CONTENT=content_body)
    except Exception as e:
        logger.error(f"Failed to render template: {e}")
        # Fallback: manual concatenation
        return f"\\documentclass{{beamer}}\\begin{{document}}\\frame{{\\titlepage}}\n{content_body}\n\\end{{document}}"

