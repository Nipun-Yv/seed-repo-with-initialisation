# SSL Setup Instructions

This guide will help you set up SSL certificates using mkcert to run your React server with HTTPS on port 5142.

## Prerequisites

You need to have mkcert installed on your system. If you don't have it installed, follow one of these methods:

### Option 1: Install via winget (Recommended for Windows)
```powershell
# Run PowerShell as Administrator
winget install --id FiloSottile.mkcert -e
```

### Option 2: Install via Chocolatey
```powershell
# Run PowerShell as Administrator
choco install mkcert -y
```

### Option 3: Manual Installation
1. Download mkcert from [GitHub Releases](https://github.com/FiloSottile/mkcert/releases)
2. Extract the executable and add it to your PATH

## Setting Up SSL Certificates

### Automatic Setup (Recommended)

Run the provided PowerShell script:

```powershell
npm run setup-ssl
```

Or directly:
```powershell
powershell -ExecutionPolicy Bypass -File ./setup-ssl.ps1
```

### Manual Setup

If you prefer to set up certificates manually:

1. **Install the local CA** (only needed once):
   ```powershell
   mkcert -install
   ```

2. **Generate certificates for localhost**:
   ```powershell
   cd certs
   mkcert localhost 127.0.0.1 ::1
   ```

3. **Rename the certificate files** (if needed):
   - Rename `localhost+2-key.pem` to `localhost-key.pem`
   - Rename `localhost+2.pem` to `localhost.pem`

## Running the Server with HTTPS

After setting up the certificates, you can start the server with HTTPS:

```bash
npm run start:https
```

The server will be available at:
- **https://localhost:5142**

## How It Works

- The webpack configuration automatically detects if mkcert certificates exist in the `certs/` directory
- If certificates are found, it uses them for HTTPS
- If certificates are not found, it falls back to webpack's self-signed certificate (you'll see a browser warning)

## Troubleshooting

### Certificate files not found
- Make sure the certificates are in the `certs/` directory
- Verify the files are named `localhost-key.pem` and `localhost.pem`

### Browser security warnings
- If using mkcert certificates, make sure you've run `mkcert -install` to install the local CA
- If you see warnings with mkcert certificates, try clearing your browser cache

### Port already in use
- If port 5142 is already in use, you can change it in `webpack.config.js` in the `devServer.port` setting

## Files

- `certs/` - Directory containing SSL certificates (gitignored)
- `setup-ssl.ps1` - PowerShell script to automate certificate generation
- `webpack.config.js` - Contains the HTTPS dev server configuration
