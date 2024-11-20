import {vitePlugin as remix} from '@remix-run/dev';
import {defineConfig, loadEnv} from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import {resolve} from 'node:path';

declare module '@remix-run/node' {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig(({mode}) => {
  const {GOOGLE_MAPS_API_KEY = ''} = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      remix({
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true,
          v3_singleFetch: true,
          v3_lazyRouteDiscovery: true
        }
      }),
      tsconfigPaths()
    ],
    define: {
      'process.env.GOOGLE_MAPS_API_KEY': JSON.stringify(GOOGLE_MAPS_API_KEY)
    },
    resolve: {
      alias: {
        '@vis.gl/react-google-maps': resolve('../../src/index.ts')
      }
    }
  };
});
