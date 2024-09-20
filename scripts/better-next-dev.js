'use strict';

// Modified from next-remote-watch
// https://github.com/hashicorp/next-remote-watch/blob/6a56b7fc42d4f354ed6da61626074ac51d1c2783/bin/next-remote-watch#L1
const picocolors = require('next/dist/lib/picocolors');
const watcher = require('@parcel/watcher');
const express = require('express');
const next = require('next');
const { parse } = require('node:url');
const Log = require('next/dist/build/output/log');
const path = require('node:path');

const port = Number.parseInt(process.env.PORT, 10) || 3000;
const hostname = process.env.HOSTNAME || 'localhost';
const app = next({
  dev: true,
  dir: process.cwd(),
  // When using middlewares in Next.js 12, `hostname` and `port` must be provided
  // (https://nextjs.org/docs/advanced-features/custom-server)
  port,
  hostname
});
const handle = app.getRequestHandler();

(async () => {
  await app.prepare();

  await watcher.subscribe(path.join(__dirname, '../contents'), () => {
    // Instead of reloading page, we patch this to only HMR the content pages
    app.server.hotReloader.send('building');
    app.server.hotReloader.send({
      event: 'serverOnlyChanges',
      pages: ['/[...content]']
    });
  });

  // create an express server
  const server = express();

  // special handling for mdx reload route
  const reloadRoute = express.Router();
  reloadRoute.use(express.json());
  reloadRoute.all('/', (req, res) => {
    // log message if present
    const msg = req.body.message;
    if (msg) {
      const color = req.body.color;
      Log.log(color ? picocolors[color](msg) : msg);
    }

    // reload the nextjs app
    app.server.hotReloader.send('building');
    app.server.hotReloader.send('reloadPage');
    res.end('Reload initiated');
  });

  server.use('/__next_reload', reloadRoute);

  // handle all other routes with next.js
  server.all('*', (req, res) => handle(req, res, parse(req.url, true)));

  // fire it up
  server.listen(port, (err) => {
    if (err) throw err;
    Log.ready(`started server http://${hostname}:${port}`);
  });

  process.on('beforeExit', () => {
    watcher.unsubscribe();
  });
})();
