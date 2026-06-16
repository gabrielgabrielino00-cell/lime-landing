# Apre le pagine per creare OAuth App reali
Start-Process "https://github.com/settings/applications/new"
Start-Sleep -Seconds 1
Start-Process "https://console.cloud.google.com/apis/credentials/oauthclient"
Start-Sleep -Seconds 1
Start-Process "http://localhost:3000/setup"
Write-Host ""
Write-Host "=== LimeForge OAuth Setup ===" -ForegroundColor Green
Write-Host "1. GitHub OAuth App:"
Write-Host "   Homepage URL:  http://localhost:3000"
Write-Host "   Callback URL:  http://localhost:3000/api/auth/callback/github"
Write-Host ""
Write-Host "2. Google OAuth Client (Web):"
Write-Host "   Redirect URI:  http://localhost:3000/api/auth/callback/google"
Write-Host ""
Write-Host "3. Incolla Client ID + Secret su http://localhost:3000/setup"
Write-Host "4. Riavvia: npm run dev"
Write-Host ""