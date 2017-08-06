module.exports = (app, db) => {
  require('./news_routes')(app, db);
};
