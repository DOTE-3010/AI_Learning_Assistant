FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    APP_SQLITE_PATH=/app/data/app.sqlite \
    WORKSPACE_ROOT=/app/workspace \
    MODEL_SECRET_FILE=/app/data/model-secrets.env

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        fonts-lmodern \
        latexmk \
        texlive-fonts-recommended \
        texlive-latex-base \
        texlive-latex-extra \
        texlive-latex-recommended \
        texlive-xetex \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt backend/requirements.txt
RUN python -m pip install --upgrade pip \
    && python -m pip install -r backend/requirements.txt

COPY backend backend

RUN mkdir -p /app/data /app/workspace

EXPOSE 14242

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "14242"]
