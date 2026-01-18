import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

// Embedded Grabby Plugin (to ensure it loads reliably without dynamic import issues)
const grabbySyncPlugin = () => ({
    name: 'grabby-sync-plugin',
    configureServer(server) {
        server.middlewares.use((req, res, next) => {
            if (req.url === '/__grabby_sync' && req.method === 'POST') {
                let body = '';
                req.on('data', (chunk) => {
                    body += chunk.toString();
                });
                req.on('end', () => {
                    try {
                        const data = JSON.parse(body);
                        if (!data.tagName) throw new Error('Invalid payload');

                        const filePath = path.resolve(process.cwd(), '.grabbed_element');
                        fs.writeFileSync(
                            filePath,
                            JSON.stringify({ ...data, timestamp: new Date().toISOString() }, null, 2)
                        );

                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ success: true }));
                    } catch (e) {
                        res.statusCode = 500;
                        res.end(`Sync Failed: ${e.message}`);
                    }
                });
            } else {
                next();
            }
        });
    },
});

export default defineConfig(async ({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const isDev = mode === 'development';
    
    return {
        base: './',
        server: {
            port: 3000,
            host: '0.0.0.0',
            watch: {
                ignored: [
                    '**/.grabbed_element',
                    '**/grabbed_element',
                    '.grabbed_element',
                    '**/.workflow_output/**',
                    '**/.grabby-watcher.pid'
                ]
            }
        },
        plugins: [
            react(),
            isDev && grabbySyncPlugin() // Load directly if dev
        ].filter(Boolean),
        define: {
            'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
            'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, '.'),
            }
        }
    };
});
