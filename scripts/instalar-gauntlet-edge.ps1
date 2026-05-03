# Gauntlet — Instalador automático para Edge
# Descarrega a extensão do GitHub, extrai no Desktop e abre o Edge.
# Não precisa de Git, Node.js, nem nada instalado.
#
# Como usar — cola isto no PowerShell e prime Enter:
#   irm https://raw.githubusercontent.com/Ivan-dias99/Aiinterfaceshelldesign/claude/test-extension-model-ysbmq/scripts/instalar-gauntlet-edge.ps1 | iex

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "  GAUNTLET — instalador Edge" -ForegroundColor DarkYellow
Write-Host ""

# ── Destino ────────────────────────────────────────────────────────────────
$dest = Join-Path $env:USERPROFILE "Desktop\gauntlet-extension"
$zip  = Join-Path $env:TEMP "gauntlet-edge.zip"

# ── Download ───────────────────────────────────────────────────────────────
$url = "https://raw.githubusercontent.com/Ivan-dias99/Aiinterfaceshelldesign/claude/test-extension-model-ysbmq/scripts/gauntlet-edge.zip"

Write-Host "[1/3] A descarregar extensao..." -ForegroundColor Cyan
Invoke-WebRequest -Uri $url -OutFile $zip -UseBasicParsing
Write-Host "      OK ($([math]::Round((Get-Item $zip).Length/1KB))KB)" -ForegroundColor Green

# ── Extrair ────────────────────────────────────────────────────────────────
Write-Host "[2/3] A extrair para o Desktop..." -ForegroundColor Cyan
if (Test-Path $dest) { Remove-Item $dest -Recurse -Force }
Expand-Archive -Path $zip -DestinationPath $dest
# o zip tem uma pasta chrome-mv3 dentro
$extPath = Join-Path $dest "chrome-mv3"
Write-Host "      $extPath" -ForegroundColor Green

# ── Abrir Edge ─────────────────────────────────────────────────────────────
Write-Host "[3/3] A abrir Edge com a extensao..." -ForegroundColor Cyan
$edgePaths = @(
    "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    "C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    "$env:LOCALAPPDATA\Microsoft\Edge\Application\msedge.exe"
)
$edge = $edgePaths | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $edge) {
    Write-Host "[ERRO] Edge nao encontrado. Instala em microsoft.com/edge" -ForegroundColor Red
    exit 1
}
Start-Process -FilePath $edge -ArgumentList "--load-extension=`"$extPath`"", "--no-first-run"

Write-Host ""
Write-Host "  PRONTO." -ForegroundColor Green
Write-Host ""
Write-Host "  No Edge que abriu:" -ForegroundColor White
Write-Host "    1. Vai a  edge://extensions/" -ForegroundColor Gray
Write-Host "    2. Liga o  Developer mode  (canto inferior esquerdo)" -ForegroundColor Gray
Write-Host "    3. Confirma que 'Gauntlet' aparece" -ForegroundColor Gray
Write-Host "    4. Abre qualquer site e prime  Ctrl+Shift+Space" -ForegroundColor Gray
Write-Host ""
