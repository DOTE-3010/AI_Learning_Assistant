import re
import os

def sanitize_filename(name: str) -> str:
    # Remove invalid characters for both Windows and Unix
    # Windows invalid: < > : " / \ | ? *
    # Unix invalid: / (already handled above)
    
    # Replace common separators with underscore
    name = re.sub(r'[\\/:\*\?"<>|]', '_', name)
    
    # Replace spaces with underscores (optional but safer)
    name = name.replace(' ', '_')
    
    # Strip leading/trailing dots and spaces
    name = name.strip('. ')
    
    return name

