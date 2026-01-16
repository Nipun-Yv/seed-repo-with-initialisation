# PowerShell script to set up SSL certificates using mkcert

Write-Host "Setting up SSL certificates for localhost..." -ForegroundColor Cyan

# Check if mkcert is installed
$mkcertInstalled = Get-Command mkcert -ErrorAction SilentlyContinue

if (-not $mkcertInstalled) {
    Write-Host "mkcert is not installed. Installing via winget..." -ForegroundColor Yellow
    Write-Host "Please run this script as Administrator or install mkcert manually:" -ForegroundColor Yellow
    Write-Host "  Option 1: Run PowerShell as Administrator and run: winget install --id FiloSottile.mkcert -e" -ForegroundColor Yellow
    Write-Host "  Option 2: Download from https://github.com/FiloSottile/mkcert/releases" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "After installing mkcert, run this script again." -ForegroundColor Yellow
    exit 1
}

# Create certs directory if it doesn't exist
$certsDir = Join-Path $PSScriptRoot "certs"
if (-not (Test-Path $certsDir)) {
    New-Item -ItemType Directory -Path $certsDir | Out-Null
    Write-Host "Created certs directory" -ForegroundColor Green
}

# Install local CA (only needed once)
Write-Host "Installing local CA (this may require admin rights)..." -ForegroundColor Cyan
mkcert -install

# Generate certificates for localhost
Write-Host "Generating certificates for localhost..." -ForegroundColor Cyan
Set-Location $certsDir
mkcert localhost 127.0.0.1 ::1

# Move certificates to the correct location if they were created in the wrong place
$keyFile = "localhost+2-key.pem"
$certFile = "localhost+2.pem"

if (Test-Path $keyFile) {
    Move-Item -Force $keyFile "localhost-key.pem"
    Write-Host "Renamed key file" -ForegroundColor Green
}

if (Test-Path $certFile) {
    Move-Item -Force $certFile "localhost.pem"
    Write-Host "Renamed certificate file" -ForegroundColor Green
}

# Check if files exist with the expected names
if (Test-Path "localhost-key.pem" -and Test-Path "localhost.pem") {
    Write-Host ""
    Write-Host "✓ SSL certificates generated successfully!" -ForegroundColor Green
    Write-Host "  Key: $certsDir\localhost-key.pem" -ForegroundColor Gray
    Write-Host "  Cert: $certsDir\localhost.pem" -ForegroundColor Gray
    Write-Host ""
    Write-Host "You can now run 'npm start' to start the server with HTTPS." -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "✗ Failed to generate certificates. Please check the output above." -ForegroundColor Red
    exit 1
}

Set-Location $PSScriptRoot
