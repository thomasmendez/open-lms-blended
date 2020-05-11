var mongodb = require('../../db/mongodb');

const crypto = require('crypto')

var Grid = require("gridfs-stream");

var mongoose = require('mongoose');

var conn = mongoose.connection;

let bycrypt = require('bcrypt')

let myBycrypt = require('../../config/bycrypt')

let nodeMailer = require('../../config/email')

exports.getSettings = function (req, res, next) {

    // passed through authorization check already
	let username = req.user.username;

	res.status(200).send({
        validUsername: username,
    })
    
}

exports.getSettingsEmail = function (req, res, next) {

    // passed through authorization check already
	let username = req.user.username;
    let currentEmail = req.user.email;

	res.status(200).send({
        validUsername: username,
        currentEmail: currentEmail
    })
    
}

exports.updateSettingsEmail = function (req, res, next) {
    // get the information 
    let newEmail = req.body.email;
    let currentPassword = req.body.currentPassword;

    // make sure email is valid 
    email_regex = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/;

    if ((email_regex.test(newEmail))) {

        // compare sent password with hashed password 
        if (bycrypt.compareSync(currentPassword, req.user.password)) {

            let newEmailToken = crypto.randomBytes(20).toString('hex')

            mongodb.updateEmail(req.user.username, newEmail, newEmailToken).then(function (teacher) {

                let transporter = nodeMailer.transporter()

                let mailOptions = nodeMailer.emailTemplateConfirmEmail(req.user.username, teacher.email, newEmailToken)
                
				transporter.sendMail(mailOptions).then(function(info) {
					// email was sent successfully
                    
                    let message = "Email successfully updated! Please confirm the new email."

                    res.status(200).send({
                        email: teacher.email,
                        message: message
                    })

				}).catch(function(error) {
					// there was an error in sending the email
                    console.log("error: " + error)
                    
                    let message = "Email was changed, but there was an error in sending the email. If you did not recieve the email verification link, please reset to your previous valid email."

                    res.status(500).send({
                        email: teacher.email,
                        message: message
                    })
				})

            }).catch(function (error) {

                console.log("error: " + error)

                // resend whatever information back
                // send back an error message 
                let message = "Internal Server Error";

                let formData = {
                    email: newEmail,
                    currentPassword: currentPassword
                };

                res.status(500).send({
                    message: message,
                    formData: formData
                })
            })

        } else {

            // resend whatever information back
            // send back an error message 
            let message = "Your entered current password was incorrect";
            let errorCurrentPassword = "Current password is incorrect";

            let err = {
                currentPassword: errorCurrentPassword
            }

            let formData = {
                currentPassword: currentPassword,
                email: newEmail
            }

            res.status(401).send({
                message: message,
                errors: err,
                formData: formData
            })
        }

    } else {

        // not a valid email 
        let message = "Please enter a invalid email address";

        let errorEmail = "Email is invalid";

        let err = {
            email: errorEmail
        }
        let formData = {
            currentPassword: currentPassword,
            email: newEmail
        }

        res.status(422).send({
            message: message,
            errors: err,
            formData: formData
        })

    }

}

exports.getSettingsSemester = function (req, res, next) {

    // passed through authorization check already
	let username = req.user.username;
    let semester = req.user.semester;
    let year = req.user.year;

	res.status(200).send({
        validUsername: username,
        semester: semester,
        year: year
    })
}

