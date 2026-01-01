import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        open: true,
        hmr: {
            overlay: false
        },
        watch: {
            // Don't watch data files to prevent reloads during manual edits
            ignored: ['**/src/data/**']
        }
    }
})
