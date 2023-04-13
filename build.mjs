import * as esbuild from 'esbuild';

let ctx = await esbuild.build({
  entryPoints: ['./src/server.js'],
  bundle: true,
  minify: false,
  treeShaking: true,
  platform: 'node',
  target: ['node10.4'],
  outfile: 'built/backend.js',
  allowOverwrite: true,
})
