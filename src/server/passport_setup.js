let LocalStradegy = require('passport-local').Strategy;

// password encryption 
let bycrypt = require('bcrypt');

let mongodb = require('./db/mongodb');

const validPassword = function(user, password) {
    // converts password to a hash and compares against database
    return bycrypt.compareSync(password, user.password);
}

// passport is passed from app.js
module.exports = function(passports) {

    // saves a handle to the user object
    // can be user id
    // saves to a session variable
    // deserialize user retrives database object
    // for user
    // user object is attached to the resquest as 
    // req.user
    passports.serializeUser(function(user, done) {
        done(null, user._id);
    });

    // query database 
    passports.deserializeUser(function(_id, done) {
        mongodb.findTeacherById(_id).then(user => {
            if (user == null) {
                // console.log("Wrong user id");
                // done(new Error('Wrong user id'));
                done(null, user);
            } else {
                done(null, user);
            }
        });
    });

    // tells local stradegy what fields to use 
    // when authenticating user post request
    passports.use(new LocalStradegy( {
        usernameField: 'username', // req.body.email
        passwordField: 'password', // req.body.password
        passReqToCallback: true
    },
    function(req, username, password, done) {

        // first check if the input username is valid 

        mongodb.findTeacherByUsername(username).then(user => {

            if (user == null) {

                let info = {
                    formData: {
                        username: username,
                        password: password,
                    },
                    errors: {
                        message: "Incorrect username or password"
                    }
                }

                return done(null, false, info);

            } else if (user.password == null || user.password == undefined) {

                let info = {
                    formData: {
                        username: username,
                        password: password,
                    },
                    errors: {
                        message: "Incorrect username or password"
                    }
                }

                return done(null, false, info);

            } else if (!validPassword(user, password)) {
                
                let info = {
                    formData: {
                        username: username,
                        password: password,
                    },
                    errors: {
                        message: "Incorrect username or password"
                    }
                }

                return done(null, false, info);

            } else {
                return done(null, user);
            }

        }).catch(err => {
            done(err, false);
        });
    }));
}