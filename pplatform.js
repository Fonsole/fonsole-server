
/*
 * Copyright (C) 2015 Christoph Kutza
 *
 */

const express = require('express');
const path = require('path');

const app = express();
const webpack = require('webpack');

// module netgroup. allows us to start the socket.io server
const Netgroup = require('./netgroup');

const database = require('./database');

database.init(app);

// setup the netgroup server
const netgroup = new Netgroup();
netgroup.listen(3001);


// process.env.PORT will be replaced with a pipe by azure if not hosted there the given port is used
const port = process.env.PORT || 80;

const webpackConfig = require('./webpack.config');

const compiler = webpack(webpackConfig);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath,
}));

app.use(require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000,
}));

app.use('/dist/', express.static('./dist'));
app.use('/static/', express.static('./static'));
app.use('/dist/', express.static('../api/dist'));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
// open the port for clients to connect
app.listen(port, () => {
  console.log(`listening on *:${port}`);
  console.log('PPlatform V1.1 started.');
});