param(
  [ValidateSet("start", "stop", "status", "tail")]
  [string]$Action = "status"
)

$ErrorActionPreference = "Stop"

$RepoRoot = Split-Path -Parent $PSScriptRoot
$LogPath = Join-Path $RepoRoot "ops\CODEX_LOOP_STATE.log"
$StatePath = Join-Path $RepoRoot "ops\CODEX_LOOP_STATE.json"

function Get-CodexLoopProcess {
  Get-CimInstance Win32_Process |
    Where-Object { $_.CommandLine -match "lane:codex:loop" -and $_.CommandLine -match "npm" }
}

switch ($Action) {
  "start" {
    Set-Location $RepoRoot
    $null = New-Item -ItemType Directory -Force -Path (Join-Path $RepoRoot "ops")
    Start-Process powershell -ArgumentList "-NoProfile -ExecutionPolicy Bypass -Command `"cd '$RepoRoot'; npm run lane:codex:loop *>> ops\CODEX_LOOP_STATE.log`""
    Start-Sleep -Seconds 1
    $p = Get-CodexLoopProcess
    if ($p) {
      Write-Host "Codex loop started (PID):" ($p.ProcessId -join ", ")
    } else {
      Write-Host "Codex loop start requested, but process not detected yet."
    }
  }

  "stop" {
    $p = Get-CodexLoopProcess
    if (-not $p) {
      Write-Host "No codex loop process found."
      break
    }
    foreach ($proc in $p) {
      Stop-Process -Id $proc.ProcessId -Force
    }
    Write-Host "Codex loop stopped."
  }

  "status" {
    $p = Get-CodexLoopProcess
    if ($p) {
      Write-Host "Codex loop running (PID):" ($p.ProcessId -join ", ")
    } else {
      Write-Host "Codex loop not running."
    }
    if (Test-Path $StatePath) {
      Write-Host "Last state file: $StatePath"
      Get-Content $StatePath
    } else {
      Write-Host "State file not found yet: $StatePath"
    }
  }

  "tail" {
    if (-not (Test-Path $LogPath)) {
      Write-Host "Log not found yet: $LogPath"
      break
    }
    Get-Content $LogPath -Wait
  }
}

