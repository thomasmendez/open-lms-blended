const nodemailer = require('nodemailer')

// get env variables
const user = process.env.NODE_EMAIL_USERNAME
const pass = process.env.NODE_EMAIL_PASSWORD

// full service list https://nodemailer.com/smtp/well-known/
const service = process.env.NODE_EMAIL_SERVICE

exports.transporter = function() {
  // gmail is very secure
  // go to https://myaccount.google.com/lesssecureapps
  // turn on allow less secure apps on
  return nodemailer.createTransport({
  	service: service,
  	auth: {
  	  user: user, // 'youremail@gmail.com'
  	  pass: pass // 'yourpassword'
  	}
  });

}

exports.emailTemplateResetPassword = function(toEmail, token) {

    var link

    if (process.env.ENV === "production" || process.env.ENV === "staging") {
      var link = process.env.HTTP_TYPE + "://" + process.env.DOMAIN_NAME + "/teacher/token/" + token
    } else if (process.env.ENV === "development") {
      var link = process.env.HTTP_TYPE + "://" + process.env.DOMAIN_NAME + ":" + process.env.REACT_APP_PORT + "/teacher/token/" + token
    }

    return mailOptions = {
        from: user,
        to: toEmail,
        // to multiple emails
        // to: 'myfriend@yahoo.com, myotherfriend@yahoo.com',
        subject: process.env.INSTITUTION_NAME + ' - Reset Password Instructions',
        // text: 'That was easy!'
        // can send email with html instead of text also
        html: '<p>Hello ' + toEmail + '!</p>' + 
              '<p></p>' + 
              '<p>Someone has requested a link to change your password, and you can do this through the link below.</p>' + 
              '<p><a href=' + link + '>Change my password</a></p>' + 
              '<p></p>' +
              '<p>If you did not request this, please ignore this email.</p>' + 
              '<p></p>' + 
              '<p>Please note that this link is only valid for the next 15 minutes</p>'

    }

}

exports.emailTemplateConfirmEmail = function(username, toEmail, token) {

  var link
  
  if (process.env.ENV === "production" || process.env.ENV === "staging") {
    link = process.env.HTTP_TYPE + "://" + process.env.DOMAIN_NAME + "/teacher/confirmEmail/" + username + "/" + token
  } else if (process.env.ENV === "development") {
    link = process.env.HTTP_TYPE + "://" + process.env.DOMAIN_NAME + ":" + process.env.REACT_APP_PORT + "/teacher/confirmEmail/" + username + "/" + token
  }
  
  return mailOptions = {
      from: user,
      to: toEmail,
      // to multiple emails
      // to: 'myfriend@yahoo.com, myotherfriend@yahoo.com',
      subject: process.env.INSTITUTION_NAME + ' - Confirm Email Address',
      // text: 'That was easy!'
      // can send email with html instead of text also
      html: '<p>Hello ' + toEmail + '!</p>' + 
            '<p></p>' + 
            '<p>Please click on the link below to confirm your email address for your account.</p>' + 
            '<p><a href=' + link + '>Confirm email address</a></p>' + 
            '<p></p>' +
            '<p>If you did not request this, please ignore this email.</p>'

  }

}

exports.emailTemplateInviteToLMS = function(toEmail, code) {

  var link
  
  if (process.env.ENV === "production" || process.env.ENV === "staging") {
    link = process.env.HTTP_TYPE + "://" + process.env.DOMAIN_NAME + "/signup"
  } else if (process.env.ENV === "development") {
    link = process.env.HTTP_TYPE + "://" + process.env.DOMAIN_NAME + ":" + process.env.REACT_APP_PORT + "/signup"
  }
  
  return mailOptions = {
      from: user,
      to: toEmail,
      // to multiple emails
      // to: 'myfriend@yahoo.com, myotherfriend@yahoo.com',
      subject: process.env.INSTITUTION_NAME + ' - Sign Up Code',
      // text: 'That was easy!'
      // can send email with html instead of text also
      html: '<p>Hello ' + toEmail + '!</p>' + 
            '<p></p>' + 
            '<p>You have been invited to sign up to ' + process.env.INSTITUTION_NAME + '!</p>' +
            '<p>Here is your code to sign up: ' + code + '</p>' + 
            '<p>This code is will expire in a week.</p>' + 
            '<p>If it expires and you have not registered, please talk to the system administrator for a new code</p>' +
            '<p></p>' + 
            '<p>You can click the following link to open up the sign up page</p>' + 
            '<p><a href=' + link + '>' + process.env.INSTITUTION_NAME + ' Sign Up' + '</a></p>' + 
            '<p></p>' +
            '<p>If you believe you recived this invite by mistake, please ignore this email.</p>'

  }

}