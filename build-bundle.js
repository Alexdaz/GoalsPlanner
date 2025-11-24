const esbuild = require('esbuild');
const path = require('path');

esbuild.build({
  entryPoints: ['js/gp-root.js'],
  bundle: true,
  outfile: 'js/gp-root.bundle.js',
  format: 'esm',
  platform: 'browser',
  target: 'es2020',
  resolveExtensions: ['.js', '.mjs', '.ts'],
  alias: {
    'lit': path.resolve(__dirname, 'node_modules/lit/index.js'),
    'canvas-confetti': path.resolve(__dirname, 'node_modules/canvas-confetti/dist/confetti.module.mjs')
  }
}).catch(() => process.exit(1));

