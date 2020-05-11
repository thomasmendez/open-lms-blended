var mongoose = require('mongoose');

// import models that will be used
// all models will need their schema to make a query search
const Teacher = require('./models/teacher');
const NewUser = require('./models/newUser')

const moment = require('moment')

// returns all teacher info
exports.findTeacherById = function(_id) {
    return mongoose.model('teachers', Teacher.schema).findById(_id).then(function(items) {
        return items;
    });
}

exports.findTeacherByUsername = function(username) {
    return mongoose.model('teachers', Teacher.schema).findOne({username: username}).then(function(items) {
        return items;
    }).catch(function (error) {
        return error;
    });
}

exports.findTeacherByEmail = function(email) {
    return mongoose.model('teachers', Teacher.schema).findOne({email: email}).then(function(items){
        return items;
    }).catch(function(error) {
        return error;
    })
}

exports.confirmEmail = function(username, emailToken) {
    return mongoose.model('teachers', Teacher.schema).findOneAndUpdate(
        {"username": username, "emailToken": emailToken, "confirmedEmail": false},
        {$set: {"confirmedEmail": true}},
        {new: true, useFindAndModify: false}
    ).then(function(items){
        return items
    }).catch(function(error) {
        return error
    })
}

exports.resetPasswordTokenCheck = function(token) {
    return mongoose.model('teachers', Teacher.schema).findOne({token: token}).then(function(items){
        return items;
    }).catch(function(error) {
        return error;
    }) 
}

exports.setResetPasswordToken = function(email, token) {
    let expirationDate = moment(new Date()).add(15, 'm').toDate();
    return mongoose.model('teachers', Teacher.schema).findOneAndUpdate(
        {"email": email},
        {$set: {"resetPassword": {
                    token: token,
                    expirationDate: expirationDate
                }
            }
        },
        {new: true, useFindAndModify: false}
        //callback)
    ).then(function (items) {
        return items;
    }).catch(function(error) {
        return error
    });
}

exports.findCourse = function(course) {
    return mongoose.model('teachers', Teacher.schema).findOne(
        {"courses.course": course}
    ).then(function (items) {
        return items;
    }).catch(function (error) {
        return error;
    });
}

exports.addCourse = function(username, course, fullCourseName, semester, year) {

    let query = {username: username};

    return mongoose.model('teachers', Teacher.schema).findOneAndUpdate(
        query, 
        {$push: { courses: 
            [
                {
                    course: course, 
                    fullCourseName: fullCourseName,
                    semester: semester,
                    year: year
                }
            ] 
        }}, 
        {new: true, useFindAndModify: false},
        //callback)
    ).then(function (items) {
        return items;
    }).catch(function(error) {
        return error
    });

}

exports.addSyllabus = function(course, syllabusFileID, filename, uploadDate) {

    return mongoose.model('teachers', Teacher.schema).findOneAndUpdate(
        {"courses.course": course},
        {"courses.$.syllabus": 
            {
                syllabusFile: filename,
                fileID: syllabusFileID,
                uploadDate: uploadDate
            }
        }, 
        {new: true, useFindAndModify: false}
    ).then(function (items) {
        return items;
    }).catch(function (error) {
        return error;
    });
}

exports.addSchedule = function(course, scheduleFileID, filename, uploadDate) {

    return mongoose.model('teachers', Teacher.schema).findOneAndUpdate(
        {"courses.course": course},
        {"courses.$.schedule": 
            {
                scheduleFile: filename,
                fileID: scheduleFileID,
                uploadDate: uploadDate
            }
        }, 
        {new: true, useFindAndModify: false}
    ).then(function (items) {
        return items;
    }).catch(function (error) {
        return error;
    });
}

exports.addAssignment = function(course, assignmentFileID, assignmentName, filename, dueDate) {

    return mongoose.model('teachers', Teacher.schema).findOneAndUpdate(
        {"courses.course": course},
        {$push: {"courses.$.assignments": 
                            [
                                {assignmentName: assignmentName,
                                fileID: assignmentFileID,
                                assignmentFile: filename,
                                dueDate: dueDate}
                            ]
                }
        }, 
        {new: true, useFindAndModify: false},
        //callback)
    ).then(function (items) {
        return items;
    }).catch(function (error) {
        return error;
    });
    
}

exports.removeAssignment = function(course, assignmentID) {

    return mongoose.model('teachers', Teacher.schema).findOneAndUpdate(
        {"courses.course": course},
        {$pull: {"courses.$.assignments": {'_id': assignmentID} }}, 
        {new: true, useFindAndModify: false}
    ).then(function (items) {
        return items;
    }).catch(function (error) {
        return error;
    });
}

exports.addLectureNote = function(course, lectureNoteFileID, lectureNoteName, filename, noteDate) {

    return mongoose.model('teachers', Teacher.schema).findOneAndUpdate(
        {"courses.course": course},
        {$push: {"courses.$.lectureNotes": 
                            [
                                {noteName: lectureNoteName,
                                fileID: lectureNoteFileID,
                                noteFile: filename,
                                noteDate: noteDate}
                            ]
                }
        }, 
        {new: true, useFindAndModify: false}
    ).then(function (items) {
        return items;
    }).catch(function (error) {
        return error;
    });
    
}

exports.removeLectureNote = function(course, lectureNoteID) {

    return mongoose.model('teachers', Teacher.schema).findOneAndUpdate(
        {"courses.course": course},
        {$pull: {"courses.$.lectureNotes": {'_id': lectureNoteID} }},
        {new: true, useFindAndModify: false}
    ).then(function (items) {
        return items;
    }).catch(function (error) {
        return error;
    });
}

