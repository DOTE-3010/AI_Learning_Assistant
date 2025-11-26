import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

BIANXIE_API_KEY = os.getenv("BIANXIE_API_KEY", "sk-lXrpvF2HGabKdbMmtF9R9rcjklOqpeA2TFmmsNKWbAUE3cnW")
BIANXIE_ENDPOINT = os.getenv("BIANXIE_ENDPOINT", "https://api.bianxie.ai/v1")
# Default Model: gemini-3-pro-preview (as requested)
MODEL_NAME = os.getenv("MODEL_NAME", "gemini-3-pro-preview")

# Update default to match Docker Compose credentials
POSTGRES_URL = os.getenv("POSTGRES_URL", "postgresql://postgres:postgres@localhost:15432/solver42")
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")

def validate_config():
    if not BIANXIE_API_KEY:
        print("Warning: BIANXIE_API_KEY not set")
