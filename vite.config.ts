import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { grabbySyncPlugin } from './api/grabby-plugin';

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
