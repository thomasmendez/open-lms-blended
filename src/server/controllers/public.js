var mongodb = require('../db/mongodb');

exports.getHome = function (req, res, next) {

    let url = req.originalUrl;

    // /teacher - 9
    let teacherUsername = url.substring(9, url.length);

    // call database query, search for classes that the teacher teaches
    
    mongodb.findTeacherByUsername(teacherUsername).then(function (teacher) {

        teacherInfo = {
            firstName: teacher.firstName,
            lastName: teacher.lastName,
            semester: teacher.semester,
            year: teacher.year,
            courses: teacher.courses
        };

        res.status(200).send(teacherInfo)

    }).catch(function (error) {
        res.status(404).send({
            error: {
                message: "404 Not Found"
            }
        });
    });

}


exports.getCourse = function(req, res, next) {

    let url = decodeURI(req.originalUrl);

    // /course/ - 8
    let searchedCourse = url.substring();

    let courseSlash = searchedCourse.search('/course/');

    searchedCourse = searchedCourse.substring(courseSlash + 8, searchedCourse.length);

    // call database query teacher and class 
    // call database query, search for classes that the teacher teaches

    mongodb.findCourse(searchedCourse).then(function (teacher) {

        var courseInfo = {};

        // teachers is a javascript Object
        Object.entries(teacher.courses).forEach(entry => {
            //let key = entry[0];
            let value = entry[1];
            //use key and value here
            //console.log("key: " + key);
            //console.log("value: " + value);

            if (value.course === searchedCourse) {
                courseInfo = {
                    course: value.course,
                    fullCourseName: value.fullCourseName,
                    syllabus: value.syllabus,
                    schedule: value.schedule
                };
                
            }

        });

        res.status(200).send(courseInfo)

    }).catch(function (error) {
        res.status(404).send({
            error: {
                message: "404 Not Found"
            }
        });
    });

}

exports.getAssignments = function (req, res, next) {

    let url = decodeURI(req.originalUrl);

    let teacherUsername = urlFilterUsername(url);

    let searchedCourse = urlFilterCourse(url);

    var assignmentInfo;

    mongodb.findTeacherByUsername(teacherUsername).then(function (teacher) {
        // teachers is a javascript Object
        Object.entries(teacher.courses).forEach(entry => {
            //let key = entry[0];
            let value = entry[1];
            //use key and value here
            //console.log("key: " + key);
            //console.log("value: " + value);
            if (value.course === searchedCourse) {
                assignmentInfo = {
                    course: value.course,
                    fullCourseName: value.fullCourseName,
                    assignments: value.assignments
                };
            }
        });

        res.status(200).send(assignmentInfo)

    }).catch(function (error) {
        res.status(404).send({
            error: {
                message: "404 Not Found"
            }
        });
    });
}


exports.getLectureNotes = function (req, res, next) {

    let url = decodeURI(req.originalUrl);

    let teacherUsername = urlFilterUsername(url);

    let searchedCourse = urlFilterCourse(url);
    
    var lectureNotesInfo;

    mongodb.findTeacherByUsername(teacherUsername).then(function (teacher) {
        // teachers is a javascript Object
        Object.entries(teacher.courses).forEach(entry => {
            //let key = entry[0];
            let value = entry[1];
            //use key and value here
            //console.log("key: " + key);
            //console.log("value: " + value);
            if (value.course === searchedCourse) {
                lectureNotesInfo = {
                    course: value.course,
                    fullCourseName: value.fullCourseName,
                    lectureNotes: value.lectureNotes
                };
            }
        });
        
        res.status(200).send(lectureNotesInfo)

    }).catch(function (error) {
        res.status(404).send({
            error: {
                message: "404 Not Found"
            }
        });
    });
}


exports.getClassNotes = function (req, res, next) {

    let url = decodeURI(req.originalUrl);

    let teacherUsername = urlFilterUsername(url);

    let searchedCourse = urlFilterCourse(url);

    var classNotesInfo;

    mongodb.findTeacherByUsername(teacherUsername).then(function (teacher) {
        // teachers is a javascript Object
        Object.entries(teacher.courses).forEach(entry => {
            //let key = entry[0];
            let value = entry[1];
            //use key and value here
            //console.log("key: " + key);
            //console.log("value: " + value);
            if (value.course === searchedCourse) {
                classNotesInfo = {
                    course: value.course,
                    fullCourseName: value.fullCourseName,
                    classNotes: value.classNotes
                };
            }
        });
        
        res.status(200).send(classNotesInfo)

    }).catch(function (error) {
        res.status(404).send({
            error: {
                message: "404 Not Found"
            }
        });
    });

}

exports.getOtherNotes = function (req, res, next) {

    let url = decodeURI(req.originalUrl);

    let teacherUsername = urlFilterUsername(url);

    let searchedCourse = urlFilterCourse(url);
    
    var otherNotesInfo;

    mongodb.findTeacherByUsername(teacherUsername).then(function (teacher) {
        // teachers is a javascript Object
        Object.entries(teacher.courses).forEach(entry => {
            //let key = entry[0];
            let value = entry[1];
            //use key and value here
            //console.log("key: " + key);
            //console.log("value: " + value);
            if (value.course === searchedCourse) {
                otherNotesInfo = {
                    course: value.course,
                    fullCourseName: value.fullCourseName,
                    otherNotes: value.otherNotes
                };
            }
        });
        
        res.status(200).send(otherNotesInfo)

    }).catch(function (error) {
        res.status(404).send({
            error: {
                message: "404 Not Found"
            }
        });
    });

}

function urlFilterUsername(url) {
    
    // /teacher/ - 9
    var searchedUsername = url.substring();

    let teacherSlash = searchedUsername.search('/teacher/');

    searchedUsername = searchedUsername.substring(teacherSlash + 9, searchedUsername.length);

    var tempSlash = searchedUsername.search('/');

    searchedUsername = searchedUsername.substring(0, tempSlash);

    return searchedUsername;
}

function urlFilterCourse(url) {
    
    // /course/ - 8
    let searchedCourse = url.substring();

    let courseSlash = searchedCourse.search('/course/');

    searchedCourse = searchedCourse.substring(courseSlash + 8, searchedCourse.length);

    var tempSlash = searchedCourse.search('/');

    searchedCourse = searchedCourse.substring(0, tempSlash);

    return searchedCourse;
}