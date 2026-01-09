
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  return {
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:5000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
    }
  };
});
