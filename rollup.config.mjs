import {readFileSync} from 'node:fs';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import dts from 'rollup-plugin-dts';

const {version: VERSION} = JSON.parse(readFileSync('./package.json', 'utf-8'));

const external = ['react', 'react-dom', 'react/jsx-runtime', 'fast-deep-equal'];

const plugins = [
  resolve(),
  commonjs(),
  typescript({
    tsconfig: './tsconfig.build.json',
    declaration: false,
    declarationDir: undefined
  }),
  replace({
    preventAssignment: true,
    include: ['src/version.ts'],
    values: {
      __PACKAGE_VERSION__: VERSION
    }
  })
];

const entries = {
  index: './src/index.ts',
  'server/index': './src/server/index.ts',
  '3d/index': './src/3d/index.ts'
};

// One ESM build for every entry, so the modules they share (the APIProvider
// and map contexts above all) are emitted once as chunks and each entry
// imports the same instance. Built one entry at a time, `/3d` and the root
// each carried their own `APIProviderContext`, and a `Map3D` imported from
// `/3d` could not see the `APIProvider` imported from the root.
const esmConfig = {
  input: entries,
  output: {
    dir: 'dist',
    format: 'es',
    entryFileNames: '[name].modern.mjs',
    chunkFileNames: 'chunks/[name]-[hash].mjs',
    sourcemap: true
  },
  external,
  plugins
};

// UMD cannot code-split; each entry stays self-contained.
const umdConfig = (input, outputBase) => ({
  input,
  output: {
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
  },
  external,
  plugins
});

const dtsConfig = (input, outputBase) => ({
  input,
  output: {
    file: `${outputBase}.d.ts`,
    format: 'es'
  },
  external,
  plugins: [dts()]
});

export default [
  esmConfig,
  ...Object.entries(entries).flatMap(([name, input]) => [
    umdConfig(input, `./dist/${name}`),
    dtsConfig(input, `./dist/${name}`)
  ])
];
