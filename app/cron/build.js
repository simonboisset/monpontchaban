const esbuild = require('esbuild');
esbuild
  .build({
    entryPoints: ['./cron/send-notifications.ts', './cron/update-cache.ts'],
    outdir: './.netlify/functions-internal/',
    minify: true,
    treeShaking: true,
    platform: 'node',
    format: 'cjs',
  })
  .catch(() => process.exit(1));
