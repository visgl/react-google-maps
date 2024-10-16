import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({}) => {
  const {GOOGLE_MAPS_API_URL = ''} = loadEnv(mode, process.cwd(), '');

  return {
    define: {
      'process.env.GOOGLE_MAPS_API_URL': JSON.stringify(GOOGLE_MAPS_API_URL)
    },
    resolve: {
      alias: {
        '@vis.gl/react-google-maps/examples.js':
          'https://visgl.github.io/react-google-maps/scripts/examples.js'
      }
    }
  };
});
