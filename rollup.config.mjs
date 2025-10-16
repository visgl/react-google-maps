import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import dts from 'rollup-plugin-dts';

const external = ['react', 'react-dom', 'react/jsx-runtime', 'fast-deep-equal'];

const plugins = [
  resolve(),
  commonjs(),
  typescript({
    tsconfig: './tsconfig.build.json',
    declaration: false,
    declarationDir: undefined
  })
];

const createConfig = (input, outputBase) => [
  // ESM and UMD builds
  {
    input,
    output: [
      {
        file: `${outputBase}.modern.mjs`,
        format: 'es',
        sourcemap: true
      },
      {
        file: `${outputBase}.umd.js`,
        format: 'umd',
        name: 'ReactGoogleMaps',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'React',
          'fast-deep-equal': 'fastDeepEqual'
        },
        sourcemap: true
      }
    ],
    external,
    plugins
  },
  // TypeScript declarations
  {
    input,
    output: {
      file: `${outputBase}.d.ts`,
      format: 'es'
    },
    external,
    plugins: [dts()]
  }
];

export default [
  ...createConfig('./src/index.ts', './dist/index'),
  ...createConfig('./src/server/index.ts', './dist/server/index')
];
