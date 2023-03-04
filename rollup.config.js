import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import pkg from './package.json' assert { type: 'json' };

export default [
  // CommonJS (for Node) and ES module (for bundlers) build.
  {
    input: 'lib/index.js',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
        plugins: [terser()]
      },
      {
        file: pkg.module,
        format: 'es',
        sourcemap: true,
        exports: 'named',
        plugins: [terser()]
      }
    ],
    external: [
      "@abw/badger",
      "@abw/badger-utils",
      "@fortawesome/free-solid-svg-icons",
      "@fortawesome/free-regular-svg-icons",
      "@fortawesome/free-brands-svg-icons",
      "commander",
      "prompts",
      "js-yaml"
    ],
    plugins: [
      nodeResolve(),
      copy({
        targets: [
          {
            src: 'styles/*.css',
            dest: 'dist/styles',
          },
          {
            src: 'bin/*',
            dest: 'dist/bin',
            transform: (contents, filename) =>
              contents.toString().replace('../lib/index.js', '@abw/svg-icon-librarian')
          },
        ],
      }),
    ],
  }
];
