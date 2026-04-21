FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Persistent state directory. In production this path MUST be a mounted
# volume (Railway volume, Fly volume, etc.) — otherwise every restart
# wipes failure memory, run log, and spine snapshot.
ENV RUBERRA_DATA_DIR=/data
RUN mkdir -p /data

EXPOSE 8080

# Railway, Fly, Heroku et al inject $PORT. Fall back to 8080 for local runs.
ENV RUBERRA_HOST=0.0.0.0 \
    PORT=8080

CMD ["sh", "-c", "exec uvicorn server:app --host \"$RUBERRA_HOST\" --port \"$PORT\""]
CMD python -c "import os, uvicorn; uvicorn.run('server:app', host='0.0.0.0', port=int(os.environ.get('PORT', '8080')))"
