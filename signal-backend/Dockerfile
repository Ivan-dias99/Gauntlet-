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
#
# Env precedence: SIGNAL_DATA_DIR is canonical; RUBERRA_DATA_DIR is still
# readable via config.py's env compatibility helper so mid-migration
# deploys keep finding the existing volume path.
ENV SIGNAL_DATA_DIR=/data
RUN mkdir -p /data

EXPOSE 8080

# Railway, Fly, Heroku et al inject $PORT. Fall back to 8080 for local runs.
# SIGNAL_HOST is canonical; RUBERRA_HOST stays readable for compat.
ENV SIGNAL_HOST=0.0.0.0 \
    PORT=8080

CMD python -c "import os, uvicorn; uvicorn.run('server:app', host='0.0.0.0', port=int(os.environ.get('PORT', '8080')))"
