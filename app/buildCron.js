const esbuild = require('esbuild');
require('dotenv').config();

let env = { 'process.env.NODE_ENV': `'production'` };
env[`process.env.SEND_NOTIFICATION_TOKEN`] = `'${process.env.SEND_NOTIFICATION_TOKEN}'`;

esbuild
  .build({
    entryPoints: ['./cron/send-notifications.ts'],
    outdir: '.netlify/functions-internal',
    minify: true,
    treeShaking: true,
    sourcemap: true,
    platform: 'node',
    format: 'cjs',
    define: env,
    target: 'node14',
  })
  .catch(() => process.exit(1));