exports.updateSettingsSemester = function (req, res, next) {

    // get the information 
    let newSemester = req.body.semester;
    let newYear = req.body.year.toString();
    let currentPassword = req.body.currentPassword;

    // validate the information
    if ((newSemester === "Fall") || (newSemester === "Spring") || (newSemester === "Summer") || (newSemester === "Full-Year")) {

        var ourCurrentYear = new Date().getFullYear();
        var ourNextYear = ourCurrentYear + 1;
        ourCurrentYear = ourCurrentYear.toString();
        ourNextYear = ourNextYear.toString();

        if ((newYear === ourCurrentYear) || (newYear === ourNextYear)) {

            // compare sent password with hashed password 

            if (bycrypt.compareSync(currentPassword, req.user.password)) {

                mongodb.updateSemester(req.user.username, newSemester, newYear).then(function (teacher) {

                    let message = "Successfully updated current semester!";

                    res.status(200).send({
                        message: message,
                        semester: teacher.semester,
                        year: teacher.year
                    })

                }).catch(function (error) {

                    console.log("error: " + error)

                    // resend whatever information back
                    // send back an error message 
                    let message = "Internal Server Error";

                    let formData = {
                        semester: newSemester,
                        year: newYear,
                        currentPassword: currentPassword
                    };

                    res.status(500).send({
                        message: message,
                        formData: formData
                    })
                })

            } else {

                // resend whatever information back
                // send back an error message 
                let message = "Your entered current password was incorrect";
                let errorCurrentPassword = "Current password is incorrect";

                let err = {
                    currentPassword: errorCurrentPassword
                };

                let formData = {
                    semester: newSemester,
                    year: newYear,
                    currentPassword: currentPassword
                };

                res.status(401).send({
                    message: message,
                    errors: err,
                    formData: formData
                })
            }
            
        } else {
            // not a valid year
            let message = "Please enter a valid semester and year";
            let errorSemester = "";
            let errorYear = "Year is invalid";

            let err = {
                semester: errorSemester,
                year: errorYear
            };
            let formData = {
                year: newYear,
                currentPassword: currentPassword
            };

            res.status(422).send({
                message: message,
                errors: err,
                formData: formData
            })

        }

    } else {

        // not a valid semester 
        let message = "Please enter a valid semester and year";
        let errorSemester = "Semester is invalid";
        let errorYear = "";

        let err = {
            semester: errorSemester,
            year: errorYear
        };
        let formData = {
            semester: newSemester,
            currentPassword: currentPassword
        };

        res.status(422).send({
            message: message,
            errors: err,
            formData: formData
        })

    }
    
}

exports.getSettingsPassword = function (req, res, next) {

    // passed through authorization check already
	let username = req.user.username;

	res.status(200).send({
        validUsername: username,
    })

}

exports.updateSettingsPassword = function (req, res, next) {

    // get the information 
    let currentPassword = req.body.currentPassword;
    let newPassword = req.body.newPassword;
    let confirmedNewPassword = req.body.confirmedNewPassword;

    let pass_regex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,50})/;

    // validate the new password
    if (pass_regex.test(newPassword)) {

        // check to make sure that it is the same as the confirmed new password
        if (newPassword === confirmedNewPassword) {

            // compare sent password with hashed password 
            if (bycrypt.compareSync(currentPassword, req.user.password)) {

                let message = "Successfully updated current password!";

                // send confirmation information 

                let success = {
                    message: message
                };

                // create a hashed password 
                let newHashedPassword = myBycrypt.generateHash(newPassword);

                mongodb.updatePassword(req.user.username, newHashedPassword).then(function (teacher) {

                    let message = "Successfully updated current password!";

                    res.status(200).send({
                        message: message
                    })

                }).catch(function (error) {

                    console.log("database error: " + error)

                    // resend whatever information back
                    // send back an error message 
                    let message = "Internal Server Error";

                    let formData = {
                        currentPassword: currentPassword,
                        newPassword: newPassword,
                        confirmedNewPassword: confirmedNewPassword
                    };

                    res.status(500).send({
                        message: message,
                        formData: formData
                    })
                });

            } else {

                // resend whatever information back
                // send back an error message 
                let message = "Your entered current password was incorrect";
                let errorCurrentPassword = "Current password is incorrect";

                let err = {
                    message: message,
                    currentPassword: errorCurrentPassword
                };

                let formData = {
                    password: currentPassword,
                    newPassword: newPassword,
                    confirmedNewPassword: confirmedNewPassword
                };

                res.status(401).send({
                    message: message,
                    errors: err,
                    formData: formData
                })
            }
            
        } else {
            // new password and current password does not match 
            let message = "New password and confirmed new password does not match!";
            let errorCurrentPassword = "";
            let errorPassword = "";
            let errorConfirmedNewPassword = "Confirmed password does not match new password";

            let err = {
                message: message,
                currentPassword: errorCurrentPassword,
                newPassword: errorPassword,
                confirmedNewPassword: errorConfirmedNewPassword
            };
            let formData = {
                password: currentPassword,
                newPassword: newPassword,
                confirmedNewPassword: confirmedNewPassword
            };
            res.status(422).send({
                message: message,
                errors: err,
                formData: formData
            })
        }

    } else {

        // not a valid password 
        let message = "Please enter a valid password";
        let errorCurrentPassword = "";
        let errorPassword = "Password is invalid";
        let errorConfirmedNewPassword = "";

        let err = {
            message: message,
            currentPassword: errorCurrentPassword,
            newPassword: errorPassword,
            confirmedNewPassword: errorConfirmedNewPassword
        };
        let formData = {
            currentPassword: currentPassword,
            newPassword: newPassword,
            confirmedNewPassword: confirmedNewPassword
        };

        res.status(422).send({
            message: message,
            errors: err,
            formData: formData
        })

    }
}

