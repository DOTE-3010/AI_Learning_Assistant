# Frontend build stage
FROM node:20-slim AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend /app/frontend
RUN npm run build

# Use Python 3.11 slim image for efficiency
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Replace Debian sources with Tsinghua mirror for faster downloads in China
RUN sed -i 's/deb.debian.org/mirrors.tuna.tsinghua.edu.cn/g' /etc/apt/sources.list.d/debian.sources

# Install system dependencies
# - texlive-latex-base/extra/fonts: For LaTeX/Beamer generation
# - build-essential: For compiling Python extensions if needed
# - libpango-1.0-0, libpangoft2-1.0-0: Dependencies for WeasyPrint
RUN apt-get update && apt-get install -y \
    texlive-latex-base \
    texlive-latex-extra \
    texlive-fonts-recommended \
    build-essential \
    libpango-1.0-0 \
    libpangoft2-1.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY backend/requirements.txt .

# Install Python dependencies using a mirror
RUN pip install --no-cache-dir -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple

# Copy application code
COPY backend /app/backend
COPY --from=frontend-builder /app/backend/static /app/backend/static

# Create workspace directory for outputs
RUN mkdir -p /app/workspace

# Expose API port
EXPOSE 8000

# Set PYTHONPATH
ENV PYTHONPATH=/app

# Command to run the application
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]




