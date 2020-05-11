let bycrypt = require('bcrypt');
const passport = require('passport');

const crypto = require('crypto')

var formidable = require('formidable');

var path = require("path");

var Grid = require("gridfs-stream");

var mongoose = require('mongoose');

var conn = mongoose.connection;

Grid.mongo = mongoose.mongo;

var fs = require('fs-extra');

const Teacher = require('../db/models/teacher');

let mongodb = require('../db/mongodb');

let myBycrypt = require('../config/bycrypt')

const nodeMailer = require('../config/email')

exports.signup = function(req, res, next) {

	// validate incomming form data 

	// if it is wrong

	// redirect to the page again and 
	// pass in the appropriate error information 

	// then save user to database 

	let username = req.body.username.trim();

	let code = req.body.code.trim();

	let email = req.body.email.trim();

	let password = req.body.password;

	let confirmedPassword = req.body.confirmedPassword;
	
	let firstName = req.body.firstName.trim();

	let lastName = req.body.lastName.trim();

	let semester = req.body.semester;

	let year = req.body.year;

	validateSignup(username, code, email, password, confirmedPassword, 
		firstName, lastName, semester, year).then((validTeacher) => {

		// validation successfull 
		// check for username in database

		// check against the database to see if it exist already 
		mongodb.findTeacherByUsername(username).then(function (teacher) {

			// returns null if teacher does not exist

			// inputed username does not exist

			if (teacher === null) {

				// check if the code is valid before creating the account

				mongodb.checkUserCode(code).then(function (result) {

					if (result !== null) {

						// code is valid and was removed
						// add new user to the database

						// send email to confirm email address
						let token = crypto.randomBytes(20).toString('hex')

						// create email token before saving
						let newTeacher = new Teacher.model({
							username: validTeacher.username,
							password: validTeacher.password,
							email: validTeacher.email,
							emailToken: token,
							confirmedEmail: false,
							firstName: validTeacher.firstName,
							lastName: validTeacher.lastName,
							semester: validTeacher.semester,
							year: validTeacher.year
						});

						newTeacher.save().then(function (user) {
						
							let message = "Sign up success"
						
							req.logIn(user, function(err) {
								res.status(200).send({
									validUsername: user.username,
									message: message
								})
							})
						
							let transporter = nodeMailer.transporter()
						
							let mailOptions = nodeMailer.emailTemplateConfirmEmail(username, email, token)
						
							transporter.sendMail(mailOptions).then(function(info) {
								// email was sent successfully
								console.log("email confirmation was sent!")
							}).catch(function(error) {
								// there was an error in sending the email
								console.log("error: " + error)
							})
						
						}).catch(function (err) {
						
							// there is a error with database
							console.log("database saving error: " + err)
						
							errorMessage = "Internal server error";
						
							let errors = {
								errorMessage: errorMessage
							}
						
							let formData = {
								username: username,
								password: password,
								confirmedPassword: confirmedPassword,
								email: email,
								firstName: firstName,
								lastName: lastName,
								semester: semester,
								year: year
							}
						
							res.status(500).send({
								formData: formData,
								errors: errors
							})
						});

					} else {

						// the code does not exist in the database
						// code is invalid

						errorMessage = "Code is invalid";
					
						let errors = {
							errorMessage: errorMessage,
						}

						let formErrors = {
							username: "",
							code: "Code is invalid",
							password: "",
							confirmedPassword: "",
							email: "",
							firstName: "",
							lastName: "",
							semester: "",
							year: ""
						}
					
						let formData = {
							username: username,
							code: code,
							password: password,
							confirmedPassword: confirmedPassword,
							email: email,
							firstName: firstName,
							lastName: lastName,
							semester: semester,
							year: year
						}
					
						res.status(422).send({
							formData: formData,
							formErrors: formErrors,
							errors: errors
						})

					}

				}).catch(function(err) {

					// there is a error with database
					console.log("database error: " + err)

					errorMessage = "Internal server error";

					let errors = {
						errorMessage: errorMessage
					}
				
					let formData = {
						username: username,
						code: code,
						password: password,
						confirmedPassword: confirmedPassword,
						email: email,
						firstName: firstName,
						lastName: lastName,
						semester: semester,
						year: year
					}
				
					res.status(500).send({
						formData: formData,
						errors: errors
					})

				})

			} else {

				// username exist already 
				// send username taken error
				// and form data back

				errorMessage = "Username is already taken. Please use a different username";

				let errors = {
					errorMessage: errorMessage
				}

				let formData = {
					username: username,
					code: code,
					password: password,
					confirmedPassword: confirmedPassword,
					email: email,
					firstName: firstName,
					lastName: lastName,
					semester: semester,
					year: year
				}

				// can't create new user
				res.status(409).send({
					formData: formData,
					errors: errors
				})
				
			}

		}).catch(function (err) {
			// there is a error with database
			console.log("database error: " + err)

			errorMessage = "Internal server error";

			let errors = {
				errorMessage: errorMessage
			}

			let formData = {
				username: username,
				code: code,
				password: password,
				confirmedPassword: confirmedPassword,
				email: email,
				firstName: firstName,
				lastName: lastName,
				semester: semester,
				year: year
			}

			res.status(500).send({
				formData: formData,
				errors: errors
			})

		});

	}).catch((formErrors) => {

		// validation falied
		// redirect back 

		// send any submited form data back

		errorMessage = "Please make sure all fields are filled out properly";

		let errors = {
			errorMessage: errorMessage
		}

		let formData = {
			username: username,
			password: password,
			code: code,
			confirmedPassword: confirmedPassword,
			email: email,
			firstName: firstName,
			lastName: lastName,
			semester: semester,
			year: year
		}

		res.status(422).send({
			formData: formData,
			formErrors: formErrors,
			errors: errors 
		})

	});
}

