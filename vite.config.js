import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
    resolve: {
        alias: {
            '@catalog': fileURLToPath(new URL('./resources/application/catalog', import.meta.url)),
        },
    },
    plugins: [
        react(),
        laravel({
            input: [
                'resources/application/dashboard/app.jsx',
                'resources/application/catalog/main.tsx',
            ],
            refresh: true,
        }),
        tailwindcss(),
    ],
    server: {
        host: '0.0.0.0',
        port: Number(process.env.VITE_PORT || 5173),
        strictPort: true,
        hmr: {
            host: process.env.VITE_HMR_HOST || 'localhost',
        },
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});

