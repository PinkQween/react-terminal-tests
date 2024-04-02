import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import babel from 'vite-plugin-babel';
import envCompatible from 'vite-plugin-env-compatible';
// import md from 'vite-plugin-md'; // Import the plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), babel(), envCompatible()],
  optimizeDeps: {
    exclude: ['@babel/preset-react']
  },
  assetsInclude: ['**/*.md'],
})
