const esbuild = require('esbuild');
require('dotenv').config();

const env = { 'process.env.NODE_ENV': `'production'` };
for (const key in process.env) {
  env[`process.env.${key}`] = `'${process.env[key]}'`;
}

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
