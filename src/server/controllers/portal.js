var mongoose = require('mongoose');
var mongodb = require('../db/mongodb');
const nodeMailer = require('../config/email')

// authorization is checked before 
// calling portal api 

exports.checkUser = function(req, res, next) {
	// passed through authorization check already
	let username = req.user.username;

	res.status(200).send({
		validUsername: username
	})

}

exports.getHome = function (req, res, next) {

    let teacher = req.user

    var teacherUser = {
        username: teacher.username,
        email: teacher.email,
        confirmedEmail: teacher.confirmedEmail,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        semester: teacher.semester,
        year: teacher.year,
        courses: teacher.courses
    }
    res.status(200).send({
        teacher: teacherUser
    });

}

// course 

exports.getCourse = function(req, res, next) {

    let url = decodeURI(req.originalUrl)

    let teacher = req.user

    let searchedCourse = url.substring();

    let courseSlash = searchedCourse.search('/course/');

    searchedCourse = searchedCourse.substring(courseSlash + 8, searchedCourse.length);

    var courseInfo

    // teachers is a javascript Object
    Object.entries(teacher.courses).forEach(entry => {
        let value = entry[1];

        if (value.course === searchedCourse) {
            courseInfo = {
                course: value.course,
                fullCourseName: value.fullCourseName,
                syllabus: value.syllabus,
                schedule: value.schedule
            };
        }

    })
    
    res.status(200).send({
        username: teacher.username,
        course: courseInfo
    });
}

exports.getSyllabus = function (req, res, next) {

    let url = decodeURI(req.originalUrl)

    var searchedCourse = urlFilterCourse(url)

    let teacher = req.user

    var syllabusInfo 

    // teachers is a javascript Object
    Object.entries(teacher.courses).forEach(entry => {
        let value = entry[1];

        if (value.course === searchedCourse) {
            syllabusInfo = {
                course: value.course,
                fullCourseName: value.fullCourseName,
                syllabus: value.syllabus
            };
        }
    });

    res.status(200).send({
        username: teacher.username,
        syllabus: syllabusInfo
    });

}

exports.getSchedule = function (req, res, next) {

    let url = decodeURI(req.originalUrl)

    var searchedCourse = urlFilterCourse(url)

    let teacher = req.user

    var scheduleInfo 

    // teachers is a javascript Object
    Object.entries(teacher.courses).forEach(entry => {
        let value = entry[1];

        if (value.course === searchedCourse) {
            scheduleInfo = {
                course: value.course,
                fullCourseName: value.fullCourseName,
                schedule: value.schedule
            };
        }
    });

    res.status(200).send({
        username: teacher.username,
        schedule: scheduleInfo
    });

}

exports.getAssignments = function (req, res, next) {

    let url = decodeURI(req.originalUrl)

    var searchedCourse = urlFilterCourse(url)

    let teacher = req.user

    var assignmentInfo 

    // teachers is a javascript Object
    Object.entries(teacher.courses).forEach(entry => {
        let value = entry[1];

        if (value.course === searchedCourse) {
            assignmentInfo = {
                course: value.course,
                fullCourseName: value.fullCourseName,
                assignments: value.assignments
            };
        }
    });

    res.status(200).send({
        username: teacher.username,
        assignments: assignmentInfo
    });

}

exports.getLectureNotes = function (req, res, next) {

    let url = decodeURI(req.originalUrl)

    var searchedCourse = urlFilterCourse(url)

    let teacher = req.user

    var lectureNotesInfo 

    // teachers is a javascript Object
    Object.entries(teacher.courses).forEach(entry => {
        let value = entry[1];

        if (value.course === searchedCourse) {
            lectureNotesInfo = {
                course: value.course,
                fullCourseName: value.fullCourseName,
                lectureNotes: value.lectureNotes
            };
        }
    });

    res.status(200).send({
        username: teacher.username,
        lectureNotes: lectureNotesInfo
    });

}