exports.getSettingsDeleteAccount = function (req, res, next) {

    let username = req.user.username

    res.status(200).send({
        validUsername: username
    })

}

exports.getSettingsViewArchive = function (req, res, next) {

    let username = req.user.username
    let archivedCourses = req.user.archivedCourses
    
    res.status(200).send({
        username: username,
        archivedCourses: archivedCourses
    })

}

exports.updateSettingsDeleteAccount = function (req, res, next) {

    // get the information 
    let currentPassword = req.body.currentPassword;
        
    // compare sent password with hashed password 
    if (bycrypt.compareSync(currentPassword, req.user.password)) {

        // get the all of the file id's 
        // for all of the courses 

        let user = req.user;

        let fileIDs = new Array();

        // iterate though courses
        Object.entries(user.courses).forEach(entry => {
            let key = entry[0];
            let value = entry[1];
            //use key and value here

            if (value.syllabus.fileID !== undefined) {
                // get syllabus file
                fileIDs.push(value.syllabus.fileID);
            }
            
            if (value.schedule.fileID !== undefined) {
                // get schedule file 
                fileIDs.push(value.schedule.fileID);
            }

            // iterate through assignments 
            Object.entries(value.assignments).forEach(entry => {
                let key = entry[0];
                let value = entry[1];
                //use key and value here
                let fileID = value.fileID;
                fileIDs.push(fileID);
            });
            
            // iterate through lectureNotes 
            Object.entries(value.lectureNotes).forEach(entry => {
                let key = entry[0];
                let value = entry[1];
                //use key and value here
                let fileID = value.fileID;
                fileIDs.push(fileID);
            });

            // iterate through classNotes 
            Object.entries(value.classNotes).forEach(entry => {
                let key = entry[0];
                let value = entry[1];
                //use key and value here
                let fileID = value.fileID;
                fileIDs.push(fileID);
            });

            // iterate through otherNotes 
            Object.entries(value.otherNotes).forEach(entry => {
                let key = entry[0];
                let value = entry[1];
                //use key and value here
                let fileID = value.fileID;
                fileIDs.push(fileID);
            });
           
        });

        // remove the files 

        var gfs = Grid(conn.db);

        for (index = 0; index < fileIDs.length; index++) { 
            let fileID = fileIDs[index];
            gfs.remove({_id: fileID}, (err, file) => {

                if (err || !file) {
                    // res.status(404).send('File Not Found');
                    console.log("file does not exist");
                }
                
            });
        } 

        // delete the user by finding them by their password
        mongodb.deleteUser(req.user.password).then(function (teacher) {

            let message = "Account successfully deleted"

            res.status(200).send({
                message: message
            })

        }).catch(function (error) {

            console.log("database error: " + error)

            // resend whatever information back
            // send back an error message 
            let message = "Internal Server Error";
            let formData = {
                currentPassword: currentPassword
            };
            res.status(500).send({
                message: message,
                formData: formData
            })

        });

    } else {

        // resend whatever information back
        // send back an error message 
        let message = "Your entered current password was incorrect";
        let errorCurrentPassword = "Current password is incorrect";

        let err = {
            currentPassword: errorCurrentPassword
        };

        let formData = {
            password: currentPassword
        };

        res.status(401).send({
            message: message,
            errors: err,
            formData: formData
        })
    }
    
}

exports.updateSettingsArchiveCourse = function (req, res, next) {

    let teacher = req.user
    let course = req.body.course

    let searchedCourse = course.course

    // check through the user's courses
    // extract the entire course

    var entireCourse;

    // teachers is a javascript Object
    Object.entries(teacher.courses).forEach(entry => {
        let value = entry[1];

        if (value.course === searchedCourse) {
            entireCourse = value
            console.log("entire course: " + entireCourse)
        }
    });

    // move the entire course to archieved course

    mongodb.moveCourseToArchive(entireCourse).then(function(teacher) {

        let message = "Course " + course.course + " was moved to archived courses"

        res.status(200).send({
            message: message,
            teacher: teacher
        })

    }).catch(function(error) {
        console.log("error: " + error)

        let message = "Internal Server Error"

        res.status(500).send({
            message: message
        })

    })
    
}