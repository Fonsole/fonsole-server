const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

const url = 'mongodb://tides-dev:sos@ds135049.mlab.com:35049/fonsole-dev';

exports.init = (app) => {
  app.use(bodyParser.urlencoded({ extended: true }));

  MongoClient.connect(url, (err, database) => {
    if (err) throw err;
    require('./app/routes')(app, database);
  });
};
