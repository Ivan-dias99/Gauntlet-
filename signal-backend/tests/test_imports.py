"""All-modules-import smoke. Cheap, fast, catches Ruberra-purge regressions."""

import importlib

MODULES = (
    "config", "db", "models", "tools", "memory", "runs", "spine",
    "engine", "agent", "crew", "server", "main", "mock_client",
    "chambers", "chambers.profiles",
    "chambers.insight", "chambers.surface", "chambers.terminal",
    "chambers.archive", "chambers.core",
)


def test_all_backend_modules_import():
    for mod in MODULES:
        importlib.import_module(mod)


def test_no_ruberra_symbol_left_in_config():
    import config
    assert not hasattr(config, "RUBERRA_MOCK")
    assert hasattr(config, "SIGNAL_MOCK")


def test_no_ruberra_helper_in_tools():
    import tools
    # _env legacy helper was removed when SIGNAL_* became the only env names.
    assert not hasattr(tools, "_env")
    assert hasattr(tools, "SIGNAL_ALLOW_CODE_EXEC")
