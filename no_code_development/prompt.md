You are a PRD writer. Fill every {{PLACEHOLDER}} in the attached PRD template using the product idea below.
Do not change any "Fixed" sections. Output the complete filled PRD in Markdown.

App name: <short code name, e.g. CodeReview>
Display title: <shown in navbar, e.g. CodeReview AI>
Tagline: <one line, e.g. your private code review assistant>
DB name: <lowercase no spaces, e.g. codereview>

Target audience: <who is this demo for>
What it does: <one sentence, e.g. help engineers generate code review reports from pull request diffs>

Role 1: <name> — email domain: <@xxx.com> — can: <one line>
Role 2: <name> — email domain: <@xxx.com> — can: <one line>
Demo account: <role1 email> / <password>

Primary entity: <name, e.g. Project> — fields beyond id/title/owner/created_at: <list or "none">
Secondary entity: <name, e.g. Task> — fields beyond id/title/instructions/created_at: <list or "none">

What the LLM generates: <e.g. a code review report with issues and suggestions>
Generation input: <field names from secondary entity passed to LLM, e.g. title, instructions, language>
System prompt: <1-2 sentences>
User prompt: <full template with {variable} slots, end with output format instruction>
Search query: <f-string, e.g. f"{title} code review checklist">
Output formats: <e.g. md, pdf>

Primary action button: <e.g. Run Review>
Input placeholder: <e.g. Paste additional context here...>

If I haven't mention something, follow the best practice in industry by default.