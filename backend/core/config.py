import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

BIANXIE_API_KEY = os.getenv("BIANXIE_API_KEY", "sk-lXrpvF2HGabKdbMmtF9R9rcjklOqpeA2TFmmsNKWbAUE3cnW")
BIANXIE_ENDPOINT = os.getenv("BIANXIE_ENDPOINT", "https://api.bianxie.ai/v1")
# Default Model: gpt-5-mini
MODEL_NAME = os.getenv("MODEL_NAME", "gpt-5-mini")
CONTEXT_ADAPTER = os.getenv("CONTEXT_ADAPTER", "langchain").strip().lower()
ITERATION_TURNS = int(os.getenv("ITERATION_TURNS", "3"))
CONTEXT_WINDOW_LIMIT = int(os.getenv("CONTEXT_WINDOW_LIMIT", "128000"))
TARGET_OUTPUT_TOKENS = int(os.getenv("TARGET_OUTPUT_TOKENS", "1200"))

# Update default to match Docker Compose credentials
POSTGRES_URL = os.getenv("POSTGRES_URL", "postgresql://postgres:postgres@localhost:15432/ai_learning_assistant")
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")

def validate_config():
    if not BIANXIE_API_KEY:
        print("Warning: BIANXIE_API_KEY not set")