function validateSignup(username, code, email, password, confirmedPassword, firstName, lastName, semester, year) {

	return new Promise((resolve, reject) => {

		let usernameStartWith = /[a-zA-Z\d]/;
		let usernameRegex = /[a-zA-Z\d][a-zA-Z0-9_]{3,10}$/;
		let emailRegex = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/;

		let passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,50})/;

		let firstNameRegex = /^[a-z | A-Z | \. | -]+$/;
    	let lastNameRegex = /^[a-z | A-Z | \. | -]+$/;

		var errorUsername = "";
		var errorCode = "";
		var errorPassword = "";
		var errorConfirmedPassword = "";
		var errorEmail = "";
		var errorFirstName = "";
		var errorLastName = "";
		var errorSemester = "";
		var errorYear = "";

		let currentYear = new Date().getFullYear();
		//let nextYear = (currentYear + 1).toString();
		let nextYear = currentYear + 1

		if (!(usernameStartWith.test(username))) {
    	    errorUsername = "Username does not start with letter or digit";
    	} else if (!(usernameRegex.test(username))) {
    	    errorUsername = "Username needs to only include letters, digit, or underscore";
		}

		if (!code) {
			errorCode = "Please enter a code"
		}
	
    	if (!(emailRegex.test(email))) {
    	    errorEmail = "Please enter a valid email";
		}

    	if (!(passwordRegex.test(password))) {
    	    errorPassword = "Password invalid. Must contain 1 lower, 1 upper, 1 digit, 1 special character and must be at least 6 characters long";
		}

    	if (password !== confirmedPassword) {
    	    errorConfirmedPassword = "Password and confirmed password does not match";
		} else if (confirmedPassword === "") {
			errorConfirmedPassword = "Please confirm a valid password"
		}

    	if (!(firstNameRegex.test(firstName))) {
			errorFirstName = "Please only use letters and dashes for first name";
		}

    	if (!(lastNameRegex.test(lastName))) {
			errorLastName = "Please only use letters and dashes for last name";
		}

		if (!(semester === "Fall" || semester === "Spring" || semester === "Summer" || semester === "Full-Year")) {
			errorSemester = "Please choose between 'Fall', 'Spring', 'Summer' or 'Full-Year'";
		}

		if (!(year == currentYear || year == nextYear)) {
			errorYear = "Please pick between " + currentYear + " or " + nextYear;
		}

		if (errorUsername === "" && 
			errorCode === "" &&
			errorPassword === "" &&
			errorConfirmedPassword === "" &&
			errorEmail === "" && 
			errorFirstName === "" &&
			errorLastName === "" && 
			errorSemester === "" &&
			errorYear === "") {

			// no errors
			// create a hashed password
			// create a teacher object
			// to add to the database
			let hashedPassword = myBycrypt.generateHash(password);

			let teacher = new Teacher.model({
				username: username,
				password: hashedPassword,
				email: email,
				firstName: firstName,
				lastName: lastName,
				semester: semester,
				year: year
			});

			// if form is okay
			resolve(teacher);

		} else {

			// we have an error 
			// redirect back to submit form

			let err = {
				username: errorUsername,
				code: errorCode,
				password: errorPassword,
				confirmedPassword: errorConfirmedPassword,
				email: errorEmail,
				firstName: errorFirstName,
				lastName: errorLastName,
				semester: errorSemester,
				year: errorYear
			};

			// if form not okay
			reject(err);

		}

	});
}

exports.login = function(req, res, next) {

	// custom callback
	passport.authenticate('local', function(err, user, info) {
		if (err) {
			return next(err); 
		} else {
            // user not authenticated 
			if (!user) {
				// return form 
                // data used 
				if (info != null) {
                    let formData = info.formData;
                    let errors = info.errors;

                    // send back the form data with the errors

                   res.status(401).send({
                       formData: formData,
                       errors: errors
                   });

				} else {
                    console.log("We don't have data to return")
                    // there is an error on our end
                    // we don't have info to return 
                    // from passport_setup.js
                    // send this just in case 
                    res.status(401).send({
                        formData: {
                            username: "",
                            password: ""
                        },
                        errors: {
                            message: "Internal server error"
                        }
                    })
				}
			} else {

                // we have a valid authenticated user
                
				req.logIn(user, function(err) {
					
					res.status(200).send({
						validUsername: user.username,
						message: "Login success"
					});
				});
			}
		}
	})(req, res, next);

}

exports.logout = function(req, res, next) {
	req.logout();
	req.session.destroy();
	res.status(200).send({
		message: "Logout successful"
	});
}

