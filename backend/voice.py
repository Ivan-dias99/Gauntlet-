"""
Voice — speech-to-text (Groq Whisper) + text-to-speech (Edge TTS).

Doctrine:
  * Backend gordo, composer mínimo. The cápsula records audio in
    MediaRecorder (browser-shell) or via the Tauri webview's MediaStream
    (desktop-shell), packages it as base64 over the existing JSON
    transport, and the backend does the heavy lift: Groq Whisper for
    transcription, Microsoft Edge's neural voices via `edge-tts` for
    synthesis. Both providers are free.
  * Single transport. We keep payloads JSON-only so the same transport
    seam (`fetchJson`) works in every shell — including the in-page
    overlay, which can only fetch via the service-worker proxy that
    handles strings, not multipart blobs. Base64 inflation (~33%) is the
    cost of that uniformity.

Endpoints:
  POST /voice/transcribe  — { audio_base64, mime, language? } -> { text, model_used }
  POST /voice/synthesize  — { text, voice?, rate?, pitch? }   -> { audio_base64, mime }

Both endpoints fail soft: when the API key (Groq) or runtime (edge-tts)
is unavailable, the endpoint returns 503 with a typed envelope and the
cápsula falls back to Web Speech API.
"""
from __future__ import annotations

import base64
import io
import os
from typing import Any, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field


# ── Config ──────────────────────────────────────────────────────────────────

GROQ_API_KEY = (
    os.environ.get("GAUNTLET_GROQ_API_KEY")
    or os.environ.get("GROQ_API_KEY")
)
GROQ_WHISPER_MODEL = os.environ.get(
    "GAUNTLET_GROQ_WHISPER_MODEL", "whisper-large-v3-turbo"
)

# Default Edge TTS voice — Microsoft's PT-PT neural female voice. The
# operator can override per call. Other recommended voices:
#   pt-PT-DuarteNeural / pt-BR-AntonioNeural / en-US-AriaNeural
EDGE_TTS_DEFAULT_VOICE = os.environ.get(
    "GAUNTLET_EDGE_TTS_VOICE", "pt-PT-RaquelNeural"
)


# ── Schemas ─────────────────────────────────────────────────────────────────


class TranscribeRequest(BaseModel):
    audio_base64: str = Field(..., min_length=1)
    mime: str = "audio/webm"
    language: Optional[str] = None


class TranscribeResponse(BaseModel):
    text: str
    model_used: str
    duration_ms: int


class SynthesizeRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=4000)
    voice: Optional[str] = None
    rate: Optional[str] = None  # "+10%" / "-5%"
    pitch: Optional[str] = None  # "+2Hz"


class SynthesizeResponse(BaseModel):
    audio_base64: str
    mime: str = "audio/mpeg"


# ── Router ──────────────────────────────────────────────────────────────────

router = APIRouter(prefix="/voice", tags=["voice"])


@router.post("/transcribe", response_model=TranscribeResponse)
async def transcribe(req: TranscribeRequest) -> TranscribeResponse:
    """Audio → text via Groq Whisper. Free tier; latency typically <300 ms."""
    if not GROQ_API_KEY:
        raise HTTPException(
            status_code=503,
            detail={
                "error": "voice_unavailable",
                "reason": "no_groq_key",
                "message": (
                    "GAUNTLET_GROQ_API_KEY not set. The cápsula will fall "
                    "back to Web Speech API."
                ),
            },
        )

    try:
        from groq import Groq  # type: ignore
    except ImportError as exc:  # pragma: no cover — caught at deploy
        raise HTTPException(
            status_code=503,
            detail={
                "error": "voice_unavailable",
                "reason": "groq_sdk_missing",
                "message": str(exc),
            },
        )

    try:
        audio_bytes = base64.b64decode(req.audio_base64, validate=True)
    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail={
                "error": "bad_audio",
                "reason": "base64_decode_failed",
                "message": str(exc),
            },
        )

    if len(audio_bytes) == 0:
        raise HTTPException(
            status_code=400,
            detail={
                "error": "bad_audio",
                "reason": "empty_payload",
                "message": "audio_base64 decoded to zero bytes",
            },
        )

    # Best-effort filename hint — Groq's SDK uses it for MIME inference.
    suffix = "webm"
    if "ogg" in req.mime:
        suffix = "ogg"
    elif "wav" in req.mime:
        suffix = "wav"
    elif "mp3" in req.mime or "mpeg" in req.mime:
        suffix = "mp3"
    elif "mp4" in req.mime or "m4a" in req.mime:
        suffix = "m4a"

    import time

    t0 = time.perf_counter()
    client = Groq(api_key=GROQ_API_KEY)
    file_obj = io.BytesIO(audio_bytes)
    file_obj.name = f"voice.{suffix}"  # type: ignore[attr-defined]

    try:
        result: Any = client.audio.transcriptions.create(
            file=file_obj,
            model=GROQ_WHISPER_MODEL,
            language=req.language,
            response_format="text",
        )
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail={
                "error": "transcribe_failed",
                "reason": type(exc).__name__,
                "message": str(exc),
            },
        )

    text = result if isinstance(result, str) else getattr(result, "text", str(result))
    return TranscribeResponse(
        text=text.strip(),
        model_used=GROQ_WHISPER_MODEL,
        duration_ms=int((time.perf_counter() - t0) * 1000),
    )


@router.post("/synthesize", response_model=SynthesizeResponse)
async def synthesize(req: SynthesizeRequest) -> SynthesizeResponse:
    """Text → MP3 via Microsoft Edge TTS. Zero-cost neural voices."""
    try:
        import edge_tts  # type: ignore
    except ImportError as exc:  # pragma: no cover
        raise HTTPException(
            status_code=503,
            detail={
                "error": "voice_unavailable",
                "reason": "edge_tts_missing",
                "message": (
                    f"edge-tts not installed: {exc}. Run "
                    "`pip install edge-tts` in the backend venv."
                ),
            },
        )

    voice = (req.voice or EDGE_TTS_DEFAULT_VOICE).strip()
    kwargs: dict[str, str] = {}
    if req.rate:
        kwargs["rate"] = req.rate
    if req.pitch:
        kwargs["pitch"] = req.pitch

    try:
        communicate = edge_tts.Communicate(req.text, voice, **kwargs)
        chunks: list[bytes] = []
        async for chunk in communicate.stream():
            if chunk.get("type") == "audio":
                data = chunk.get("data")
                if isinstance(data, (bytes, bytearray)):
                    chunks.append(bytes(data))
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail={
                "error": "synthesize_failed",
                "reason": type(exc).__name__,
                "message": str(exc),
            },
        )

    if not chunks:
        raise HTTPException(
            status_code=502,
            detail={
                "error": "synthesize_failed",
                "reason": "empty_stream",
                "message": "edge-tts returned no audio chunks",
            },
        )

    audio = b"".join(chunks)
    return SynthesizeResponse(
        audio_base64=base64.b64encode(audio).decode("ascii"),
        mime="audio/mpeg",
    )
