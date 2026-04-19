FROM python:3.11-slim

WORKDIR /app

# system deps for httpx/anyio native wheels — minimal, no cruft
RUN apt-get update \
 && apt-get install -y --no-install-recommends ca-certificates \
 && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Fly/Railway/Render inject PORT at runtime; default to 8080 for portability.
ENV RUBERRA_HOST=0.0.0.0
ENV PORT=8080
EXPOSE 8080

# Bind to $PORT because every host expects that contract.
CMD ["sh", "-c", "python -m uvicorn server:app --host 0.0.0.0 --port ${PORT}"]
