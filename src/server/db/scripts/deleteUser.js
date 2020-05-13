var mongoose = require('mongoose');
// get env variables 
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

const Teacher = require('../models/teacher')

const prompt = require('prompt');

const properties = [
    {
        name: 'username',
        message: 'Username of user you wish to delete',
        type: 'string',
        validator: /[a-zA-Z\d][a-zA-Z0-9_]{3,15}$/,
        warning: 'Please enter a valid username'
    },
    {
        name: 'confirm',
        message: 'Are you sure? (yes/no)',
        type: 'string',
        validator: /^(?:Yes|yes|Y|y|No|no|N|n)$/,
        warning: 'Please enter (yes/no) only'
    },
];

console.log("Type out the username of the user you wish to delete from " + process.env.INSTITUTION_NAME)
console.log("If you do not wish to delete anyone please just press enter and leave responses blank to cancel or refuse when asked for confirmation")

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

    let username = result.username
    let confirm = result.confirm

    if (username && confirm) {

        if (confirm === "Yes" ||
            confirm === "yes" ||
            confirm === "y" || 
            confirm === "Y") {

            let query = {username: username};

            mongoose.model('teachers', Teacher.schema).findOneAndDelete(
                query
            ).then(function (items) {
                console.log("Successfully deleted user")

                process.exit();

            }).catch(function (error) {
                console.log("database error: " + error)

                process.exit();
            });

        } else {
            console.log("Cancelled deletion of user")

            process.exit();
        }

    } else {
        console.error("Could not delete. Please make sure all fields are filled")

        process.exit();
    }

});