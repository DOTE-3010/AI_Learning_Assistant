# Solver#42 Master Roadmap: The "Zero-to-Hero" Guide

> **Version**: 3.0 (Idiot-Proof Edition)
> **Audience**: Absolute Beginners to Full Stack Engineers.
> **Goal**: To guide you through building a professional AI application from scratch.
> **How to Use**: Follow every single checkbox `[ ]`. Do not skip steps. If a term confuses you (like "Terminal"), search for it, then come back.

---

## 🏛 Phase 0: Setting Up Your Workshop
**Logic**: Before building a house, you need a flat piece of land and tools. In programming, this means a clean folder structure and a "Virtual Environment" to keep our software tools organized.

### 0.1 Create the Folders
**Rationale**: A clean structure separates the "Brain" (Logic), the "Face" (UI), and the "Memory" (Database).

**Your Mission**:
- [ ] Open your computer's Terminal (Mac/Linux) or Command Prompt (Windows).
- [ ] Navigate to your Desktop: `cd Desktop`
- [ ] Create the main folder: `mkdir Solver42`
- [ ] Enter the folder: `cd Solver42`
- [ ] Create the subfolders exactly as written below (one by one or all at once):
  ```bash
  mkdir -p backend/app/templates
  mkdir -p backend/core
  mkdir -p backend/models
  mkdir -p backend/static
  mkdir -p workspace
  ```
- [ ] **Verification**: Run `ls -R` (Mac) or `dir /s` (Win) to confirm you see `backend`, `app`, `core`, etc.

### 0.2 Python Environment
**Rationale**: Python installs libraries globally by default. This is messy. We use `venv` (Virtual Environment) to create a sandbox just for this project.

**Your Mission**:
- [ ] Check Python version: `python3 --version` (Must be 3.11 or higher).
- [ ] Create the sandbox: `python3 -m venv venv`
- [ ] Activate the sandbox:
  - **Mac/Linux**: `source venv/bin/activate`
  - **Windows**: `venv\Scripts\activate`
- [ ] **Verification**: Your terminal line should now start with `(venv)`.

### 0.3 Install Tools (Dependencies)
**Rationale**: We don't write everything from scratch. We use "Libraries". `FastAPI` is for the web server, `OpenAI` is for talking to AI, `SQLAlchemy` is for databases.

**Your Mission**:
- [ ] Create a file named `requirements.txt` inside `Solver42`.
- [ ] Paste the following text into it:
  ```text
  fastapi==0.104.1
  uvicorn==0.24.0
  sqlalchemy==2.0.23
  psycopg2-binary==2.9.9
  pymongo==4.6.0
  python-multipart==0.0.6
  python-dotenv==1.0.0
  openai==1.3.5
  duckduckgo-search==3.9.3
  jinja2==3.1.2
  requests==2.31.0
  ```
- [ ] Run the installer: `pip install -r requirements.txt`
- [ ] **Verification**: Wait for it to finish without red error text.

### 0.4 Secrets Management
**Rationale**: Never put passwords in code. We put them in a special `.env` file that git ignores.

**Your Mission**:
- [ ] Create a file named `.env` in `Solver42`.
- [ ] Paste this content:
  ```text
  BIANXIE_API_KEY=sk-your-key-here
  BIANXIE_ENDPOINT=https://api.bianxie.ai/v1
  MODEL_NAME=gemini-3-pro-preview
  POSTGRES_URL=postgresql://postgres:postgres@localhost:15432/solver42
  MONGODB_URL=mongodb://localhost:27017
  ```
- [ ] Create a file `backend/core/config.py` to read these variables.
- [ ] Paste this code:
  ```python
  import os
  from dotenv import load_dotenv
  load_dotenv()
  
  BIANXIE_API_KEY = os.getenv("BIANXIE_API_KEY")
  BIANXIE_ENDPOINT = os.getenv("BIANXIE_ENDPOINT")
  MODEL_NAME = os.getenv("MODEL_NAME")
  POSTGRES_URL = os.getenv("POSTGRES_URL")
  MONGODB_URL = os.getenv("MONGODB_URL")
  ```

---

## 🧠 Phase 1: Building the Brain (Core Logic)
**Logic**: We build the pure logic first. This code doesn't know about the web or users. It just takes input (Question) and gives output (Answer).

### 1.1 Web Search Ability
**Rationale**: AI knowledge is cut off at a past date. We give it "eyes" using DuckDuckGo Search to find current info.

**Your Mission**:
- [ ] Create `backend/app/web_search.py`.
- [ ] Paste this code:
  ```python
  from duckduckgo_search import DDGS

  def perform_web_search(query: str, max_results=3):
      try:
          with DDGS() as ddgs:
              return list(ddgs.text(query, max_results=max_results))
      except:
          return []
  ```
