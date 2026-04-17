"""
Rubeira V1 — Entry Point
Start the conservative intelligence server.

Usage:
  python main.py
  
  Or with uvicorn directly:
  uvicorn server:app --host 127.0.0.1 --port 3002 --reload
"""

import uvicorn
from config import SERVER_HOST, SERVER_PORT


def main() -> None:
    """Launch the Rubeira V1 server."""
    print(
        "\n"
        "  ╔═══════════════════════════════════════════════════════╗\n"
        "  ║                                                       ║\n"
        "  ║   R U B E I R A   V 1                                 ║\n"
        "  ║   Conservative Intelligence System                    ║\n"
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
