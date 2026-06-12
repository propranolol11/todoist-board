import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';


function onwarn(warning, warn) {
  const warningText = [
    warning.importer,
    warning.message,
    ...(warning.ids || []),
    ...(warning.cycle || [])
  ].filter(Boolean).join(' ');
  if (warning.code === 'CIRCULAR_DEPENDENCY' && /luxon/.test(warningText)) return;
  warn(warning);
}

export default {
  input: 'main.ts',
  output: {
    file: 'main.js',
    format: 'cjs',
    sourcemap: false,
    exports: 'named'
  },
  plugins: [
    resolve({ browser: true, preferBuiltins: false }),
    commonjs(),
    typescript(),
    terser({ format: { comments: false } })
  ],
  watch: {
    include: ['main.ts', 'styles.css'],
    clearScreen: false
  },
  external: id => id === 'obsidian' || id.startsWith('obsidian/'),
  onwarn
};
