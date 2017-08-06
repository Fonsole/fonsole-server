/* eslint-disable unicorn/no-process-exit */
process.env.NODE_ENV = 'production';

const chalk = require('chalk');
const del = require('del');
const webpack = require('webpack');
const Multispinner = require('multispinner');

const mainConfig = require('./webpack.main.config');
const webConfig = require('./webpack.web.config');

const doneLog = `${chalk.bgGreen.white(' DONE ')} `;
const errorLog = `${chalk.bgRed.white(' ERROR ')} `;
// const isCI = process.env.CI || false;

function pack(config) {
  // eslint-disable-next-line promise/avoid-new
  return new Promise((resolve, reject) => {
    webpack(config, (compilerErr, stats) => {
      if (compilerErr) {
        reject(compilerErr.stack || compilerErr);
      } else if (stats.hasErrors()) {
        const webpackErr = stats.toString({
          chunks: false,
          colors: true,
        }).split(/\r?\n/).reduce((line, error) => {
          error += `    ${line}\n`;
          return error;
        }, '');

        reject(webpackErr);
      } else {
        resolve(stats.toString({
          chunks: false,
          colors: true,
        }));
      }
    });
  });
}

(async () => {
  del.sync(['dist/*', '!.gitkeep']);

  const tasks = ['main', 'web'];
  const m = new Multispinner(tasks, {
    preText: 'building',
    postText: 'process',
  });

  let results = '';

  m.on('success', () => {
    process.stdout.write('\x1B[2J\x1B[0f');
    console.log(`\n\n${results}`);
    console.log(`\n${doneLog}\n`);
  });
  await Promise.all([
    /* eslint-disable promise/always-return */
    pack(mainConfig).then((result) => {
      results += `${result}\n\n`;
      m.success('main');
    }).catch((err) => {
      m.error('main');
      console.log(`\n  ${errorLog}failed to build main process`);
      console.error(`\n${err}\n`);
      process.exit(1);
    }),

    pack(webConfig).then((result) => {
      results += `${result}\n\n`;
      m.success('web');
    }).catch((err) => {
      m.error('web');
      console.log(`\n  ${errorLog}failed to build web process`);
      console.error(`\n${err}\n`);
      process.exit(1);
    }),
    /* eslint-enable promise/always-return */
  ]);
})();
