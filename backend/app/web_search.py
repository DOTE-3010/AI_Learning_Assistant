from duckduckgo_search import DDGS

def perform_web_search(query: str, max_results=3):
    try:
        with DDGS() as ddgs:
            results = list(ddgs.text(query, max_results=max_results))
        return results
    except Exception as e:
        print(f"Search error: {e}")
        return []