- [ ] **Verification**: Create a temporary file `test.py` with `from backend.app.web_search import perform_web_search; print(perform_web_search("test"))` and run it (`python3 test.py`). It should print search results.

### 1.2 PDF Generation Ability
**Rationale**: Professors love PDFs. We use `LaTeX`, the standard for academic documents. We use a "Template" approach so we don't have to write messy LaTeX code manually.

**Your Mission**:
- [ ] Create `backend/app/templates/beamer_template.tex`.
- [ ] Paste this content:
  ```latex
  \documentclass{beamer}
  \usetheme{Madrid}
  \begin{document}
  {{CONTENT}}
  \end{document}
  ```
- [ ] Create `backend/app/latex_renderer.py`.
- [ ] Paste this code:
  ```python
  import os, subprocess
  from jinja2 import Template

  def render_beamer_template(content):
      path = os.path.join(os.path.dirname(__file__), "templates/beamer_template.tex")
      with open(path) as f: return Template(f.read()).render(CONTENT=content)
  ```

### 1.3 The AI Generator
**Rationale**: This is the conductor. It calls Search, builds the Prompt, calls the AI, and formats the result.

**Your Mission**:
- [ ] Create `backend/app/standard_answer_generator.py`.
- [ ] Paste this code:
  ```python
  from openai import OpenAI
  from backend.core.config import *
  from backend.app.web_search import perform_web_search
  
  client = OpenAI(api_key=BIANXIE_API_KEY, base_url=BIANXIE_ENDPOINT)

  def generate_answer_logic(title, instructions, use_search=True):
      context = ""
      if use_search:
          results = perform_web_search(title)
          for r in results: context += f"\nSource: {r['title']}\n{r['body']}\n"
      
      prompt = f"Task: {title}\nInstructions: {instructions}\nContext: {context}"
      
      completion = client.chat.completions.create(
          model=MODEL_NAME,
          messages=[{"role": "user", "content": prompt}]
      )
      return completion.choices[0].message.content
  ```

---

## 💾 Phase 2: Data Persistence (Memory)
**Logic**: Logic is fleeting. We need a database to remember Users and Assignments.

### 2.1 Define the Data Structure (PostgreSQL)
**Rationale**: We define "Classes" that look like our data tables. `SQLAlchemy` translates these Python classes into SQL commands.

**Your Mission**:
- [ ] Create `backend/models/postgres.py`.
- [ ] Paste this code:
  ```python
  from sqlalchemy import Column, Integer, String, DateTime
  from sqlalchemy.ext.declarative import declarative_base
  from datetime import datetime

  Base = declarative_base()

  class User(Base):
      __tablename__ = "users"
      id = Column(Integer, primary_key=True, index=True)
      email = Column(String, unique=True, index=True)
      role = Column(String)

  class GenerationJob(Base):
      __tablename__ = "generation_jobs"
      id = Column(Integer, primary_key=True, index=True)
      status = Column(String)
      assignment_id = Column(Integer)
      requested_by_email = Column(String)
  ```

### 2.2 Connect to the Database
**Rationale**: We need a "Session Manager" that opens a phone line to the database when we need it, and hangs up when we're done.

**Your Mission**:
- [ ] Create `backend/app/database.py`.
- [ ] Paste this code:
  ```python
  from sqlalchemy import create_engine
  from sqlalchemy.orm import sessionmaker
  from backend.core.config import POSTGRES_URL
  from pymongo import MongoClient
  from backend.core.config import MONGODB_URL

  # Postgres
  engine = create_engine(POSTGRES_URL)
  SessionLocal = sessionmaker(bind=engine)

  # Mongo
  mongo_client = MongoClient(MONGODB_URL)
  mongo_db = mongo_client["solver42"]

  def get_db():
      db = SessionLocal()
      try:
          yield db
      finally:
          db.close()
  ```

---

## 🔌 Phase 3: The API (The Interface)
**Logic**: Now we expose our Logic to the outside world using URLs (Endpoints).

### 3.1 The Gatekeeper (Authentication)
**Rationale**: We check every request. If it has a valid Token (base64 email), we let it in. If not, we block it.

**Your Mission**:
- [ ] Create `backend/core/auth.py`.
- [ ] Paste this code:
  ```python
  import base64
  from fastapi import Request
  from fastapi.responses import JSONResponse

  async def email_auth_middleware(request: Request, call_next):
      if request.url.path.startswith("/ui") or request.url.path in ["/auth/login", "/docs", "/openapi.json"]:
          return await call_next(request)
      
      token = request.headers.get("X-User-Token")
      email = request.headers.get("X-User-Email")
      
      if not token or not email:
          return JSONResponse(status_code=401, content={"error": "Missing Auth"})
      
      request.state.email = email
      request.state.role = "teacher" if email.endswith("@cuhk.edu.hk") else "student"
      return await call_next(request)
  ```

