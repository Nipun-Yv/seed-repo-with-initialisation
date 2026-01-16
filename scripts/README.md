# Certificate Generation Scripts

This directory contains scripts to generate local SSL certificates for Adobe Add-on development.

## Available Scripts

### PowerShell Script (`generate-certificate.ps1`)

Uses OpenSSL to generate a self-signed certificate.

**Prerequisites:**
- OpenSSL installed on Windows
- Install via: `choco install openssl` or download from [Win32 OpenSSL](https://slproweb.com/products/Win32OpenSSL.html)

**Usage:**
```powershell
.\scripts\generate-certificate.ps1
```

Or via npm:
```bash
npm run generate-cert:ps1
```

### Node.js Script (`generate-certificate.js`)

Uses the `selfsigned` npm package to generate certificates.

**Prerequisites:**
- `selfsigned` package (installed via `npm install`)

**Usage:**
```bash
node scripts/generate-certificate.js
```

Or via npm:
```bash
npm run generate-cert
```

## Output

Both scripts create:
- `certs/localhost.crt` - Certificate file
- `certs/localhost.key` - Private key file

## Next Steps

After generating certificates:

1. Trust the certificate in Windows (see [CERTIFICATE_SETUP.md](../CERTIFICATE_SETUP.md))
2. Configure your dev server to use these certificates
3. Restart your browser

For more details, see the main [CERTIFICATE_SETUP.md](../CERTIFICATE_SETUP.md) guide.
