var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

var logger = require('morgan');
var cors = require('cors');

// get env variables 
require('dotenv').config();

// create a passport instance
let passport = require('passport');
let session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var publicRouter = require('./routes/public');
var portalRouter = require('./routes/portal');

require('./passport_setup')(passport);

var app = express();

// don't need these if 
// we want to return differnt status
// codes other than 200 
// "preflightContinue": true,
// "optionsSuccessStatus": 204,
// "origin": "http://localhost:3000",

const corsOptions = {
    "origin": process.env.HTTP_TYPE + "://" + process.env.DOMAIN_NAME + ":" + process.env.REACT_APP_PORT,
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    
    "credentials": true
}

app.use(cors(corsOptions));

const BUILD_PATH = path.join(__dirname, '../..', 'build')
app.use(express.static(BUILD_PATH, {index: false}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.NODE_COOKIE_SECRET));

// for session
app.use(session({
    secret: process.env.NODE_SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Put true if https
}))

app.use(passport.initialize());
app.use(passport.session());

// authenticate user before continuing
const authCheck = (req, res, next) => {
    if (req.user !== undefined) {
        // if logged in
        next();
    } else {
        // if not logged in
        res.status(401).send({
            message: 'Unauthorized'
        });
    }
}

app.use('/', indexRouter);
app.use('/portal', authCheck, portalRouter);
app.use('/teacher', publicRouter);
app.use('/user', authCheck, usersRouter);

module.exports = app;