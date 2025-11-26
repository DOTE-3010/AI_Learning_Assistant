from openai import OpenAI
from backend.core.config import BIANXIE_API_KEY, BIANXIE_ENDPOINT, MODEL_NAME
from backend.app.web_search import perform_web_search

from backend.app.latex_renderer import render_beamer_template

client = OpenAI(api_key=BIANXIE_API_KEY, base_url=BIANXIE_ENDPOINT)

def generate_answer_logic(assignment_title, instructions, custom_context=None, use_search=True, output_format="md"):
    context = ""
    if use_search:
        search_results = perform_web_search(f"{assignment_title} solution")
        if search_results:
            context += "\n\nWeb Search Context:\n"
            for res in search_results:
                context += f"- {res['title']}: {res['body']}\n"
    
    if custom_context:
        context += f"\n\nAdditional Teacher Instructions/Context:\n{custom_context}\n"
    
    # Dynamic Prompt based on Format
    if output_format == "pdf":
        # Prompt for LaTeX Beamer
        prompt = f"""
        You are an expert teaching assistant. Create a presentation using LaTeX Beamer for the following assignment.
        
        Assignment: {assignment_title}
        Instructions: {instructions}
        
        {context}
        
        Requirements:
        1. Generate ONLY the valid LaTeX code inside the \\begin{{document}}...\\end{{document}} environment.
        2. DO NOT include the \\begin{{document}} or \\end{{document}} tags themselves, as they are handled by the template.
        3. DO NOT include any preamble (\\documentclass, \\usepackage, etc.).
        4. Use \\frame{{ ... }} for each slide.
        5. Ensure all special characters (%, $, _, &, #) are properly escaped (e.g. \\%, \\$, \\_).
        6. Do NOT include any markdown code blocks (like ```latex). Just raw text.
        7. Do not repeat the assignment title on every slide.
        
        Optional: You may include qualitative diagrams (TikZ/PGFPlots) if relevant to the concept (e.g. supply/demand, decision trees, trade-offs).
        USE ONLY THESE SUPPORTED TEMPLATES FOR DIAGRAMS (Do not invent new TikZ code):

        [Template 1: Qualitative Plot]
        \\begin{{center}}
        \\begin{{tikzpicture}}[scale=0.8]
        \\begin{{axis}}[
            axis lines = left,
            xlabel = {{X Label}},
            ylabel = {{Y Label}},
            ticks = none,
            width=6cm, height=4cm
        ]
        \\addplot [domain=0:4, samples=10, color=blue, thick] {{x}}; % Example linear
        % Add more \\addplot commands as needed
        \\end{{axis}}
        \\end{{tikzpicture}}
        \\end{{center}}

        [Template 2: Simple Tree]
        \\begin{{center}}
        \\begin{{tikzpicture}}[
            level 1/.style={{sibling distance=30mm}},
            level 2/.style={{sibling distance=15mm}},
            edge from parent/.style={{draw,-latex}}
        ]
        \\node[draw,circle] {{Root}}
            child {{node[draw,rectangle] {{A}}}}
            child {{node[draw,rectangle] {{B}}}};
        \\end{{tikzpicture}}
        \\end{{center}}

        [Template 3: Qualitative Bar Chart]
        \\begin{{center}}
        \\begin{{tikzpicture}}[scale=0.7]
        \\begin{{axis}}[
            ybar,
            symbolic x coords={{A, B, C}},
            xtick=data,
            ymin=0,
            nodes near coords,
            width=7cm
        ]
        \\addplot coordinates {{(A,10) (B,5) (C,8)}};
        \\end{{axis}}
        \\end{{tikzpicture}}
        \\end{{center}}
        
        Output ONLY the LaTeX frame content.
        """
    else:
        # Default Markdown Prompt
        prompt = f"""
        You are an expert teaching assistant. Create a standard answer for the following assignment.
        
        Assignment: {assignment_title}
        Instructions: {instructions}
        
        {context}
        
        Requirements:
        1. Provide the answer in Markdown format.
        2. Do NOT wrap the output in markdown code blocks (like ```markdown). Just raw markdown text.
        3. Be concise and structured.
        """
    
    try:
        print(f"Calling BianxieAPI ({MODEL_NAME}) with prompt: {prompt[:100]}...")
        completion = client.chat.completions.create(
            model=MODEL_NAME, 
            messages=[
                {"role": "system", "content": "You are a helpful academic assistant."},
                {"role": "user", "content": prompt}
            ]
        )
        print("BianxieAPI call successful.")
        return completion.choices[0].message.content
    except Exception as e:
        print(f"BianxieAPI call failed: {e}")
        return f"Error generating answer: {str(e)}"

def convert_to_format(content, fmt):
    if fmt == "md":
        return content
    elif fmt == "txt":
        return content # Simple pass through
    elif fmt == "py":
        # Extract code blocks
        import re
        code_blocks = re.findall(r'```python(.*?)```', content, re.DOTALL)
        return "\n\n".join(code_blocks) if code_blocks else "# No python code found in solution"
    elif fmt == "ipynb":
        import nbformat
        nb = nbformat.v4.new_notebook()
        nb.cells.append(nbformat.v4.new_markdown_cell(content))
        return nbformat.writes(nb)
    elif fmt == "pdf":
        # Render using Beamer Template
        return render_beamer_template(content)
    return content
