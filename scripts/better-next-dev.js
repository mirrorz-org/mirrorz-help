// Modified from next-remote-watch
// https://github.com/hashicorp/next-remote-watch/blob/6a56b7fc42d4f354ed6da61626074ac51d1c2783/bin/next-remote-watch#L1
const chalk = require('next/dist/compiled/chalk');
const chokidar = require('chokidar');
const express = require('express');
const next = require('next');
const { parse } = require('url');
const Log = require('next/dist/build/output/log');

const port = parseInt(process.env.PORT, 10) || 3000;
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

app.prepare().then(() => {
  chokidar.watch('./contents', { usePolling: false }).on(
    'change',
    () => {
      // Instead of reloading page, we patch this to only HMR the content pages
      app.server.hotReloader.send('building');
      app.server.hotReloader.send({
        event: 'serverOnlyChanges',
        pages: ['/[...content]']
      });
    }
  );

  // create an express server
  const server = express();

  // special handling for mdx reload route
  const reloadRoute = express.Router();
  reloadRoute.use(express.json());
  reloadRoute.all('/', (req, res) => {
    // log message if present
    const msg = req.body.message;
    const color = req.body.color;
    if (msg) {
      Log.log(color ? chalk[color](msg) : msg);
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
    Log.info(`> Ready on http://${hostname}:${port}`);
  });
});
