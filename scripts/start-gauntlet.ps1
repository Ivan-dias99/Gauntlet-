# Gauntlet — PowerShell launcher
# Arranca o backend na porta 3002 (que a extensão espera) e abre o Chrome
# com instruções para carregar a extensão.
#
# Pré-requisitos:
#   - Python 3.11+ no PATH
#   - pip install -r backend\requirements.txt  (feito uma vez)
#   - Uma API key: ANTHROPIC_API_KEY  ou  GEMINI_API_KEY (free tier)
#
# Uso:
#   .\scripts\start-gauntlet.ps1
#   .\scripts\start-gauntlet.ps1 -ApiKey "sk-ant-..."
#   .\scripts\start-gauntlet.ps1 -Mock          # modo offline sem API key

param(
    [string]$ApiKey   = $env:ANTHROPIC_API_KEY,
    [string]$GeminiKey = $env:GEMINI_API_KEY,
    [switch]$Mock,
    [int]$Port        = 3002
)

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
$backend = Join-Path $root "backend"
$extensionOut = Join-Path $root "apps\browser-extension\.output\chrome-mv3"

# ── Banner ────────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "  ╔═══════════════════════════════════════════════════════╗" -ForegroundColor DarkYellow
Write-Host "  ║   G A U N T L E T  — start-gauntlet.ps1              ║" -ForegroundColor DarkYellow
Write-Host "  ╚═══════════════════════════════════════════════════════╝" -ForegroundColor DarkYellow
Write-Host ""

# ── Validação de API key ───────────────────────────────────────────────────
if (-not $Mock -and -not $ApiKey -and -not $GeminiKey) {
    Write-Host "[ERRO] Precisa de uma API key." -ForegroundColor Red
    Write-Host "       Opções:" -ForegroundColor Yellow
    Write-Host "         -ApiKey    'sk-ant-...'   (Anthropic)" -ForegroundColor Yellow
    Write-Host "         -GeminiKey 'AIza...'      (Gemini free tier)" -ForegroundColor Yellow
    Write-Host "         -Mock                     (offline, sem key)" -ForegroundColor Yellow
    exit 1
}

# ── Verificar build da extensão ────────────────────────────────────────────
if (-not (Test-Path $extensionOut)) {
    Write-Host "[INFO] Build da extensão não encontrado. A construir..." -ForegroundColor Cyan
    Push-Location (Join-Path $root "apps\browser-extension")
    npm install | Out-Null
    npm run build
    Pop-Location
}

# ── Configurar ambiente ────────────────────────────────────────────────────
$env:PORT = $Port

if ($ApiKey)    { $env:ANTHROPIC_API_KEY = $ApiKey }
if ($GeminiKey) { $env:GEMINI_API_KEY    = $GeminiKey }
if ($Mock)      { $env:GAUNTLET_MOCK     = "true" }

# Permitir que a extensão Chrome passe no CORS
$env:GAUNTLET_ORIGIN_REGEX = "^chrome-extension://"

Write-Host "[OK] Backend a iniciar em http://127.0.0.1:$Port" -ForegroundColor Green
if ($Mock) {
    Write-Host "[OK] Modo MOCK activo — sem chamadas reais à API" -ForegroundColor Yellow
} elseif ($ApiKey) {
    Write-Host "[OK] Provider: Anthropic" -ForegroundColor Green
} else {
    Write-Host "[OK] Provider: Gemini (free tier)" -ForegroundColor Green
}

Write-Host ""
Write-Host "  Próximo passo — carregar a extensão no Chrome:" -ForegroundColor White
Write-Host "    1. Abre chrome://extensions" -ForegroundColor Gray
Write-Host "    2. Activa Developer mode" -ForegroundColor Gray
Write-Host "    3. 'Load unpacked' → selecciona:" -ForegroundColor Gray
Write-Host "       $extensionOut" -ForegroundColor Cyan
Write-Host "    4. Vai a qualquer página e prime Ctrl+Shift+Space" -ForegroundColor Gray
Write-Host ""

# ── Arrancar o backend ─────────────────────────────────────────────────────
Push-Location $backend
try {
    python main.py
} finally {
    Pop-Location
}
