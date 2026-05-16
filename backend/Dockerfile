# syntax=docker/dockerfile:1.7
# ── Build stage ────────────────────────────────────────────────────────────
# Wheels are compiled here; the runtime stage copies them only. Keeps
# pip + build toolchain out of the shipped image and trims attack
# surface (no pip in the final layer means a process compromise can't
# `pip install` arbitrary packages).
FROM python:3.12-slim AS build

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

COPY requirements.txt ./
RUN pip wheel --no-deps --wheel-dir /wheels -r requirements.txt \
    && pip wheel --wheel-dir /wheels -r requirements.txt

# ── Runtime stage ───────────────────────────────────────────────────────────
FROM python:3.12-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Drop privileges. The user is created with no shell login and a fixed
# uid so volume permissions are predictable across hosts. /app and /data
# are owned by gauntlet:gauntlet so the worker can write run/memory
# state without escalating.
RUN groupadd --system --gid 1001 gauntlet \
    && useradd --system --uid 1001 --gid gauntlet --home-dir /app \
       --shell /usr/sbin/nologin gauntlet

WORKDIR /app

COPY --from=build /wheels /wheels
RUN pip install --no-index --find-links=/wheels /wheels/*.whl \
    && rm -rf /wheels

# Source last so dep changes don't bust the dep-install layer cache.
COPY --chown=gauntlet:gauntlet . .

# Persistent state directory. In production this path MUST be a mounted
# volume (Railway volume, Fly volume, etc.) — otherwise every restart
# wipes failure memory, run log, and spine snapshot.
ENV GAUNTLET_DATA_DIR=/data
# Tool workspace root. Without this, ``Path(__file__).resolve().parent.parent``
# under /app resolves to ``/`` — turning every SAFE command (ls/cat/grep)
# into a container-wide reader. Pin to /data so SAFE reads and file ops
# are scoped to the persistent volume; tools.py also fails closed if the
# resolved root is ``/`` as a belt-and-braces against a misconfigured deploy.
ENV GAUNTLET_WORKSPACE=/data
RUN mkdir -p /data && chown gauntlet:gauntlet /data

USER gauntlet

EXPOSE 8080

# Railway, Fly, Heroku et al inject $PORT. Fall back to 8080 for local runs.
ENV GAUNTLET_HOST=0.0.0.0 \
    PORT=8080

# Liveness probe — orchestrators should hit /health (cheap, no engine
# touch). 15 s start_period covers cold imports; the 30 s interval
# matches Railway's default.
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD python -c "import os, urllib.request, sys; \
sys.exit(0 if urllib.request.urlopen('http://127.0.0.1:'+os.environ.get('PORT','8080')+'/health', timeout=3).status == 200 else 1)"

CMD ["python", "-c", "import os, uvicorn; uvicorn.run('server:app', host='0.0.0.0', port=int(os.environ.get('PORT', '8080')))"]
