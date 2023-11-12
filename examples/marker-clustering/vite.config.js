import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const {GOOGLE_MAPS_API_KEY = ''} = loadEnv(mode, process.cwd(), '');
  const {GOOGLE_MAPS_MAP_ID = ''} = loadEnv(mode, process.cwd(), '');

  return {
    define: {
      'process.env.GOOGLE_MAPS_API_KEY': JSON.stringify(GOOGLE_MAPS_API_KEY),
      'process.env.GOOGLE_MAPS_MAP_ID': JSON.stringify(GOOGLE_MAPS_MAP_ID)
    }
  };
});
