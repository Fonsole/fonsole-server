import express from 'express';
import Networking from 'fonsole-networking';
import database from './database';

require('source-map-support').install();

const app = express();

database.init(app);

const networking = new Networking({
  port: 3001,
  isLocal: false,
});
networking.listen();


// process.env.PORT will be replaced with a pipe by azure if not hosted there the given port is used
const port = process.env.PORT || 81;

// open the port for clients to connect
app.listen(port, () => {
  console.log(`listening on *:${port}`);
  console.log('PPlatform V1.1 started.');
});
