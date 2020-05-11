var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

let user = require('../controllers/user');

// import models to use mongoose models made 
var models = require('../models_setup');
models.importModels()

// to make query search import teacher shema
var teacherSchema = require('../db/models/teacher').schema;

router.get('/', function(req, res, next) {
  
  mongoose.model('teachers', teacherSchema).find(function (err, teachers) {

    var teachersInfo = [];

    // teachers is a javascript Object
    Object.entries(teachers).forEach(entry => {
      //let key = entry[0];
      let value = entry[1];
      //use key and value here
      //console.log("key: " + key);
      //console.log("value: " + value);

      //console.log("username: " + value.username);
      teacherInfo = {
        username: value.username,
        firstName: value.firstName,
        lastName: value.lastName
      };

      teachersInfo.push(teacherInfo);
    });

    teachersInfo = teachersInfo.sort( compare );

    // pass over teacher username and if the response has a logged in user, send it also 
    //res.render('index', {teachers: teachersInfo, user: req.user});
    res.status(200).send({
      teachers: teachersInfo
    })

  }).catch(function(error) {
    console.log("error: " + error);
    let message = "Internal server error"
    res.status(500).send({
      message: message
    })
  })
  
});

function compare( a, b ) {
  if ( a.firstName < b.firstName ){
    return -1;
  }
  if ( a.firstName > b.firstName ){
    return 1;
  }
  return 0;
}


// login / signup
router.post('/login', user.login);
router.post('/signup', user.signup);
//router.post('/logout', user.logout);
router.get('/logout', user.logout);
router.post('/resetPassword', user.resetPassword)
router.get('/resetPassword/token/:token', user.resetPasswordCheck)
router.post('/resetPassword/token/:token', user.resetPasswordValidate)
router.post('/confirmEmail', user.confirmEmail)

module.exports = router;