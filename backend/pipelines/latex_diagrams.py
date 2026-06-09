from __future__ import annotations

import re

DIAGRAM_POLICY_INSTRUCTION = (
    "Do not emit visible diagram placeholders such as "
    "[Diagram: Encoder-Decoder Schematic] or [Insert figure here]. "
    "For complex precision diagrams, especially transformer encoder-decoder "
    "architectures, explain the important relationships in concise prose or omit "
    "the diagram. Use TikZ only for a simple diagram when you can provide the full "
    "compiling TikZ source and all required packages."
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


def sanitize_latex_diagram_placeholders(source: str) -> str:
    """Replace explicit diagram insertion notes without touching real TikZ source."""

    return _DIAGRAM_PLACEHOLDER_PATTERN.sub(_PLACEHOLDER_REPLACEMENT, source)