exports.getClassNotes = function (req, res, next) {

    let url = decodeURI(req.originalUrl)

    var searchedCourse = urlFilterCourse(url)

    let teacher = req.user

    var classNotesInfo 

    // teachers is a javascript Object
    Object.entries(teacher.courses).forEach(entry => {
        let value = entry[1];

        if (value.course === searchedCourse) {
            classNotesInfo = {
                course: value.course,
                fullCourseName: value.fullCourseName,
                classNotes: value.classNotes
            };
        }
    });

    res.status(200).send({
        username: teacher.username,
        classNotes: classNotesInfo
    });

}

exports.getOtherNotes = function (req, res, next) {

    let url = decodeURI(req.originalUrl)

    var searchedCourse = urlFilterCourse(url)

    let teacher = req.user

    var otherNotesInfo 

    // teachers is a javascript Object
    Object.entries(teacher.courses).forEach(entry => {
        let value = entry[1];

        if (value.course === searchedCourse) {
            otherNotesInfo = {
                course: value.course,
                fullCourseName: value.fullCourseName,
                otherNotes: value.otherNotes
            };
        }
    });

    res.status(200).send({
        username: teacher.username,
        otherNotes: otherNotesInfo
    });

}

// archived courses
// check for _id

exports.getArchivedCourse = function(req, res, next) {

    let url = decodeURI(req.originalUrl)

    let teacher = req.user

    let searchedCourse = url.substring();

    let courseSlash = searchedCourse.search('/archivedCourse/');

    searchedCourse = new mongoose.Types.ObjectId(searchedCourse.substring(courseSlash + 16, searchedCourse.length));

    var courseInfo

    // teachers is a javascript Object
    Object.entries(teacher.archivedCourses).forEach(entry => {
        let value = entry[1];

        if (value._id.equals(searchedCourse)) {
            courseInfo = {
                course: value.course,
                fullCourseName: value.fullCourseName,
                semester: value.semester,
                year: value.year,
                syllabus: value.syllabus,
                schedule: value.schedule
            };
        }

    })
    
    res.status(200).send({
        username: teacher.username,
        archivedCourse: courseInfo
    });
}

exports.getArchivedSyllabus = function (req, res, next) {

    let url = decodeURI(req.originalUrl)

    var searchedCourse = new mongoose.Types.ObjectId(urlFilterArchivedCourse(url))

    let teacher = req.user

    var syllabusInfo 

    // teachers is a javascript Object
    Object.entries(teacher.archivedCourses).forEach(entry => {
        let value = entry[1];

        if (value._id.equals(searchedCourse)) {
            syllabusInfo = {
                course: value.course,
                fullCourseName: value.fullCourseName,
                semester: value.semester,
                year: value.year,
                syllabus: value.syllabus
            };
        }
    });

    res.status(200).send({
        username: teacher.username,
        archivedSyllabus: syllabusInfo
    });

}

exports.getArchivedSchedule = function (req, res, next) {

    let url = decodeURI(req.originalUrl)

    var searchedCourse = new mongoose.Types.ObjectId(urlFilterArchivedCourse(url))

    let teacher = req.user

    var scheduleInfo 

    // teachers is a javascript Object
    Object.entries(teacher.archivedCourses).forEach(entry => {
        let value = entry[1];

        if (value._id.equals(searchedCourse)) {
            scheduleInfo = {
                course: value.course,
                fullCourseName: value.fullCourseName,
                semester: value.semester,
                year: value.year,
                schedule: value.schedule
            };
        }
    });

    res.status(200).send({
        username: teacher.username,
        archivedSchedule: scheduleInfo
    });

}

exports.getArchivedAssignments = function (req, res, next) {

    let url = decodeURI(req.originalUrl)

    var searchedCourse = new mongoose.Types.ObjectId(urlFilterArchivedCourse(url))

    let teacher = req.user

    var assignmentInfo 

    // teachers is a javascript Object
    Object.entries(teacher.archivedCourses).forEach(entry => {
        let value = entry[1];

        if (value._id.equals(searchedCourse)) {
            assignmentInfo = {
                course: value.course,
                fullCourseName: value.fullCourseName,
                semester: value.semester,
                year: value.year,
                assignments: value.assignments
            };
        }
    });

    res.status(200).send({
        username: teacher.username,
        archivedAssignments: assignmentInfo
    });

}