exports.confirmEmail = function (req, res, next) {
    let username = req.body.username
	let emailToken = req.body.emailToken

    // check database for email token
    mongodb.confirmEmail(username, emailToken).then(function (teacher) {

        if (teacher !== null) {

            // it is valid
            // set confirmed email to true 

            let message = "Email is now confirmed"

            res.status(200).send({
				message: message,
				isEmailConfirmed: true
            })

        } else {

            // email token is invalid

            let message = "Email token is invalid, cannot confirm email"

            res.status(401).send({
				message: message,
				isEmailConfirmed: false
            });

        }

    }).catch(function(error) {
		console.log("error: " + error)

		let message = "Internal Server Error"
		res.status(500).send({
			message: message
		})
    })

}

exports.resetPassword = function (req, res, next) {

	let email = req.body.email

	let emailRegex = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/;

	if (emailRegex.test(email)) {

		let token = crypto.randomBytes(20).toString('hex')

		mongodb.setResetPasswordToken(email, token).then(function(teacher) {

			if (teacher !== null) {

				let transporter = nodeMailer.transporter()

				let mailOptions = nodeMailer.emailTemplateResetPassword(email, token)

				transporter.sendMail(mailOptions).then(function(info) {

					let message = "An email has been sent to reset your password. Please check your email."

					res.status(200).send({
					  message: message
				  	})

				}).catch(function(error) {
					console.log("error: " + error)

					let message = "An internal error occured. Unable to send reset password instructions"
					res.status(500).send({
						message: message
					})
				})

			} else {

				let message = "Email is not registered. Password cannot be reset unless the email was confirmed with the account."

				let formData = {
					email: email
				}

				res.status(401).send({
					message: message,
					formData: formData
				})

			}

		}).catch(function(error) {
			console.log("error: " + error)

			let message = "Email is not registered. Password cannot be reset unless the email was confirmed with the account."

			let formData = {
				email: email
			}

			res.status(401).send({
				message: message,
				formData: formData
			})

		})

	} else {

		let message = "Please enter a valid email address"

		let errorEmail = "Please enter a valid email";

		let err = {
			email: errorEmail
		}

		let formData = {
			email: email
		}

		res.status(422).send({
			message: message,
			formData: formData,
			errors: err 
		})

	}

}

exports.resetPasswordCheck = function(req, res, next) {

	let token = req.body.token

	// check if it exist 

	mongodb.resetPasswordTokenCheck(token).then(function(result) {

		if (result !== null) {

			// check current date with date on token
			// if we are over

			let currentTime = new Date()
			let tokenTime = new Date(result.resetPassword.expirationDate)

			if (currentTime < tokenTime) {

				let message = "Token is valid"

				res.status(200).send({
					message: message,
					isTokenValid: true
				})

			} else {

				let message = "This token is no longer valid"

				res.status(401).send({
					message: message,
					isTokenValid: false
				})

			}

		} else {

			// token does not exist 
			// but don't let the user know that 
			let message = "This token is no longer valid"

			res.status(401).send({
				message: message,
				isTokenValid: false
			})

		}

	}).catch(function(error) {
		console.log("error: " + error)

		let message = "Internal Server Error"

		res.status(500).send({
			message: message
		})
	})

}

exports.resetPasswordValidate = function(req, res, next) {

	let sentToken = req.body.token
	let newPassword = req.body.newPassword
	let confirmedNewPassword = req.body.confirmedNewPassword

	isPasswordValid = true
	errorNewPassword = ""
	errorConfirmedNew = ""
	
	let passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,50})/;

	if (!(passwordRegex.test(newPassword))) {
		errorNewPassword = "Password invalid. Must contain 1 lower, 1 upper, 1 digit, 1 special character and must be at least 6 characters long";
		isPasswordValid = false
	}

	if (newPassword !== confirmedNewPassword) {
		errorConfirmedNew = "Password and confirmed password does not match";
		isPasswordValid = false
	} else if (confirmedNewPassword === "") {
		errorConfirmedNew = "Please confirm a valid password"
		isPasswordValid = false
	}

	if (isPasswordValid) {

		// check on database if it is valid 

		mongodb.resetPasswordTokenCheck(sentToken).then(function(result) {

			if (result !== null) {

				// check if the current time is less than when it is going to expire

				// check current date with date on token
				// if we are over

				let currentTime = new Date()
				let tokenTime = new Date(result.resetPassword.expirationDate)

				if (currentTime < tokenTime) {

					// hash the password
					let hashedPassword = myBycrypt.generateHash(newPassword);

					// change the password
					// remove the old token 
					mongodb.updatePasswordRemoveToken(result.username, hashedPassword).then(function(updateResult) {

						let message = "Password has successfully updated! Please login."

						res.status(200).send({
							message: message,
							didUpdatePassword: true
						})

					}).catch(function(error) {

						console.log("datebase error: " + error)

						let message = "Internal Server Error"

						let formData = {
							newPassword: newPassword,
							confirmedNewPassword: confirmedNewPassword
						}
					
						res.status(500).send({
							message: message,
							formData: formData
						})

					})

				} else {

					let message = "This token is no longer valid"

					res.status(401).send({
						message: message,
						isTokenValid: false
					})

				}

			} else {

				// token does not exist but send this message anyways
				let message = "This token is no longer valid"

				res.status(401).send({
					message: message,
					isTokenValid: false
				})

			}

		}).catch(function(error) {

			console.log("datebase error: " + error)

			let message = "Internal Server Error"

			let formData = {
				newPassword: newPassword,
				confirmedNewPassword: confirmedNewPassword
			}

			res.status(500).send({
				message: message,
				formData: formData
			})

		})

	} else {

		let message = "Please make sure all fields are valid!"

		let err = {
			newPassword: errorNewPassword,
			confirmedNewPassword: errorConfirmedNewPassword
		}

		let formData = {
			newPassword: newPassword,
			confirmedNewPassword: confirmedNewPassword
		}

		res.status(422).send({
			message: message,
			formData: formData,
			errors: err 
		})

	}

}

