var express = require('express');
var router = express.Router();
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var cbase = require('couchbase');
var cluster = new cbase.Cluster('couchbase://127.0.0.1');
// todo - config setting update here.
var couchbaseBucketName = 'default'; // reset to the databucket you'd like to use
var bucket = cluster.openBucket(couchbaseBucketName);
var db = require('../db');

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.

passport.use(new Strategy(
    function(username, password, cb) {
        db.users.findByUsername(username, function(err, user) {
            if (err) { return cb(err); }
            if (!user) { return cb(null, false); }
            if (user.password != password) { return cb(null, false); }
            return cb(null, user);
        });
    }));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.

passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
    db.users.findById(id, function (err, user) {
        if (err) { return cb(err); }
        cb(null, user);
    });
});

/* GET home page. */
router.get('/', function(req, res, next) {
        res.render('index', { title: 'Passport - Express - Couchbase - User login template', user: req.user });
    });

router.get('/login', function(req, res){
        //res.render('login');
        res.render('index', { title: 'Passport - Express - Couchbase - User login template', user: req.user });
    });

router.post('/login',
    passport.authenticate('local', { failureRedirect: '/' }),
    function(req, res) {
        res.redirect('/');
    });

router.get('/logout',
    function(req, res){
        req.logout();
        res.redirect('/');
    });

router.post('/register',
    function(req, res){
        var register = require('../db/cb_register');
        var user = {
            'username': req.query.username,
            'email': req.query.email,
            'password': req.query.password
        };

        register.newUser(user);
        //res.render('index', { title: 'Passport - Express - Couchbase - User login template', user: req.user });
        res.redirect('/');
    });

router.get('/profile',
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res){
        res.render('profile', { user: req.user });
    });

module.exports = router;
