const chalk = require('chalk');
const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackHotMiddleware = require('webpack-hot-middleware');
const opn = require('opn');
const { fork } = require('child_process');
const mainConfig = require('./webpack.main.config');
const webConfig = require('./webpack.web.config');

let hotMiddleware;

function logStats(proc, data) {
  let log = '';

  log += chalk.yellow.bold(`┏ ${proc} Process ${new Array((19 - proc.length) + 1).join('-')}`);
  log += '\n\n';

  if (typeof data === 'object') {
    data.toString({
      colors: true,
      chunks: false,
    }).split(/\r?\n/).forEach((line) => {
      log += `  ${line}\n`;
    });
  } else {
    log += `  ${data}\n`;
  }

  log += `\n${chalk.yellow.bold(`┗ ${new Array(28 + 1).join('-')}`)}\n`;

  console.log(log);
}

function startRenderer() {
  // eslint-disable-next-line promise/avoid-new
  return new Promise((resolve) => {
    // Add dev-client to all rendered pages
    const bundle = Object.keys(webConfig.entry)[0];
    webConfig.entry[bundle] = [path.join(__dirname, 'dev-client')].concat(webConfig.entry[bundle]);

    const compiler = webpack(webConfig);
    hotMiddleware = webpackHotMiddleware(compiler, {
      log: false,
      heartbeat: 2500,
    });

    compiler.plugin('compilation', (compilation) => {
      compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
        hotMiddleware.publish({ action: 'reload' });
        cb();
      });
    });

    compiler.plugin('done', (stats) => {
      logStats('Renderer', stats);
    });

    const server = new WebpackDevServer(compiler, {
      contentBase: path.join(__dirname, '../'),
      quiet: true,
      setup(app, ctx) {
        app.use(hotMiddleware);
        ctx.middleware.waitUntilValid(() => {
          resolve();
        });
      },
    });

    server.listen(8080);
  });
}

function startBrowser() {
  opn('http://localhost:8080/');
}

function startMain() {
  if (process.env.IS_WEB) return Promise.resolve();
  // eslint-disable-next-line promise/avoid-new
  return new Promise((resolve) => {
    let serverProcess;
    const compiler = webpack(mainConfig);

    compiler.plugin('watch-run', (compilation, done) => {
      logStats('Main', chalk.white.bold('compiling...'));
      hotMiddleware.publish({ action: 'compiling' });
      done();
    });

    compiler.watch({}, (err, stats) => {
      if (err) {
        console.log(err);
        return;
      }

      logStats('Main', stats);

      // Reload?
      if (serverProcess) serverProcess.kill();
      serverProcess = fork('./dist/main/main.js', {
        stdio: [0, 1, 2, 'ipc'],
      });

      resolve();
    });
  });
}

(async () => {
  try {
    await Promise.all([startRenderer(), startMain()]);
    startBrowser();
  } catch (err) {
    console.error(err);
  }
})();
