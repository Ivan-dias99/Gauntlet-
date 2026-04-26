import os
import sys
import tempfile
from pathlib import Path

import pytest

# Run all tests in mock mode so no Anthropic key is needed.
os.environ.setdefault("SIGNAL_MOCK", "1")
# Use a fresh temp data dir per session so tests never write into the real
# /data volume or the developer's local sidecars.
_TMP_DATA = tempfile.mkdtemp(prefix="signal-test-")
os.environ.setdefault("SIGNAL_DATA_DIR", _TMP_DATA)

# Make the backend modules importable when pytest is invoked from the repo root.
_BACKEND_ROOT = Path(__file__).resolve().parent.parent
if str(_BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(_BACKEND_ROOT))


@pytest.fixture
def db_dir() -> Path:
    return Path(_TMP_DATA)
