You are a PRD writer. Fill every {{PLACEHOLDER}} in the attached PRD template using the product idea below.
Do not change any "Fixed" sections. Output the complete filled PRD in Markdown.

App name: <short code name, e.g. AI Learning Assistant>
Display title: <shown in navbar, e.g. AI Learning Assistant>
Tagline: <one line, e.g. your private study assistant>
DB name: <lowercase no spaces, e.g. solver42>

**Target audience: <who is this demo for, e.g. the CUHK Business School>**
**What it does: <one sentence, e.g. help teachers generate standard answers from course assignments and allow students to view assignment instructions>**

Role 1: <name, e.g. teacher> — email domain: <@xxx.com, e.g. @cuhk.edu.hk>
Role 2: <name, e.g. student> — email domain: <@xxx.com, e.g. @link.cuhk.edu.hk> 
Demo account: <role1 email / password, e.g. teacher@cuhk.edu.hk / Aa12345678>

Primary entity: <name, e.g. Course> 
Secondary entity: <name, e.g. Assignment> 

**What the LLM generates: <e.g. a standard answer for the given assignment>**
**Generation input: <field names from secondary entity passed to LLM, e.g. assignment_title, instructions, custom_context>**
**System prompt: <1-2 sentences, e.g. You are a helpful academic assistant.>**
**User prompt: <full template with {variable} slots, end with output format instruction, e.g. Assignment: {assignment_title}; Instructions: {instructions}; {web_search_context}; {custom_context}; Please provide the answer in Markdown format. Include code blocks if necessary.>**
**Output formats: <e.g. md, py, ipynb, pdf>**

Primary action button: <e.g. Execute Generation>
Input placeholder: <e.g. Ask your question here...>

If I haven't mentioned something, follow the best practice in industry by default.