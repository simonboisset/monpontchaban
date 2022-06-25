const esbuild = require('esbuild');
esbuild
  .build({
    entryPoints: ['./cron/index.ts'],
    outdir: '.netlify/functions',
    bundle: true,
    minify: true,
    treeShaking: true,
    platform: 'node',
    format: 'cjs',
    target: 'node14',
  })
  .catch(() => process.exit(1));
