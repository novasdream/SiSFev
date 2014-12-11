/*
 * custom-levels.js: Custom logger and color levels in winston
 *
 * (C) 2012, Nodejitsu Inc.
 *
 */

var winston = require('winston');

//
// Logging levels
//
var config = {
  levels: {
    silly: 0,
    verbose: 1,
    info: 2,
    data: 3,
    warn: 4,
    debug: 5,
    error: 6
  },
  colors: {
    silly: 'magenta',
    verbose: 'cyan',
    info: 'green',
    data: 'grey',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
  }
};

var logger = module.exports = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
    level: 'silly',
    prettyPrint: true,
    colorize: true,
    silent: false,
    timestamp: false
    }),
    new (winston.transports.File)({ filename: 'sisfev.log',  json: true})

  ],
  levels: config.levels,
  colors: config.colors
});
