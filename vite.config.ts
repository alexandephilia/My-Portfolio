import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
// import { grabbySyncPlugin } from './api/grabby-plugin';

export default defineConfig(async ({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const isDev = mode === 'development';
    
    // Dynamic Plugin Loader (The "Grabby" Protocol)
    let grabbyPlugin = null;
    if (isDev) {
        try {
             // @ts-ignore: Optional dev-dependency
            const { grabbySyncPlugin } = await import('./api/grabby-plugin');
            grabbyPlugin = grabbySyncPlugin();
        } catch (e) { 
            /* Silent fail: Plugin likely missing, who cares */ 
        }
    }

    return {
        base: './',
        server: {
            port: 3000,
            host: '0.0.0.0',
            watch: {
                ignored: ['**/.grabbed_element']
            }
        },
        plugins: [
            react(),
            grabbyPlugin // Will be filtered if null? No, Vite plugins array handles falsy? No, it doesn't.
        ].filter(Boolean),
        define: {
            // RETARD ALERT: You should be using import.meta.env
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
