import {defineConfig, loadEnv} from 'vite';
import {resolve} from 'node:path';

export default defineConfig(({mode}) => {
  const {GOOGLE_MAPS_API_KEY = ''} = loadEnv(mode, process.cwd(), '');

  return {
    define: {
      'process.env.GOOGLE_MAPS_API_KEY': JSON.stringify(GOOGLE_MAPS_API_KEY)
    },
    resolve: {
      alias: {
        '@vis.gl/react-google-maps/examples.js': resolve(
          '../../website/static/scripts/examples.js'
        ),
        '@vis.gl/react-google-maps/examples.css': resolve(
          '../../examples/examples.css'
        ),
        '@vis.gl/react-google-maps': resolve('../../src/index.ts')
      }
    }
  };
});
