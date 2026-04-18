# Ruberra V1 — Conservative Intelligence Backend

> *«Prefiro não responder a arriscar estar errado.»*

## Architecture

```
ruberra-backend/
├── main.py           # Entry point — starts uvicorn
├── server.py         # FastAPI app, endpoints, CORS
├── engine.py         # Self-consistency engine (triad + judge + decision)
├── doctrine.py       # The 3 sacred prompts (system, judge, response)
├── memory.py         # Persistent failure memory system
├── models.py         # Pydantic models for all contracts
├── config.py         # Configuration (env-driven)
├── data/             # Auto-created — failure memory persistence
│   └── failure_memory.json
├── requirements.txt
└── .env.example
```

## Quick Start

```bash
pip install -r requirements.txt
$env:ANTHROPIC_API_KEY = "sk-ant-..."
python main.py
```

Server at `http://127.0.0.1:3002` — main endpoint: `POST /ask`