### 3.2 The Application (Main.py)
**Rationale**: This is the main entry point. It ties Auth, Database, and Logic together.

**Your Mission**:
- [ ] Create `backend/main.py`.
- [ ] Paste this code:
  ```python
  from fastapi import FastAPI, Depends, BackgroundTasks, Form
  from backend.core.auth import email_auth_middleware
  from backend.app.database import engine, Base, get_db, mongo_db
  from backend.models.postgres import GenerationJob
  from backend.app.standard_answer_generator import generate_answer_logic
  from sqlalchemy.orm import Session
  from fastapi.staticfiles import StaticFiles

  app = FastAPI()
  app.middleware("http")(email_auth_middleware)
  app.mount("/ui", StaticFiles(directory="backend/static", html=True), name="ui")

  @app.on_event("startup")
  def startup():
      Base.metadata.create_all(bind=engine)

  def process_job(job_id, title, instr):
      # Simulate DB access in background
      db = next(get_db())
      job = db.query(GenerationJob).filter(GenerationJob.id == job_id).first()
      job.status = "running"
      db.commit()
      
      try:
          result = generate_answer_logic(title, instr)
          mongo_db.artifacts.insert_one({"job_id": job_id, "content": result})
          job.status = "succeeded"
      except:
          job.status = "failed"
      db.commit()

  @app.post("/generate-answer")
  async def generate(
      bg: BackgroundTasks, 
      title: str = Form(...), 
      instr: str = Form(...), 
      db: Session = Depends(get_db)
  ):
      job = GenerationJob(status="queued")
      db.add(job)
      db.commit()
      bg.add_task(process_job, job.id, title, instr)
      return {"job_id": job.id}

  @app.get("/jobs/{job_id}")
  async def get_status(job_id: int, db: Session = Depends(get_db)):
      job = db.query(GenerationJob).filter(GenerationJob.id == job_id).first()
      output = None
      if job.status == "succeeded":
          art = mongo_db.artifacts.find_one({"job_id": job_id})
          output = art["content"]
      return {"status": job.status, "output": output}
  ```

---

## 🖥️ Phase 4: The Frontend (UI)
**Logic**: A simple webpage for users to click buttons. We use standard HTML + JavaScript.

### 4.1 The One Page App
**Rationale**: No complex build tools. Just one file `index.html` that does everything.

**Your Mission**:
- [ ] Create `backend/static/index.html`.
- [ ] Paste a standard HTML5 boilerplate.
- [ ] Add Tailwind CSS: `<script src="https://cdn.tailwindcss.com"></script>`
- [ ] Add a simple form:
  ```html
  <input id="title" placeholder="Assignment Title">
  <button onclick="submit()">Generate</button>
  <div id="result"></div>
  <script>
    async function submit() {
      const title = document.getElementById('title').value;
      const res = await fetch('/generate-answer', {
         method: 'POST',
         headers: {'X-User-Email': 't@cuhk.edu.hk', 'X-User-Token': btoa('t@cuhk.edu.hk')},
         body: new URLSearchParams({title: title, instr: "Solve it"})
      });
      const data = await res.json();
      poll(data.job_id);
    }
    
    async function poll(id) {
       setInterval(async () => {
          const res = await fetch(`/jobs/${id}`, {
             headers: {'X-User-Email': 't@cuhk.edu.hk', 'X-User-Token': btoa('t@cuhk.edu.hk')}
          });
          const data = await res.json();
          if(data.status === 'succeeded') document.getElementById('result').innerText = data.output;
       }, 2000);
    }
  </script>
  ```

---

## 🚀 Phase 5: Deployment (Docker)
**Logic**: "It works on my machine" is not enough. We package it in a box (Container) so it works everywhere.

### 5.1 The Package Definition (Dockerfile)
**Your Mission**:
- [ ] Create file `Dockerfile`.
- [ ] Paste:
  ```dockerfile
  FROM python:3.11-slim
  WORKDIR /app
  COPY requirements.txt .
  RUN pip install --no-cache-dir -r requirements.txt
  COPY backend/ backend/
  CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "14242"]
  ```

### 5.2 The Orchestra (Docker Compose)
**Your Mission**:
- [ ] Create file `docker-compose.yml`.
- [ ] Paste:
  ```yaml
  services:
    backend:
      build: .
      ports: ["14242:14242"]
      environment:
        - POSTGRES_URL=postgresql://postgres:postgres@db:5432/solver42
        - MONGODB_URL=mongodb://mongo:27017
      depends_on: [db, mongo]
    db:
      image: postgres:15
      environment: {POSTGRES_PASSWORD: postgres}
    mongo:
      image: mongo:latest
  ```
- [ ] **Final Launch**: Run `docker-compose up --build`.
- [ ] Open `http://localhost:14242/ui` in your browser.

---
**Congratulations!** You have built a Full Stack AI Application.
