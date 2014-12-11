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

var express      = require('express');
var app             = express();
var bodyParser  = require('body-parser');
var mongoose   = require('mongoose');
var db = mongoose.connection;
var bears           =require('./routes/bears/');
var routerMensagem           =require('./routes/mensagem/');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var flash    = require('connect-flash');
var expressValidator = require('express-validator');

var logger = require('./libs/sisfev/logger')

var Mensagem = require('./models/mensagem');
var Anexo        = require('./models/anexo')
var session = require('express-session')

var cookieParser = require('cookie-parser')

var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

//Scraper
var sisfev = require('./libs/sisfev/http');
sisfev.test();
//Models
var User = require('./models/user')

var options = {
  db: { native_parser: true },
  server: { poolSize: 5,  auto_reconnect:true },
  replset: { socketOptions: {keepAlive: 1}},
  user: 'test',

}

var PORT          = process.env.PORT|| 8080;
// Routes acontecem por aqui
var router         = express.Router();


//mongoose.connect(dbURI,options); // connect to our database
mongoose.connect('mongodb://localhost/myDB');
mongoose.connection.on("connected", function(ref) {
    logger.log('info','Connected to %s !',localhost);
});
mongoose.connection.on('error', function(error) {
    logger.log('error','Error in MongoDb connection: %s. ', error);
    mongoose.disconnect();
});
db.on('disconnected', function() {
    logger.warn('MongoDB disconnected!');
    mongoose.connect('mongodb://localhost/myDB');
});
db.on('reconnected', function () {
    logger.info('MongoDB reconnected!');
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(cookieParser());
app.use(session(
{
    secret: '8qoQPNKUgaGFG82WR1AHnYfSaCc0RtRLSdAUOUbrdJTPe7rKJ5u7cotnkMzjojOB',
    saveUninitialized: true,
    resave: true
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // use connect-flash for flash messages stored in session


    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'RA',
        passwordField : 'token',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, RA, password, done) { // callback with email and password from our form
            var user = new User();
            if(RA !=88753)
                 return done(null, false, { message: 'Incorrect RA.' });
            user.RA = RA;
            user.password = password;
            user.authenticated = true;
            // all is well, return successful user
            return done(null, user.RA);
    }));




// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {

    done(null,obj)
    //User.findById(id, function (err, user) {
    //  done(err, user);
    //});

});
var requiresAdmin = function() {
  return [
    ensureLoggedIn('/login'),
    function(req, res, next) {
      //if (req.user && req.user.isAdmin === true)
      if (req.user){
        next();
      }else
        res.status(401).send({err:'Unauthorized'});
    }
  ]
};
app.all('/api/mensagem/*',requiresAdmin());

app.post('/login', passport.authenticate('local-login'), function (req, res) {
     req.assert('RA', 'RA não é valido!').notEmpty();
     req.assert('token', 'Password não é valido!').notEmpty();
     var err = req.validationErrors();
      if (err) {
        console.log(err);
        return res.redirect(err);
      }

      res.send({logged:true,RA:req.user.RA});


});

app.get('/login',
  function(req, res) {
    res.status(401).send({err: 'Login Requerido.'});
  });

router.use(function(req,res,next){
    res.removeHeader("X-Powered-By");
    logger.log('debug','[Router]-[Mongoose] %s.',mongoose.connection.readyState)
    logger.log('debug', '[Router]-[SiSFev] queue head.. size [%d] running [%d].',sisfev.queue_header.length(),sisfev.queue_header.running());
    logger.log('debug', '[Router]-[SiSFev] queue cont... size [%d] running [%d].',sisfev.queue_conteudo.length(),sisfev.queue_header.running());
    logger.verbose('[Router] Magica acontecendo.')
    next();
})


router.get('/',function(req,res) {
    res.json({message: 'funcionando'});
})

app.use('/api', router)
app.use('/api', bears)
app.use('/api', routerMensagem)

app.listen(PORT);
logger.log('info', 'Magia acontecendo na porta %d.', PORT);
