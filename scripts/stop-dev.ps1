# Ferma il server LimeForge
$ErrorActionPreference = "SilentlyContinue"

Write-Host ""
Write-Host "Fermo server sulla porta 3000..." -ForegroundColor Yellow

$killed = 0
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | ForEach-Object {
  if ($_.OwningProcess -gt 0) {
    Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
    $killed++
  }
}

if ($killed -gt 0) {
  Write-Host "Chiusi $killed processo/i." -ForegroundColor Green
} else {
  Write-Host "Nessun server attivo sulla porta 3000." -ForegroundColor DarkGray
}
Write-Host ""