exports.addCourse = function(req, res, next) {

	let username = req.user.username;
	let semester = req.user.semester;
	let year = req.user.year;

	let course = req.body.course.trim();
	let courseFullName = req.body.courseFullName.trim();

	// see if a course exist then 
	mongodb.findCourse(course).then(function (result) {
		// if the course does not exist in database add it
		if (result === null) {
			mongodb.addCourse(username, course, courseFullName, semester, year).then(function(teacher) {

				let message = "Course " + course + " was added successfully to " + semester + " " + year + "!"
				
				// get the updated teacher data
    			var teacherUser = {
					email: teacher.email,
    			    firstName: teacher.firstName,
    			    lastName: teacher.lastName,
    			    semester: teacher.semester,
    			    year: teacher.year,
    			    courses: teacher.courses
				}

				res.status(200).send({
					message: message,
					teacher: teacherUser
				})

			}).catch(function (error) {

				console.log("error: " + error)

				let message = "An error occured while adding course please try again."
				
				res.status(500).send({
					message: message
				})

			});

		} else {

			let message = "Course " + course + " already exist in the database. Please make sure the correct course ID is included."
			
			res.status(403).send({
				message: message
			})

		}

	}).catch(function (error) {

		console.log("error: " + error)

		let message = "Internal Server Error"

		res.status(500).send({
			message: message
		})

	});

}

exports.addCourseRedirect = function(req, res, next) {

	if (req.user !== undefined) {

		res.redirect('/portal/' + req.user.username);

	} else {

		// return user to login page
		res.redirect('/login')

	}

}

exports.addSyllabus = function(req, res, next) {

	var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
		/*
    	for (const file of Object.entries(files)) {
    	  console.log(file)
    	}
		*/
		var filename = files.uploadFile.name;
		let course = fields.course;
		// create a timestamp for when it was uploaded
		let uploadDate = new Date().toLocaleDateString();
		var filename = files.uploadFile.name;
		var oldPath = files.uploadFile.path;
		var newPath = path.join(__dirname, '../temp/' + filename);
		// move the file to the temp folder 
		moveUploadedFileToTempFolder(oldPath, newPath).then((filePath) => {
			// we know the file exist in the new path 
			// from that path, make a write stream to upload
			// the file to the database
			writeFileToDatabase(filePath, filename).then((fileID) => {
				console.log("write stream finished. Remove file from temp folder");
				// try to remove the file that was uploaded to the system 
				// we only want it stored in the database
				try {
					
					fs.unlinkSync(filePath);
					console.log("file removed from temp directory");
					// we now add the data
					mongodb.addSyllabus(course, fileID, filename, uploadDate).then(function(teacher) {
						// send ok status
						let message = "Syllabus was successfully added!"
						var syllabusInfo
						// return updated data
						Object.entries(teacher.courses).forEach(entry => {
							let value = entry[1];
						
							if (value.course === course) {
								syllabusInfo = {
									course: value.course,
									fullCourseName: value.fullCourseName,
									syllabus: value.syllabus
								};
							}
						});
					
						res.status(200).send({
							message: message,
							syllabus: syllabusInfo
						})
					});

				} catch(err) {
					// file removal error
					console.error("File removal error: " + err);
					let message = "Internal Server Error"
					res.status(505).send({
						message: message
					})
				}
			}).catch((err) => {
				// write stream catch error 
				console.log("write stream catch error" + err);
				let message = "Internal Server Error"
				res.status(505).send({
					message: message
				})
			});
		}).catch((err) => {
			// error while moving uploaded file to temp folder 
			console.log("renamed file catch error: " + err);
			let message = "Internal Server Error"
			res.status(505).send({
				message: message
			})
		});
    	
	});

}

