const esbuild = require('esbuild');
require('dotenv').config();

const env = { 'process.env.NODE_ENV': `'production'` };
for (const key in process.env) {
  env[`process.env.${key}`] = `'${process.env[key]}'`;
}

esbuild
  .build({
    entryPoints: ['./cron'],
    outdir: '.netlify/functions',
    minify: true,
    treeShaking: true,
    platform: 'node',
    format: 'cjs',
    define: env,
    target: 'node14',
  })
  .catch(() => process.exit(1));
