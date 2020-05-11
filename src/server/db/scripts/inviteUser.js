var mongoose = require('mongoose');
// get env variables 
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

const NewUser = require('../models/newUser')

const prompt = require('prompt');

const nodeMailer = require('../../config/email')

const properties = [
    {
        name: 'email',
        message: 'Email of user you wish to invite to sign up',
        type: 'string',
        validator: /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/,
        warning: 'Please enter a valid email'
    }
];

console.log("Please type out the email of the user you would like to invite to create an account in " + process.env.INSTITUTION_NAME)

//
// Disable prompt's built-in SIGINT handling:
//

prompt.start({noHandleSIGINT: true});
  
process.on('SIGINT', function() {

    //console.log("This will execute when you hit CTRL+C");
    process.exit();

});

prompt.get(properties, function (err, result) {

    if (err) { 
        console.error(err)        
        process.exit();
    }

    let email = result.email

    if (email) {

        let code = generateCode(12)

        let newUser = new NewUser.model({
            email: email,
            code: code
        });

        newUser.save().then(function (result) {

            let transporter = nodeMailer.transporter()

            let mailOptions = nodeMailer.emailTemplateInviteToLMS(email, code)

            transporter.sendMail(mailOptions).then(function(info) {
                // email was sent successfully
                console.log("email invitation was sent to " + email + "!")
                process.exit();
            }).catch(function(error) {
                // there was an error in sending the email
                console.log("error: " + error)
                process.exit();
            })

        }).catch(function (err) {

            // there is a error with database
            console.log("database saving error: " + err)
            process.exit();
        });

    } else {

        console.error("Please enter a email")
        process.exit();

    }

});

function generateCode(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}