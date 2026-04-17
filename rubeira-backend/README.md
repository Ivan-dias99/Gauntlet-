# Rubeira V1 — Conservative Intelligence Backend

> *«Prefiro não responder a arriscar estar errado.»*

## Architecture

```
rubeira-backend/
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

## How It Works

### Pipeline (every query goes through this)

```
User Question
     │
     ▼
┌─────────────────┐
│ Failure Memory   │ ← Check if similar question failed before
│ Lookup           │
└────────┬────────┘
         │
         ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Claude Sonnet    │    │ Claude Sonnet    │    │ Claude Sonnet    │
│ Call #1          │    │ Call #2          │    │ Call #3          │
│ (temp=0.15)      │    │ (temp=0.15)      │    │ (temp=0.15)      │
└────────┬────────┘    └────────┬────────┘    └────────┬────────┘
         │                      │                      │
         └──────────┬───────────┘──────────────────────┘
                    │
                    ▼
         ┌─────────────────┐
         │ JUDGE            │
         │ (temp=0.05)      │
         │ Implacable       │
         │ Consistency      │
         │ Arbiter          │
         └────────┬────────┘
                  │
                  ▼
         ┌─────────────────┐
         │ Decision Logic   │
         │                  │
         │ HIGH   → Answer  │
         │ MEDIUM → Caveats │
         │ LOW    → REFUSE  │
         └────────┬────────┘
                  │
                  ▼ (if refused)
         ┌─────────────────┐
         │ Record Failure   │
         │ in Memory        │
         └─────────────────┘
```

### Confidence Levels

| Level | Condition | Action |
|-------|-----------|--------|
| **HIGH** | All 3 responses identical in substance | Deliver with full conviction |
| **MEDIUM** | Small acceptable variations | Deliver with explicit caveats |
| **LOW** | Any relevant divergence | **REFUSE to answer** |

### Failure Memory

- Persists to `data/failure_memory.json`
- Uses word-overlap similarity for fuzzy matching
- Increments failure counters for repeat questions
- Injects failure context into the system prompt for extra caution
- Configurable thresholds and window size

## Quick Start

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Set your API key
$env:ANTHROPIC_API_KEY = "sk-ant-..."

# 3. Start the server
python main.py
```

Server runs at `http://127.0.0.1:3002`

## API Endpoints

### `POST /ask` — Ask a question
```json
{
  "question": "What is the capital of Portugal?",
  "context": "Optional additional context",
  "force_cautious": false
}
```

**Response:**
```json
{
  "id": "uuid",
  "answer": "The answer (or null if refused)",
  "refused": false,
  "confidence": "high",
  "confidence_explanation": "...",
  "triad_agreement": "...",
  "judge_reasoning": "...",
  "processing_time_ms": 3200,
  "matched_prior_failure": false
}
```

### `GET /health` — Health check
### `GET /diagnostics` — Full system state
### `GET /memory/stats` — Failure memory statistics
### `GET /memory/failures` — List failure records
### `POST /memory/clear` — Clear failure memory

## The 3 Sacred Prompts

1. **System Prompt (Doctrine)** — Injected into every triad call. Makes Rubeira fear error above all else. Forces epistemic honesty, structured uncertainty classification, and explicit limitation disclosure.

2. **Judge Prompt (Arbiter)** — Evaluates the 3 triad responses. Merciless consistency checker. Numbers are sacred. Silence is signal. When in doubt, downgrade.

3. **Response Assembly** — Templates for building user-facing answers with appropriate confidence wrappers, refusal messages, and failure memory alerts. All in Portuguese.

## Integration with Ruberra Frontend

The backend runs on port 3002 (configurable). The frontend can call `/ask` to submit questions. Add to your `.env`:

```
VITE_RUBEIRA_AI_URL=http://localhost:3002
```
