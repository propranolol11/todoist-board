import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import { watch } from 'fs';


function onwarn(warning, warn) {
  if (warning.code === 'CIRCULAR_DEPENDENCY' && /luxon/.test(warning.importer)) return;
  warn(warning);
}

export default {
  input: 'main.ts',
  output: {
    file: 'main.js',
    format: 'cjs',
    sourcemap: true,
    exports: 'named'
  },
  plugins: [
    resolve({ browser: true, preferBuiltins: false }),
    commonjs(),
    typescript()
  ],
  watch: {
    include: ['main.ts', 'styles.css'],
    clearScreen: false
  },
  external: id => id === 'obsidian' || id.startsWith('obsidian/'),
  onwarn
};