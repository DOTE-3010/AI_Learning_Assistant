from __future__ import annotations

import re

DIAGRAM_POLICY_INSTRUCTION = (
    "Do not emit visible diagram placeholders such as "
    "[Diagram: Encoder-Decoder Schematic] or [Insert figure here]. "
    "For complex precision diagrams, especially transformer encoder-decoder "
    "architectures, explain the important relationships in concise prose or omit "
    "the diagram. Use TikZ only for a simple diagram when you can provide the full "
    "compiling TikZ source and all required packages. Do not use external image "
    "URLs in \\includegraphics; omit the image and describe the relevant idea in "
    "prose unless a local uploaded image file is available."
)

_DIAGRAM_PLACEHOLDER_PATTERN = re.compile(
    r"""
    \[
    \s*
    (?:
        (?:diagram|figure|illustration|image|graphic|schematic)\s*:
        |
        (?:insert|add|place|include)\s+(?:an?\s+)?
        (?:diagram|figure|illustration|image|graphic|schematic)\b
        |
        (?:todo|placeholder)\s*:?\s*
        (?:diagram|figure|illustration|image|graphic|schematic)\b
    )
    [^\]\r\n]*
    \s*
    \]
    """,
    re.IGNORECASE | re.VERBOSE,
)

_PLACEHOLDER_REPLACEMENT = (
    "The key relationships are described in the surrounding text."
)

_REMOTE_INCLUDEGRAPHICS_PATTERN = re.compile(
    r"""
    \\includegraphics
    (?P<options>\s*\[[^\]]*\])?
    \s*
    \{
    \s*
    (?P<url>https?://[^}\s]+)
    \s*
    \}
    """,
    re.IGNORECASE | re.VERBOSE,
)

_REMOTE_IMAGE_REPLACEMENT = (
    "\\fbox{\\parbox[c][3cm][c]{0.86\\linewidth}{\\centering "
    "External image omitted; the key relationships are described in the text.}}"
)

_TIKZ_NODE_LINEBREAK_PATTERN = re.compile(
    r"""
    (?P<prefix>\\node\s*)
    (?:\[(?P<options>[^\]]*)\])?
    (?P<middle>\s*(?:\([^)]+\))?\s*)
    \{
    (?P<body>[^{}]*\\\\[^{}]*)
    \}
    (?P<suffix>\s*;)
    """,
    re.VERBOSE,
)


def sanitize_latex_diagram_placeholders(source: str) -> str:
    """Make model-produced visual LaTeX safer while preserving valid TikZ."""

    sanitized = _DIAGRAM_PLACEHOLDER_PATTERN.sub(_PLACEHOLDER_REPLACEMENT, source)
    sanitized = _REMOTE_INCLUDEGRAPHICS_PATTERN.sub(
        lambda _: _REMOTE_IMAGE_REPLACEMENT,
        sanitized,
    )
    return _TIKZ_NODE_LINEBREAK_PATTERN.sub(_add_tikz_node_alignment, sanitized)


def _add_tikz_node_alignment(match: re.Match[str]) -> str:
    prefix = match.group("prefix").rstrip()
    middle = match.group("middle")
    if middle.startswith("("):
        middle = " " + middle
    options = match.group("options")
    if options and re.search(r"(^|,)\s*(?:align|text\s+width)\s*=", options):
        node_options = f"[{options}]"
    elif options:
        node_options = f"[{options}, align=center]"
    else:
        node_options = "[align=center]"

    return (
        f"{prefix}{node_options}{middle}"
        f"{{{match.group('body')}}}{match.group('suffix')}"
    )