exports.updateSyllabus = function(req, res, next) {

	var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
		/*
    	for (const file of Object.entries(files)) {
    	  console.log(file)
    	}
		*/
		// remove old syllabus 
		var gfs = Grid(conn.db);
		let oldSyllabusFileID = fields.syllabusFileID;
		
    	gfs.remove({_id: oldSyllabusFileID}, (err, file) => {
    	    if (err || !file) {
				// res.status(404).send('File Not Found');
				console.log("file does not exist");
				/*
				let message = "Could not remove old syllabus file to update"
				res.status(505).send({
					message: message
				})
				*/
			}
		});
		
		// add new syllabus 
		var filename = files.uploadFile.name;
		let course = fields.course;
		// create a timestamp for when it was uploaded
		let uploadDate = new Date().toLocaleDateString(); 
		var filename = files.uploadFile.name;
		var oldPath = files.uploadFile.path;
		var newPath = path.join(__dirname, '../temp/' + filename);
		// move the file to the temp folder 
		moveUploadedFileToTempFolder(oldPath, newPath).then((filePath) => {
			// we know the file exist in the new path 
			// from that path, make a write stream to upload
			// the file to the database
			writeFileToDatabase(filePath, filename).then((fileID) => {
				console.log("write stream finished. Remove file from temp folder");
				// try to remove the file that was uploaded to the system 
				// we only want it stored in the database
				try {
					
					fs.unlinkSync(filePath);
					console.log("file removed from temp directory");
					// we now add the data
					mongodb.addSyllabus(course, fileID, filename, uploadDate).then(function(teacher) {
						// send ok status
						let message = "Syllabus was successfully updated!"
						var syllabusInfo
						// return updated data
						Object.entries(teacher.courses).forEach(entry => {
							let value = entry[1];
						
							if (value.course === course) {
								syllabusInfo = {
									course: value.course,
									fullCourseName: value.fullCourseName,
									syllabus: value.syllabus
								};
							}
						});
					
						res.status(200).send({
							message: message,
							syllabus: syllabusInfo
						})
					});
				  } catch(err) {
					// file removal error
				  	console.error("File removal error: " + err);
					let message = "Internal Server Error"
					res.status(505).send({
					  message: message
					})
				  }
			}).catch((err) => {
				// write stream catch error 
				console.log("write stream catch error" + err);
				let message = "Internal Server Error"
				res.status(505).send({
					message: message
				})
			});
		}).catch((err) => {
			// error while moving uploaded file to temp folder 
			console.log("renamed file catch error: " + err);
			let message = "Internal Server Error"
			res.status(505).send({
				message: message
			})
		});
		
	});

}


exports.addSchedule = function(req, res, next) {

	var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
		/*
    	for (const file of Object.entries(files)) {
    	  console.log(file)
    	}
		*/
		var filename = files.uploadFile.name;
		let course = fields.course;
		// create a timestamp for when it was uploaded
		let uploadDate = new Date().toLocaleDateString();
		var filename = files.uploadFile.name;
		var oldPath = files.uploadFile.path;
		var newPath = path.join(__dirname, '../temp/' + filename);
		// move the file to the temp folder 
		moveUploadedFileToTempFolder(oldPath, newPath).then((filePath) => {
			// we know the file exist in the new path 
			// from that path, make a write stream to upload
			// the file to the database
			writeFileToDatabase(filePath, filename).then((fileID) => {
				console.log("write stream finished. Remove file from temp folder");
				// try to remove the file that was uploaded to the system 
				// we only want it stored in the database
				try {
					
					fs.unlinkSync(filePath);
					console.log("file removed from temp directory");
					// we now add the data
					mongodb.addSchedule(course, fileID, filename, uploadDate).then(function(teacher) {
						// send ok status
						let message = "Schedule was successfully added!"
						var scheduleInfo
						// return updated data
						Object.entries(teacher.courses).forEach(entry => {
							let value = entry[1];
						
							if (value.course === course) {
								scheduleInfo = {
									course: value.course,
									fullCourseName: value.fullCourseName,
									schedule: value.schedule
								};
							}
						});
					
						res.status(200).send({
							message: message,
							schedule: scheduleInfo
						})
					});
				  } catch(err) {
					// file removal error
				  	console.error("File removal error: " + err);
					let message = "Internal Server Error"
					res.status(505).send({
						message: message
					})
				  }
			}).catch((err) => {
				// write stream catch error 
				console.log("write stream catch error" + err);
				let message = "Internal Server Error"
				res.status(505).send({
					message: message
				})
			});
		}).catch((err) => {
			// error while moving uploaded file to temp folder 
			console.log("renamed file catch error: " + err);
			let message = "Internal Server Error"
			res.status(505).send({
				message: message
			})
		});
    	
	});

}

