# LimeForge — avvio pulito (usa SEMPRE questo)
$ErrorActionPreference = "SilentlyContinue"

# UTF-8 — testo leggibile in PowerShell
chcp 65001 | Out-Null
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()
$OutputEncoding = [System.Text.UTF8Encoding]::new()

$ProjectRoot = Split-Path $PSScriptRoot -Parent
Set-Location $ProjectRoot

Clear-Host
Write-Host ""
Write-Host "  ========================================" -ForegroundColor Cyan
Write-Host "   LimeForge - Dev Server" -ForegroundColor Green
Write-Host "  ========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Cartella: $ProjectRoot" -ForegroundColor DarkGray
Write-Host ""

# Chiudi vecchi server sulla porta 3000
$conns = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
foreach ($c in $conns) {
  if ($c.OwningProcess -gt 0) {
    Stop-Process -Id $c.OwningProcess -Force -ErrorAction SilentlyContinue
    Write-Host "  Chiuso processo vecchio (PID $($c.OwningProcess))" -ForegroundColor DarkYellow
  }
}

Write-Host ""
Write-Host "  Apri:  http://localhost:3000" -ForegroundColor Yellow
Write-Host "  Login: Continue as Dev User (local)" -ForegroundColor Yellow
Write-Host "  Stop:  Ctrl+C" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  ----------------------------------------" -ForegroundColor DarkGray
Write-Host ""

# Avvia Next.js (in primo piano — vedi tutto l'output)
& npx next dev