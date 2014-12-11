/*
* Copyright (c) 2014-2015 SiSFev <https://github.com/novasdream/SiSFev>
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*/


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