exports.addClassNote = function(course, classNoteFileID, classNoteName, filename, noteDate) {

    return mongoose.model('teachers', Teacher.schema).findOneAndUpdate(
        {"courses.course": course},
        {$push: {"courses.$.classNotes": 
                            [
                                {noteName: classNoteName,
                                fileID: classNoteFileID,
                                noteFile: filename,
                                noteDate: noteDate}
                            ]
                }
        }, 
        {new: true, useFindAndModify: false}
    ).then(function (items) {
        return items;
    }).catch(function (error) {
        return error;
    });
    
}

exports.removeClassNote = function(course, classNoteID) {

    return mongoose.model('teachers', Teacher.schema).findOneAndUpdate(
        {"courses.course": course},
        {$pull: {"courses.$.classNotes": {'_id': classNoteID} }},
        {new: true, useFindAndModify: false}
    ).then(function (items) {
        return items;
    }).catch(function (error) {
        return error;
    });

}

exports.addOtherNote = function(course, otherNoteFileID, otherNoteName, filename, noteDate) {

    return mongoose.model('teachers', Teacher.schema).findOneAndUpdate(
        {"courses.course": course},
        {$push: {"courses.$.otherNotes": 
                            [
                                {noteName: otherNoteName,
                                fileID: otherNoteFileID,
                                noteFile: filename,
                                noteDate: noteDate}
                            ]
                }
        }, 
        {new: true, useFindAndModify: false}
    ).then(function (items) {
        return items;
    }).catch(function (error) {
        return error;
    });
    
}

exports.removeOtherNote = function(course, otherNoteID) {

    return mongoose.model('teachers', Teacher.schema).findOneAndUpdate(
        {"courses.course": course},
        {$pull: {"courses.$.otherNotes": {'_id': otherNoteID} }}, 
        {new: true, useFindAndModify: false}
    ).then(function (items) {
        return items;
    }).catch(function (error) {
        return error;
    });

}

// updates settings information 

exports.updateEmail = function(username, newEmail, newEmailToken) {
    let query = {username: username};
    return mongoose.model('teachers', Teacher.schema).findOneAndUpdate(
        query,
        {$set: {
                email: newEmail,
                emailToken: newEmailToken,
                confirmedEmail: false
            } 
        }, 
        {new: true, useFindAndModify: false}
    ).then(function (items) {
        return items;
    }).catch(function (error) {
        return error;
    });
}

exports.updateSemester = function(username, semester, year) {
    let query = {username: username};
    return mongoose.model('teachers', Teacher.schema).findOneAndUpdate(
        query,
        {$set: 
            {
                semester: semester,
                year: year
            }
        }, 
        {new: true, useFindAndModify: false}
    ).then(function (items) {
        return items;
    }).catch(function (error) {
        return error;
    });
}

exports.updatePassword = function(username, newHashedPassword) {
    let query = {username: username};
    return mongoose.model('teachers', Teacher.schema).findOneAndUpdate(
        query,
        {$set: 
            {
                password: newHashedPassword
            }
        }, 
        {new: true, useFindAndModify: false}
    ).then(function (items) {
        return items;
    }).catch(function (error) {
        return error;
    });
}

exports.updatePasswordRemoveToken = function(username, newHashedPassword) {
    let query = {username: username};
    return mongoose.model('teachers', Teacher.schema).findOneAndUpdate(
        query,
        {
            $set: {
                password: newHashedPassword
            }, 
            $unset: {
                resetPassword: "",
                expirationDate: ""
            }
        },
        {new: true, useFindAndModify: false}
    ).then(function (items) {
        return items;
    }).catch(function (error) {
        return error;
    });
}

exports.deleteUser = function(password) {
    let query = {password: password};
    return mongoose.model('teachers', Teacher.schema).findOneAndDelete(
        query
    ).then(function (items) {
        return items;
    }).catch(function (error) {
        return error;
    });
}

exports.checkUserCode = function(code) {
    let query = {code: code};
    return mongoose.model('newUser', NewUser.schema).findOneAndRemove(
        query
    ).then(function (items) {
        return items;
    }).catch(function (error) {
        return error;
    });
}

exports.moveCourseToArchive = function(course) {

    return mongoose.model('teachers', Teacher.schema).findOneAndUpdate(
        {"courses.course": course.course},
        {
            $push: { "archivedCourses": [ course ]},
            $pull: { "courses": { "course": course.course } },
        }, 
        {new: true, useFindAndModify: false},
        //callback)
    ).then(function (items) {
        return items;
    }).catch(function (error) {
        return error;
    });

}

/*
return mongoose.model('teachers', Teacher.schema).findOneAndUpdate(
        {"courses.course": course.course},
        {
            $push: { "archivedCourses": [ 
                                            {
                                                "course": course.course,
                                                "courseFullName": course.courseFullName,
                                                "semester": course.semester,
                                                "year": course.year,
                                                "syllabus": course.syllabus,
                                                "schedule": course.schedule,
                                                "assignments": course.assignments,
                                                "lectureNotes": course.lectureNotes,
                                                "classNotes": course.classNotes,
                                                "otherNotes": course.otherNotes
                                            } 
                                        ]
                    },
            $pull: { "courses": { "course": course.course } },
        }, 
        {new: true, useFindAndModify: false},
        //callback)
    ).then(function (items) {
        return items;
    }).catch(function (error) {
        return error;
    });
*/