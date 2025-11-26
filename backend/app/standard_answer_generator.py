from openai import OpenAI
from backend.core.config import BIANXIE_API_KEY, BIANXIE_ENDPOINT, MODEL_NAME
from backend.app.web_search import perform_web_search

client = OpenAI(api_key=BIANXIE_API_KEY, base_url=BIANXIE_ENDPOINT)

def generate_answer_logic(assignment_title, instructions, custom_context=None, use_search=True):
    context = ""
    if use_search:
        search_results = perform_web_search(f"{assignment_title} solution")
        if search_results:
            context += "\n\nWeb Search Context:\n"
            for res in search_results:
                context += f"- {res['title']}: {res['body']}\n"
    
    if custom_context:
        context += f"\n\nAdditional Teacher Instructions/Context:\n{custom_context}\n"
    
    prompt = f"""
    You are an expert teaching assistant. Create a standard answer for the following assignment.
    
    Assignment: {assignment_title}
    Instructions: {instructions}
    
    {context}
    
    Please provide the answer in Markdown format. Include code blocks if necessary.
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
        # Return latex source for now as "latex rendering version"
        # converting md to latex is complex without pandoc, we'll do a simple wrap
        return f"\\documentclass{{article}}\n\\begin{{document}}\n{content}\n\\end{{document}}"
    return content