exports.updateSchedule = function(req, res, next) {

	var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
		/*
    	for (const file of Object.entries(files)) {
    	  console.log(file)
    	}
		*/
		// remove old Schedule 
		var gfs = Grid(conn.db);
		let oldScheduleFileID = fields.scheduleFileID;
		
    	gfs.remove({_id: oldScheduleFileID}, (err, file) => {
    	    if (err || !file) {
				// res.status(404).send('File Not Found');
				console.log("file does not exist");
				/*
				let message = "Could not remove old syllabus file to update"
				res.status(505).send({
					message: message
				})
				*/
			}
		});

		// add new Schedule 
		var filename = files.uploadFile.name;
		let course = fields.course;
		// create a timestamp for when it was uploaded
		let uploadDate = new Date().toLocaleDateString(); 
		var filename = files.uploadFile.name;
		var oldPath = files.uploadFile.path;
		var newPath = path.join(__dirname, '../temp/' + filename);
		// move the file to the temp folder 
		moveUploadedFileToTempFolder(oldPath, newPath).then((filePath) => {
			// we know the file exist in the new path 
			// from that path, make a write stream to upload
			// the file to the database
			writeFileToDatabase(filePath, filename).then((fileID) => {
				console.log("write stream finished. Remove file from temp folder");
				// try to remove the file that was uploaded to the system 
				// we only want it stored in the database
				try {
					
					fs.unlinkSync(filePath);
					console.log("file removed from temp directory");
					// we now add the data
					mongodb.addSchedule(course, fileID, filename, uploadDate).then(function(teacher) {
						// send ok status
						let message = "Schedule was successfully updated!"
						var scheduleInfo
						// return updated data
						Object.entries(teacher.courses).forEach(entry => {
							let value = entry[1];
						
							if (value.course === course) {
								scheduleInfo = {
									course: value.course,
									fullCourseName: value.fullCourseName,
									schedule: value.schedule
								};
							}
						});
					
						res.status(200).send({
							message: message,
							schedule: scheduleInfo
						})
					});
				  } catch(err) {
					// file removal error
				  	console.error("File removal error: " + err);
					let message = "Internal Server Error"
					res.send(505).send({
					  message: message
					})
				  }
			}).catch((err) => {
				// write stream catch error 
				console.log("write stream catch error" + err);
				let message = "Internal Server Error"
				res.send(505).send({
					message: message
				})
			});
		}).catch((err) => {
			// error while moving uploaded file to temp folder 
			console.log("renamed file catch error: " + err);
			let message = "Internal Server Error"
			res.send(505).send({
				message: message
			})
		});
    	
	});

}

exports.addAssignment = function(req, res, next) {

	var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
		// check if all requirements exist 
		
		var filename = files.uploadFile.name;
		let course = fields.course;
		let assignmentName = fields.name;
		let dueDate = fields.date;
		var filename = files.uploadFile.name;
		var oldPath = files.uploadFile.path;
		var newPath = path.join(__dirname, '../temp/' + filename);
		// move the file to the temp folder 
		moveUploadedFileToTempFolder(oldPath, newPath).then((filePath) => {
			// we know the file exist in the new path 
			// from that path, make a write stream to upload
			// the file to the database
			writeFileToDatabase(filePath, filename).then((fileID) => {
				console.log("write stream finished. Remove file from temp folder");
				// try to remove the file that was uploaded to the system 
				// we only want it stored in the database
				try {
					
					fs.unlinkSync(filePath);
					console.log("file removed from temp directory");
					// we now add the data 
					mongodb.addAssignment(course, fileID, assignmentName, filename, dueDate).then(function(teacher) {
						// send ok status
						let message = "Assignment was successfully created!"
						var assignmentInfo
						// return updated data
						Object.entries(teacher.courses).forEach(entry => {
							let value = entry[1];
						
							if (value.course === course) {
								assignmentInfo = {
									course: value.course,
									fullCourseName: value.fullCourseName,
									assignments: value.assignments
								};
							}
						});
					
						res.status(200).send({
							message: message,
							assignments: assignmentInfo
						})
					});
				  } catch(err) {
					// file removal error
					console.error("File removal error: " + err);
					  
				  	let message = "Internal Server Error";
					res.status(505).send({
						message: message
					});
				  }
			}).catch((err) => {
				// write stream catch error 
				console.log("write stream catch error" + err);
				let message = "Internal Server Error";
				res.status(505).send({
					message: message
				});
			});
		}).catch((err) => {
			// error while moving uploaded file to temp folder 
			console.log("renamed file catch error: " + err);
			
			let message = "Internal Server Error";
			res.status(505).send({
				message: message
			});
		});
    	
	});

}

exports.removeAssignment = function(req, res, next) {

	let course = req.body.course;

	let assignmentID = req.body.assignmentID;
	let assignmentFileID = req.body.assignmentFileID;
	var gfs = Grid(conn.db);
	
    gfs.remove({_id: assignmentFileID}, (err, file) => {
        if (err || !file) {
			// res.status(404).send('File Not Found');
			console.log("file does not exist");
			
		}
	})

	mongodb.removeAssignment(course, assignmentID).then(function(teacher) {

		let message = "Assignment was removed successfully!"

		var assignmentInfo
		// return updated data
		Object.entries(teacher.courses).forEach(entry => {
			let value = entry[1];
	
			if (value.course === course) {
				assignmentInfo = {
					course: value.course,
					fullCourseName: value.fullCourseName,
					assignments: value.assignments
				};
			}
		});

		res.status(200).send({
			message: message,
			assignments: assignmentInfo
		})

	}).catch(function (error) {
		console.log("error: " + error)

		let message = "An error occured while removing the assignment."
				
		res.status(500).send({
			message: message
		})
	});	
	
}

