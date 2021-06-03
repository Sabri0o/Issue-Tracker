//adding a configuration file called config.js to the “server” folder in order to specify a different database URI for testing purposes:
require("dotenv").config();

var config = {};

config.mongoURI = {
  development: process.env.MONGO_URI_DEV,
  test: process.env.MONGO_URI_TEST,
};

module.exports = config;
