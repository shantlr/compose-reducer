import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';

export default [
  {
    input: 'src/index.js',
    output: { file: 'lib/index.js', format: 'cjs', indent: false },
    plugins: [
      resolve(),
      babel({
        exclude: 'node_modules/**',
        comments: false
      })
    ]
  },
  {
    input: 'src/index.js',
    output: { file: 'es/index.js', format: 'es', indent: false },
    plugins: [
      resolve(),
      babel({
        exclude: 'node_modules/**',
        comments: false
      })
    ]
  }
];
