"""
Signal — Entry Point
Start the conservative intelligence server.

Usage:
  python main.py

  Or with uvicorn directly:
  uvicorn server:app --host 127.0.0.1 --port 3002 --reload
"""

import uvicorn
from config import SERVER_HOST, SERVER_PORT


def main() -> None:
    """Launch the Signal backend."""
    print(
        "\n"
        "  ╔═══════════════════════════════════════════════════════╗\n"
        "  ║                                                       ║\n"
        "  ║   S I G N A L                                         ║\n"
        "  ║   Sovereign AI workspace — five chambers              ║\n"
        "  ║                                                       ║\n"
        "  ║   «Prefiro não responder a arriscar estar errado.»    ║\n"
        "  ║                                                       ║\n"
        "  ╚═══════════════════════════════════════════════════════╝\n"
    )
    
    uvicorn.run(
        "server:app",
        host=SERVER_HOST,
        port=SERVER_PORT,
        reload=True,
        log_level="info",
    )


if __name__ == "__main__":
    main()
