const fs = require('fs');
const { createRequestHandler } = require('@remix-run/express');
const { broadcastDevReady, installGlobals } = require('@remix-run/node');
const chokidar = require('chokidar');
const compression = require('compression');
const express = require('express');
const morgan = require('morgan');

installGlobals();

const BUILD_PATH = './build/index.js';

let build = require(BUILD_PATH);
const app = express();
app.use(compression());
app.disable('x-powered-by');
app.use('/build', express.static('public/build', { immutable: true, maxAge: '1y' }));
app.use(express.static('public', { maxAge: '1h' }));

app.use(morgan('tiny'));

app.all(
  '*',
  process.env.NODE_ENV === 'development'
    ? createDevRequestHandler()
    : createRequestHandler({
        build,
        mode: process.env.NODE_ENV,
      }),
);

const port = process.env.PORT || 3000;
app.listen(port, async () => {
  console.log(`Express server listening on port ${port}`);

  if (process.env.NODE_ENV === 'development') {
    broadcastDevReady(build);
  }
});

function createDevRequestHandler() {
  const watcher = chokidar.watch(BUILD_PATH, { ignoreInitial: true });

  watcher.on('all', async () => {
    const stat = fs.statSync(BUILD_PATH);
    build = import(BUILD_PATH + '?t=' + stat.mtimeMs);
    broadcastDevReady(await build);
  });

  return async (req, res, next) => {
    try {
      return createRequestHandler({
        build: await build,
        mode: 'development',
      })(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
