# Gauntlet — Carrega a extensão no Microsoft Edge (Developer Mode)
#
# Uso:
#   .\scripts\load-extension-edge.ps1
#
# O script:
#   1. Localiza o Edge instalado
#   2. Faz build da extensão se necessário
#   3. Abre o Edge com a extensão já carregada (--load-extension)
#   4. Abre edge://extensions/ para confirmares

param(
    [switch]$SkipBuild,
    [switch]$OpenExtensionsPage
)

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
$extDir  = Join-Path $root "apps\browser-extension"
$outDir  = Join-Path $extDir ".output\chrome-mv3"

# ── Banner ─────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "  ╔═══════════════════════════════════════════════════════╗" -ForegroundColor DarkYellow
Write-Host "  ║   G A U N T L E T  — Edge Loader                     ║" -ForegroundColor DarkYellow
Write-Host "  ╚═══════════════════════════════════════════════════════╝" -ForegroundColor DarkYellow
Write-Host ""

# ── Localizar Edge ─────────────────────────────────────────────────────────
$edgePaths = @(
    "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    "C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    "$env:LOCALAPPDATA\Microsoft\Edge\Application\msedge.exe"
)
$edgeExe = $edgePaths | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $edgeExe) {
    Write-Host "[ERRO] Microsoft Edge não encontrado." -ForegroundColor Red
    Write-Host "       Instala em https://microsoft.com/edge" -ForegroundColor Yellow
    exit 1
}
Write-Host "[OK] Edge encontrado: $edgeExe" -ForegroundColor Green

# ── Build da extensão ───────────────────────────────────────────────────────
if (-not $SkipBuild) {
    if (-not (Test-Path $outDir)) {
        Write-Host "[INFO] Build não encontrado. A construir..." -ForegroundColor Cyan
    } else {
        Write-Host "[INFO] A reconstruir extensão..." -ForegroundColor Cyan
    }
    Push-Location $extDir
    try {
        if (-not (Test-Path "node_modules")) {
            Write-Host "       npm install..." -ForegroundColor Gray
            npm install | Out-Null
        }
        npm run build
        if ($LASTEXITCODE -ne 0) {
            Write-Host "[ERRO] Build falhou." -ForegroundColor Red
            exit 1
        }
    } finally {
        Pop-Location
    }
    Write-Host "[OK] Build concluído: $outDir" -ForegroundColor Green
} else {
    if (-not (Test-Path $outDir)) {
        Write-Host "[ERRO] -SkipBuild activo mas build não existe em: $outDir" -ForegroundColor Red
        exit 1
    }
    Write-Host "[OK] A usar build existente: $outDir" -ForegroundColor Green
}

# ── Abrir Edge com a extensão ───────────────────────────────────────────────
Write-Host ""
Write-Host "[INFO] A abrir Edge com a extensão carregada..." -ForegroundColor Cyan
Write-Host "       Pasta: $outDir" -ForegroundColor Gray
Write-Host ""

$args = @(
    "--load-extension=`"$outDir`"",
    "--no-first-run"
)

if ($OpenExtensionsPage) {
    $args += "edge://extensions/"
}

Start-Process -FilePath $edgeExe -ArgumentList $args

Write-Host "[OK] Edge aberto." -ForegroundColor Green
Write-Host ""
Write-Host "  Próximos passos:" -ForegroundColor White
Write-Host "    1. Vai a  edge://extensions/" -ForegroundColor Gray
Write-Host "    2. Activa 'Developer mode' (canto inferior esquerdo)" -ForegroundColor Gray
Write-Host "    3. Confirma que 'Gauntlet' aparece na lista" -ForegroundColor Gray
Write-Host "    4. Abre qualquer página e prime  Ctrl+Shift+Space" -ForegroundColor Gray
Write-Host ""
Write-Host "  Backend:  https://ruberra-backend-jkpf-production.up.railway.app" -ForegroundColor Cyan
Write-Host "  Hotkey:   Ctrl+Shift+Space" -ForegroundColor Cyan
Write-Host ""

# ── Nota Railway ────────────────────────────────────────────────────────────
Write-Host "  IMPORTANTE — antes de testar, confirma no Railway:" -ForegroundColor Yellow
Write-Host "    - ANTHROPIC_API_KEY  deve estar VAZIA ou removida" -ForegroundColor Yellow
Write-Host "    - GEMINI_API_KEY     deve estar definida (key válida)" -ForegroundColor Yellow
Write-Host "    - Faz Redeploy se alteraste as variáveis" -ForegroundColor Yellow
Write-Host ""
