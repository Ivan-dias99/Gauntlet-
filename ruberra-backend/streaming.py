"""
Ruberra — Anthropic messages streaming adapter.

Wraps the real ``AsyncAnthropic.messages.stream`` and the mock client
under one async-iterator interface that yields normalized events:

    {"type": "text_delta", "text": str}
    {"type": "content_block_stop", "block_type": str}
    {"type": "final", "message": <full response object>}

Why normalize: the agent loop wants token-by-token deltas for a live UI,
but still needs the fully assembled response (tool_use blocks, usage
counters) to continue the loop. The SDK's native stream supports both,
and we expose both through a single generator so the agent is identical
regardless of whether it's talking to the API or the mock.
"""

from __future__ import annotations

import logging
from typing import Any, AsyncIterator

logger = logging.getLogger("ruberra.streaming")


async def stream_messages(
    client: Any, **params: Any,
) -> AsyncIterator[dict[str, Any]]:
    """Stream a messages.create call, yielding normalized events."""
    # Detect the mock — it exposes a ``stream`` attribute on its messages
    # wrapper only when we added it. Both real and mock now support
    # ``.stream()``; dispatch on the presence of a ``get_final_message``
    # coroutine on the returned manager.
    manager = client.messages.stream(**params)

    async with manager as stream:
        async for event in stream:
            etype = getattr(event, "type", None)
            if etype == "content_block_delta":
                delta = getattr(event, "delta", None)
                if delta is not None and getattr(delta, "type", "") == "text_delta":
                    text = getattr(delta, "text", "") or ""
                    if text:
                        yield {"type": "text_delta", "text": text}
            elif etype == "content_block_stop":
                # useful for separating consecutive text blocks in the UI
                yield {"type": "content_block_stop"}
            # message_start / message_delta / message_stop are ignored here
            # — the final message is fetched after the stream exits.

        final = await stream.get_final_message()
        yield {"type": "final", "message": final}
