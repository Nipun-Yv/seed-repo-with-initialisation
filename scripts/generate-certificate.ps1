# PowerShell script to generate local SSL certificate for Adobe Add-on development
# This script uses OpenSSL to create a self-signed certificate for localhost

Write-Host "Generating local SSL certificate for Adobe Add-on backend..." -ForegroundColor Green

# Create certificates directory if it doesn't exist
$certDir = Join-Path $PSScriptRoot "..\certs"
if (-not (Test-Path $certDir)) {
    New-Item -ItemType Directory -Path $certDir | Out-Null
    Write-Host "Created certificates directory: $certDir" -ForegroundColor Yellow
}

# Check if OpenSSL is available
$opensslPath = Get-Command openssl -ErrorAction SilentlyContinue
if (-not $opensslPath) {
    Write-Host "OpenSSL not found. Please install OpenSSL:" -ForegroundColor Red
    Write-Host "1. Download from: https://slproweb.com/products/Win32OpenSSL.html" -ForegroundColor Yellow
    Write-Host "2. Or install via Chocolatey: choco install openssl" -ForegroundColor Yellow
    Write-Host "3. Or use mkcert (recommended): choco install mkcert" -ForegroundColor Yellow
    exit 1
}

$keyPath = Join-Path $certDir "localhost.key"
$certPath = Join-Path $certDir "localhost.crt"
$csrPath = Join-Path $certDir "localhost.csr"
$extFile = Join-Path $certDir "extfile.cnf"

# Create extension file for Subject Alternative Names
$extContent = @"
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
DNS.2 = *.localhost
IP.1 = 127.0.0.1
IP.2 = ::1
"@

Set-Content -Path $extFile -Value $extContent

# Generate private key
Write-Host "Generating private key..." -ForegroundColor Cyan
openssl genrsa -out $keyPath 2048
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to generate private key" -ForegroundColor Red
    exit 1
}

# Generate certificate signing request
Write-Host "Generating certificate signing request..." -ForegroundColor Cyan
openssl req -new -key $keyPath -out $csrPath -subj "/C=US/ST=State/L=City/O=Adobe Add-on Dev/CN=localhost"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to generate CSR" -ForegroundColor Red
    exit 1
}

# Generate self-signed certificate
Write-Host "Generating self-signed certificate..." -ForegroundColor Cyan
openssl x509 -req -days 365 -in $csrPath -signkey $keyPath -out $certPath -extensions v3_req -extfile $extFile
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to generate certificate" -ForegroundColor Red
    exit 1
}

# Clean up CSR and ext file
Remove-Item $csrPath -ErrorAction SilentlyContinue
Remove-Item $extFile -ErrorAction SilentlyContinue

Write-Host "`nCertificate generated successfully!" -ForegroundColor Green
Write-Host "Certificate: $certPath" -ForegroundColor Yellow
Write-Host "Private Key: $keyPath" -ForegroundColor Yellow
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Trust the certificate in Windows:" -ForegroundColor White
Write-Host "   - Double-click localhost.crt" -ForegroundColor Gray
Write-Host "   - Click 'Install Certificate...'" -ForegroundColor Gray
Write-Host "   - Select 'Local Machine' and 'Place all certificates in the following store'" -ForegroundColor Gray
Write-Host "   - Browse to 'Trusted Root Certification Authorities'" -ForegroundColor Gray
Write-Host "   - Click OK and finish the wizard" -ForegroundColor Gray
Write-Host "`n2. Configure your dev server to use these certificates" -ForegroundColor White
Write-Host "`nNote: You may need to restart your browser after installing the certificate." -ForegroundColor Yellow
