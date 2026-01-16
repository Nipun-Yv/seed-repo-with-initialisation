#!/usr/bin/env node

/**
 * Node.js script to generate local SSL certificate for Adobe Add-on development
 * This script uses the 'selfsigned' npm package to create a self-signed certificate
 * 
 * Install dependencies: npm install --save-dev selfsigned
 * Run: node scripts/generate-certificate.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const certDir = path.join(__dirname, '..', 'certs');
const keyPath = path.join(certDir, 'localhost.key');
const certPath = path.join(certDir, 'localhost.crt');

// Check if selfsigned package is available
let selfsigned;
try {
    selfsigned = require('selfsigned');
} catch (e) {
    console.error('Error: selfsigned package not found.');
    console.log('Please install it: npm install --save-dev selfsigned');
    process.exit(1);
}

// Create certificates directory if it doesn't exist
if (!fs.existsSync(certDir)) {
    fs.mkdirSync(certDir, { recursive: true });
    console.log(`Created certificates directory: ${certDir}`);
}

console.log('Generating local SSL certificate for Adobe Add-on backend...\n');

// Generate certificate attributes
const attrs = [
    { name: 'commonName', value: 'localhost' },
    { name: 'organizationName', value: 'Adobe Add-on Dev' },
    { name: 'countryName', value: 'US' }
];

const options = {
    keySize: 2048,
    days: 365,
    algorithm: 'sha256',
    extensions: [
        {
            name: 'basicConstraints',
            cA: false
        },
        {
            name: 'keyUsage',
            keyCertSign: false,
            digitalSignature: true,
            nonRepudiation: true,
            keyEncipherment: true,
            dataEncipherment: true
        },
        {
            name: 'subjectAltName',
            altNames: [
                { type: 2, value: 'localhost' },
                { type: 2, value: '*.localhost' },
                { type: 7, ip: '127.0.0.1' },
                { type: 7, ip: '::1' }
            ]
        }
    ]
};

try {
    const pems = selfsigned.generate(attrs, options);
    
    // Write certificate and key files
    fs.writeFileSync(certPath, pems.cert);
    fs.writeFileSync(keyPath, pems.private);
    
    console.log('✓ Certificate generated successfully!\n');
    console.log(`Certificate: ${certPath}`);
    console.log(`Private Key: ${keyPath}\n`);
    
    console.log('Next steps:');
    console.log('1. Trust the certificate in Windows:');
    console.log('   - Double-click localhost.crt');
    console.log('   - Click "Install Certificate..."');
    console.log('   - Select "Local Machine" and "Place all certificates in the following store"');
    console.log('   - Browse to "Trusted Root Certification Authorities"');
    console.log('   - Click OK and finish the wizard\n');
    console.log('2. Configure your dev server to use these certificates\n');
    console.log('Note: You may need to restart your browser after installing the certificate.');
    
} catch (error) {
    console.error('Error generating certificate:', error.message);
    process.exit(1);
}
