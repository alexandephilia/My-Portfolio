import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import fs from 'fs';

const grabbySyncPlugin = () => ({
    name: 'grabby-sync-plugin',
    configureServer(server) {
        server.middlewares.use((req, res, next) => {
            if (req.url === '/__grabby_sync' && req.method === 'POST') {
                let body = '';
                req.on('data', chunk => { body += chunk.toString(); });
                req.on('end', () => {
                    try {
                        const data = JSON.parse(body);
                        fs.writeFileSync(path.resolve(__dirname, '.grabbed_element'), JSON.stringify({
                            ...data,
                            timestamp: new Date().toISOString()
                        }, null, 2));
                        res.statusCode = 200;
                        res.end('Synced');
                    } catch (e) {
                        res.statusCode = 500;
                        res.end('Sync Failed');
                    }
                });
            } else {
                next();
            }
        });
    }
});

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
        base: './',
        server: {
            port: 3000,
            host: '0.0.0.0',
            watch: {
                ignored: ['**/.grabbed_element']
            }
        },
        plugins: [react(), grabbySyncPlugin()],
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
