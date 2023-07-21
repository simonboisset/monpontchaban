#!/usr/bin/env node

const esbuild = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');
const { config } = require('dotenv');
const modes = process.argv.slice(2);

const isDev = modes.includes('--dev');
const isWatch = modes.includes('-w');
const isReact = modes.includes('--react');
const withEnv = modes.includes('--env');
const build = async () => {
  const serverEnv = { 'process.env.NODE_ENV': isDev || isWatch ? `'development'` : `'production'` };

  if (isWatch) {
    const ctx = await esbuild
      .context({
        entryPoints: ['src/index.ts'],
        bundle: true,
        outfile: 'dist/index.js',
        jsx: 'automatic',
        platform: 'node',
        plugins: [nodeExternalsPlugin()],
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
      })
      .catch(() => process.exit(1));
  }
};

build();