exports.addLectureNote = function(req, res, next) {

	var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
		/*
    	for (const file of Object.entries(files)) {
    	  console.log(file)
    	}
		*/
		var filename = files.uploadFile.name;
		let course = fields.course;

		let lectureNoteName = fields.name;
		let lectureDate = fields.date;
		var filename = files.uploadFile.name;
		var oldPath = files.uploadFile.path;
		var newPath = path.join(__dirname, '../temp/' + filename);

		// move the file to the temp folder 
		moveUploadedFileToTempFolder(oldPath, newPath).then((filePath) => {
			// we know the file exist in the new path 
			// from that path, make a write stream to upload
			// the file to the database
			writeFileToDatabase(filePath, filename).then((fileID) => {
				console.log("write stream finished. Remove file from temp folder");
				// try to remove the file that was uploaded to the system 
				// we only want it stored in the database
				try {
					
					fs.unlinkSync(filePath);
					console.log("file removed from temp directory");
					// we now add the data 
					mongodb.addLectureNote(course, fileID, lectureNoteName, filename, lectureDate).then(function(teacher) {

						let message = "Lecture note was successfully created!"

						var lectureNotesInfo
						// return updated data
						Object.entries(teacher.courses).forEach(entry => {
							let value = entry[1];
						
							if (value.course === course) {
								lectureNotesInfo = {
									course: value.course,
									fullCourseName: value.fullCourseName,
									lectureNotes: value.lectureNotes
								};
							}
						});
					
						res.status(200).send({
							message: message,
							lectureNotes: lectureNotesInfo
						})
					});
				  } catch(err) {
					// file removal error
				  	console.error("File removal error: " + err);
				  	let message = "Internal Server Error";
					res.status(505).send({
						message: message
					});
				  }
			}).catch((err) => {
				// write stream catch error 
				console.log("write stream catch error" + err);
				let message = "Internal Server Error";
				res.status(505).send({
					message: message
				});
			});
		}).catch((err) => {
			// error while moving uploaded file to temp folder 
			console.log("renamed file catch error: " + err);
			let message = "Internal Server Error";
			res.status(505).send({
				message: message
			});
		});
    	
	});

}

exports.removeLectureNote = function(req, res, next) {

	let course = req.body.course;

	let lectureNoteID = req.body.lectureNoteID;
	let lectureNoteFileID = req.body.lectureNoteFileID;
	var gfs = Grid(conn.db);
	
    gfs.remove({_id: lectureNoteFileID}, (err, file) => {
        if (err || !file) {
			// res.status(404).send('File Not Found');
			console.log("file does not exist");
		}
		
	});

	mongodb.removeLectureNote(course, lectureNoteID).then(function(teacher) {
		
		let message = "Lecture note was removed successfully!"

		var lectureNoteInfo
		// return updated data
		Object.entries(teacher.courses).forEach(entry => {
			let value = entry[1];
	
			if (value.course === course) {
				lectureNoteInfo = {
					course: value.course,
					fullCourseName: value.fullCourseName,
					lectureNotes: value.lectureNotes
				};
			}
		});

		res.status(200).send({
			message: message,
			lectureNotes: lectureNoteInfo
		})

		
	}).catch(function (error) {

		console.log("error: " + error)

		let message = "An error occured while removing the lecture note."
				
		res.status(500).send({
			message: message
		})
	});

}

exports.addClassNote = function(req, res, next) {

	var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
		/*
    	for (const file of Object.entries(files)) {
    	  console.log(file)
    	}
		*/
		var filename = files.uploadFile.name;
		let course = fields.course;
		let classNoteName = fields.name;
		let classDate = fields.date;
		var filename = files.uploadFile.name;
		var oldPath = files.uploadFile.path;
		var newPath = path.join(__dirname, '../temp/' + filename);
		// move the file to the temp folder 
		moveUploadedFileToTempFolder(oldPath, newPath).then((filePath) => {
			// we know the file exist in the new path 
			// from that path, make a write stream to upload
			// the file to the database
			writeFileToDatabase(filePath, filename).then((fileID) => {
				console.log("write stream finished. Remove file from temp folder");
				// try to remove the file that was uploaded to the system 
				// we only want it stored in the database
				try {
					
					fs.unlinkSync(filePath);
					console.log("file removed from temp directory");
					// we now add the data
					mongodb.addClassNote(course, fileID, classNoteName, filename, classDate).then(function(teacher) {
						// send ok status
						let message = "Class note was successfully created!"
						var classNoteInfo
						// return updated data
						Object.entries(teacher.courses).forEach(entry => {
							let value = entry[1];
						
							if (value.course === course) {
								classNoteInfo = {
									course: value.course,
									fullCourseName: value.fullCourseName,
									classNotes: value.classNotes
								};
							}
						});
					
						res.status(200).send({
							message: message,
							classNotes: classNoteInfo
						})
					});
				  } catch(err) {
					// file removal error
				  	console.error("File removal error: " + err);
					let message = "Internal Server Error"
					res.status(505).send({
					  message: message
					})
				  }
			}).catch((err) => {
				// write stream catch error 
				console.log("write stream catch error" + err);
				let message = "Internal Server Error"
				res.status(505).send({
					message: message
				})
			});
		}).catch((err) => {
			// error while moving uploaded file to temp folder 
			console.log("renamed file catch error: " + err);
			let message = "Internal Server Error"
			res.status(505).send({
				message: message
			})
		});
	});

}