exports.getArchivedLectureNotes = function (req, res, next) {

    let url = decodeURI(req.originalUrl)

    var searchedCourse = new mongoose.Types.ObjectId(urlFilterArchivedCourse(url))

    let teacher = req.user

    var lectureNotesInfo 

    // teachers is a javascript Object
    Object.entries(teacher.archivedCourses).forEach(entry => {
        let value = entry[1];

        if (value._id.equals(searchedCourse)) {
            lectureNotesInfo = {
                course: value.course,
                fullCourseName: value.fullCourseName,
                semester: value.semester,
                year: value.year,
                lectureNotes: value.lectureNotes
            };
        }
    });

    res.status(200).send({
        username: teacher.username,
        archivedLectureNotes: lectureNotesInfo
    });

}

exports.getArchivedClassNotes = function (req, res, next) {

    let url = decodeURI(req.originalUrl)

    var searchedCourse = new mongoose.Types.ObjectId(urlFilterArchivedCourse(url))

    let teacher = req.user

    var classNotesInfo 

    // teachers is a javascript Object
    Object.entries(teacher.archivedCourses).forEach(entry => {
        let value = entry[1];

        if (value._id.equals(searchedCourse)) {
            classNotesInfo = {
                course: value.course,
                fullCourseName: value.fullCourseName,
                semester: value.semester,
                year: value.year,
                classNotes: value.classNotes
            };
        }
    });

    res.status(200).send({
        username: teacher.username,
        archivedClassNotes: classNotesInfo
    });

}

exports.getArchivedOtherNotes = function (req, res, next) {

    let url = decodeURI(req.originalUrl)

    var searchedCourse = new mongoose.Types.ObjectId(urlFilterArchivedCourse(url))

    let teacher = req.user

    var otherNotesInfo 

    // teachers is a javascript Object
    Object.entries(teacher.archivedCourses).forEach(entry => {
        let value = entry[1];

        if (value._id.equals(searchedCourse)) {
            otherNotesInfo = {
                course: value.course,
                fullCourseName: value.fullCourseName,
                semester: value.semester,
                year: value.year,
                otherNotes: value.otherNotes
            };
        }
    });

    res.status(200).send({
        username: teacher.username,
        archivedOtherNotes: otherNotesInfo
    });

}

exports.resendEmailVerification = function(req, res, next) {

    let user = req.user

    let username = user.username

    let email = user.email

    let token = user.emailToken

    let transporter = nodeMailer.transporter()

    let mailOptions = nodeMailer.emailTemplateConfirmEmail(username, email, token)

    transporter.sendMail(mailOptions).then(function(info) {

        let emailMessage = "Email verification link has been sent to " + email + "!"
        
        res.status(200).send({
            emailMessage: emailMessage
        })

    }).catch(function(error) {

        let emailMessage = "There was an error in sending email to " + email

        res.status(500).send({
            emailMessage: emailMessage
        })

    })

}

function urlFilterCourse(url) {
    
    // /course/ - 8
    var searchedCourse = url.substring();

    let courseSlash = searchedCourse.search('/course/');

    searchedCourse = searchedCourse.substring(courseSlash + 8, searchedCourse.length);

    var tempSlash = searchedCourse.search('/');

    searchedCourse = searchedCourse.substring(0, tempSlash);

    return searchedCourse;
}

function urlFilterArchivedCourse(url) {
    
    // /archivedCourse/ - 16
    var searchedCourse = url.substring();

    let courseSlash = searchedCourse.search('/archivedCourse/');

    searchedCourse = searchedCourse.substring(courseSlash + 16, searchedCourse.length);

    var tempSlash = searchedCourse.search('/');

    searchedCourse = searchedCourse.substring(0, tempSlash);

    return searchedCourse;
}