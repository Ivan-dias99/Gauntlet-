"""Gauntlet HTTP routers — one module per domain.

Mounted by server.py via ``app.include_router`` after the middleware
stack is configured. Routers access the engine via runtime.require_engine
(typed 503 when not ready) instead of reading a server-level global.
"""