exports.removeClassNote = function(req, res, next) {

	let course = req.body.course;

	let classNoteID = req.body.classNoteID;
	let classNoteFileID = req.body.classNoteFileID;
	var gfs = Grid(conn.db);
	
    gfs.remove({_id: classNoteFileID}, (err, file) => {
        if (err || !file) {
			// res.status(404).send('File Not Found');
			console.log("file does not exist");
		}
		
	});

	mongodb.removeClassNote(course, classNoteID).then(function(teacher) {

		let message = "Class note was removed successfully!"

		var classNoteInfo
		// return updated data
		Object.entries(teacher.courses).forEach(entry => {
			let value = entry[1];
	
			if (value.course === course) {
				classNoteInfo = {
					course: value.course,
					fullCourseName: value.fullCourseName,
					classNotes: value.classNotes
				};
			}
		});

		res.status(200).send({
			message: message,
			classNotes: classNoteInfo
		})

	}).catch(function(error) {
		console.log("error: " + error)

		let message = "An error occured while removing the class note."
				
		res.status(500).send({
			message: message
		})
	});

}

exports.addOtherNote = function(req, res, next) {

	var form = new formidable.IncomingForm();
	form.parse(req, function (err, fields, files) {

		/*
		for (const file of Object.entries(files)) {
		  console.log(file)
		}
		*/

		var filename = files.uploadFile.name;

		let course = fields.course;

		let otherNoteName = fields.name;

		let otherDate = fields.date;

		var filename = files.uploadFile.name;
		var oldPath = files.uploadFile.path;

		var newPath = path.join(__dirname, '../temp/' + filename);

		// move the file to the temp folder 
		moveUploadedFileToTempFolder(oldPath, newPath).then((filePath) => {

			// we know the file exist in the new path 
			// from that path, make a write stream to upload
			// the file to the database

			writeFileToDatabase(filePath, filename).then((fileID) => {

				console.log("write stream finished. Remove file from temp folder");

				// try to remove the file that was uploaded to the system 
				// we only want it stored in the database
				try {
					
					fs.unlinkSync(filePath);
					console.log("file removed from temp directory");

					// we now add the data
					mongodb.addOtherNote(course, fileID, otherNoteName, filename, otherDate).then(function(teacher) {
						// send ok status
						let message = "Other note was successfully created!"
						var otherNoteInfo
						// return updated data
						Object.entries(teacher.courses).forEach(entry => {
							let value = entry[1];
						
							if (value.course === course) {
								otherNoteInfo = {
									course: value.course,
									fullCourseName: value.fullCourseName,
									otherNotes: value.otherNotes
								};
							}
						});
					
						res.status(200).send({
							message: message,
							otherNotes: otherNoteInfo
						})
					});

				  } catch(err) {

					// file removal error
					console.error("File removal error: " + err);
					let message = "Internal Server Error"
					res.status(505).send({
						message: message
					})

				  }

			}).catch((err) => {

				// write stream catch error 
				console.log("write stream catch error" + err);
				let message = "Internal Server Error"
				res.status(505).send({
					message: message
				})

			});

		}).catch((err) => {

			// error while moving uploaded file to temp folder 
			console.log("renamed file catch error: " + err);
			let message = "Internal Server Error"
			res.status(505).send({
				message: message
			})

		});
		  
	});

}

exports.removeOtherNote = function(req, res, next) {

	let course = req.body.course;

	let otherNoteID = req.body.otherNoteID;
	let otherNoteFileID = req.body.otherNoteFileID;
	var gfs = Grid(conn.db);
	
    gfs.remove({_id: otherNoteFileID}, (err, file) => {
        if (err || !file) {
			// res.status(404).send('File Not Found');
			console.log("file does not exist");
		}
		
	});

	mongodb.removeOtherNote(course, otherNoteID).then(function(teacher) {
		let message = "Other note was removed successfully!"

		var otherNoteInfo
		// return updated data
		Object.entries(teacher.courses).forEach(entry => {
			let value = entry[1];
	
			if (value.course === course) {
				otherNoteInfo = {
					course: value.course,
					fullCourseName: value.fullCourseName,
					otherNotes: value.otherNotes
				};
			}
		});

		res.status(200).send({
			message: message,
			otherNotes: otherNoteInfo
		})
	}).catch(function (error) {
		console.log("error: " + error)

		let message = "An error occured while removing the other note."
				
		res.status(500).send({
			message: message
		})
	});

}


// Promise Functions 

function moveUploadedFileToTempFolder(oldPath, newPath) {

	return new Promise((resolve, reject) => {

		// move file from the default stored path for submitted forms
		// to a path that node.js can access 
		fs.rename(oldPath, newPath, function (err) {
			
			if (err != null) {
				console.log("File rename error: " + err);
				reject(err);
			}

			console.log("File moved to " + newPath);
			resolve(newPath);
		});

	});

}

function writeFileToDatabase(filePath, filename) {

	return new Promise((resolve, reject) => {

		var gfs = Grid(conn.db);

		var writeStream = gfs.createWriteStream({
			filename: filename
		});

		let fileID = writeStream.id;
	
		// call this after full filling promise of renaming 
		fs.createReadStream(filePath).pipe(writeStream);
	
		// write the file to mongoDB using gridFS

		// on 'error' is called when there is a error
		writeStream.on('error', function(err) {
			if (err != null) {
				console.log("Writestream error: " + err);
				reject(err);
			}
		});

		// on finish is when file is finished writing
		writeStream.on('finish', function() {
			console.log("Writestream succcess");
			resolve(fileID);
		});

	});

}