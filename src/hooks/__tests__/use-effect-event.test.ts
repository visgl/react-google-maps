import {mkdtempSync, rmSync, writeFileSync} from 'fs';
import {tmpdir} from 'os';
import path from 'path';
import {rollup} from 'rollup';
import typescript from '@rollup/plugin-typescript';

describe('useEffectEvent', () => {
  test('bundles when React does not export useInsertionEffect', async () => {
    const tempDir = mkdtempSync(path.join(tmpdir(), 'react-google-maps-react-shim-'));
    const reactShim = path.join(tempDir, 'react.js');
    const warnings: string[] = [];

    writeFileSync(
      reactShim,
      [
        'export const useLayoutEffect = () => {};',
        'export const useRef = value => ({current: value});'
      ].join('\n')
    );

    try {
      const bundle = await rollup({
        input: path.resolve(process.cwd(), 'src/hooks/use-effect-event.ts'),
        onwarn(warning) {
          warnings.push(String(warning.message ?? warning));
        },
        plugins: [
          {
            name: 'react-shim',
            resolveId(source) {
              if (source === 'react') {
                return reactShim;
              }

              return null;
            }
          },
          typescript({
            tsconfig: path.resolve(process.cwd(), 'tsconfig.test.json'),
            sourceMap: false,
            declaration: false,
            declarationMap: false,
            tslib: path.resolve(process.cwd(), 'node_modules/tslib/tslib.es6.js')
          })
        ]
      });

      await expect(bundle.generate({format: 'esm'})).resolves.toBeDefined();
      expect(warnings).toEqual([]);
      await bundle.close();
    } finally {
      rmSync(tempDir, {recursive: true, force: true});
    }
  });
});
