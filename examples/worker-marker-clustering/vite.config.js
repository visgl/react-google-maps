import {defineConfig} from 'vite';

export default defineConfig({
  define: {
    'process.env.GOOGLE_MAPS_API_KEY': JSON.stringify(
      process.env.GOOGLE_MAPS_API_KEY
    )
  },
  worker: {
    format: 'es'
  }
});
