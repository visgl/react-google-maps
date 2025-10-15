import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const {GOOGLE_MAPS_API_KEY = ''} = loadEnv(mode, process.cwd(), '');

  return {
    define: {
      'process.env.GOOGLE_MAPS_API_KEY': JSON.stringify(GOOGLE_MAPS_API_KEY)
    },
    resolve: {
      alias: {
        '@vis.gl/react-google-maps/examples.js':
          'https://visgl.github.io/react-google-maps/scripts/examples.js'
      }
    }
  };
});
