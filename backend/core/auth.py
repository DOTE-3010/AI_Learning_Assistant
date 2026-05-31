from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
import base64

async def email_auth_middleware(request: Request, call_next):
    # Skip auth for public/health endpoints and static files
    # Also skip auth for registration AND login endpoints
    if request.url.path.startswith("/api/"):
        return await call_next(request)

    if request.url.path in ["/", "/health", "/docs", "/openapi.json", "/auth/register", "/auth/login"] or request.url.path.startswith("/ui"):
        return await call_next(request)
        
    # For demo, we accept a simple header or query param if header is missing (for browser ease)
    # But browser will be a SPA/HTML so we can set headers.
    email = request.headers.get("X-User-Email")
    token = request.headers.get("X-User-Token")
    
    # Fallback for browser query param testing (optional, but keeping for robustness)
    if not email:
        email = request.query_params.get("email")
    
    if not email:
        return JSONResponse(status_code=400, content={"error": "X-User-Email header required"})
    
    # --- TOKEN VALIDATION (New) ---
    # We implement a very simple "stateless" token: base64(email)
    # In a real app this would be JWT signed by secret.
    # For this Demo, we just check if Token exists and if decoded matches email (proof of login)
    # The frontend will receive this token from /login endpoint.
    
    if not token:
        return JSONResponse(status_code=401, content={"error": "Authentication required (Missing Token)"})
    
    try:
        decoded_token = base64.b64decode(token).decode('utf-8')
        if decoded_token != email:
             return JSONResponse(status_code=403, content={"error": "Invalid Token"})
    except:
        return JSONResponse(status_code=403, content={"error": "Malformed Token"})
    
    # Domain check (Role Inference)
    if email.endswith("@cuhk.edu.hk"):
        role = "teacher"
    elif email.endswith("@link.cuhk.edu.hk"):
        role = "student"
    else:
        return JSONResponse(status_code=403, content={"error": "Unauthorized domain"})
    
    request.state.email = email
    request.state.role = role
    
    return await call_next(request)
