#!/usr/bin/env node

const esbuild = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');
const { config } = require('dotenv');
const modes = process.argv.slice(2);

const variables = [
  'DATABASE_URL',
  'SESSION_SECRET',
  'JWT_SECRET',
  'RESEND_SECRET',
  'CRON_SECRET',
  'EXPO_ACCESS_TOKEN',
  'CHABAN_CHANNEL_ID',
];

const isDev = modes.includes('--dev');
const isWatch = modes.includes('-w');
const isReact = modes.includes('--react');
const withEnv = modes.includes('--env');
const build = async () => {
  const serverEnv = { 'process.env.NODE_ENV': isDev || isWatch ? `'development'` : `'production'` };

  if (withEnv) {
    config();

    for (const variable of variables) {
      if (process.env[variable]) {
        serverEnv[`process.env.${variable}`] = `'${process.env[variable]}'`;
      }
    }
  }

  if (isWatch) {
    const ctx = await esbuild
      .context({
        entryPoints: ['src/index.ts'],
        bundle: true,
        outfile: 'dist/index.js',
        jsx: 'automatic',
        platform: 'node',
        plugins: [nodeExternalsPlugin()],
        define: serverEnv,
      })
      .catch(() => process.exit(1));
    ctx.watch();
  } else {
    esbuild
      .build({
        entryPoints: ['src/index.ts'],
        bundle: true,
        outfile: 'dist/index.js',
        jsx: 'automatic',
        platform: 'node',
        plugins: [nodeExternalsPlugin()],
        define: serverEnv,
      })
      .catch(() => process.exit(1));
  }
};

build();
