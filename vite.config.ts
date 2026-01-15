import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
// import { grabbySyncPlugin } from './api/grabby-plugin';

export default defineConfig(async ({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const isDev = mode === 'development';
    
    // Conditional plugin array with React as base
    const plugins = [react()];

    // Dynamically import Grabby only in development
    if (isDev) {
        try {
           // We use a relative path import. Note: in ESM we need the extension if strictly configured, 
           // but Vite's bundler usually handles resolution. Safe to try both or rely on Vite.
           // @ts-ignore - The file might not exist in production build context
           const module = await import('./api/grabby-plugin');
           if (module && module.grabbySyncPlugin) {
               plugins.push(module.grabbySyncPlugin());
           }
        } catch (e) {
           console.warn("Grabby plugin could not be loaded (skipping for dev/build):", e);
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
        plugins,
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
