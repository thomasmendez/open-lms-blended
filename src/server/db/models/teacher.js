var mongoose = require('mongoose');

let Schema = mongoose.Schema;

const teachersSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    emailToken: { type: String, required: false },
    confirmedEmail: {type: Boolean, required: false },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    semester: { type: String, required: true },
    year: { type: String, required: true },
    courses: [{
        course: String,
        fullCourseName: String,
        semester: String,
        year: String,
        syllabus: {
            syllabusFile: String,
            fileID: String,
            uploadDate: String,
        },
        schedule: {
            scheduleFile: String,
            fileID: String,
            uploadDate: String
        },
        assignments: [{
            assignmentName: String,
            assignmentFile: String,
            fileID: String,
            dueDate: String,
        }],
        lectureNotes: [{
            noteName: String,
            noteFile: String,
            fileID: String,
            noteDate: String,
        }],
        classNotes: [{
            noteName: String,
            noteFile: String,
            fileID: String,
            noteDate: String,
        }],
        otherNotes: [{
            noteName: String,
            noteFile: String,
            fileID: String,
            noteDate: String,
        }]
    }],

    archivedCourses: [{
        course: String,
        fullCourseName: String,
        semester: String,
        year: String,
        syllabus: {
            syllabusFile: String,
            fileID: String,
            uploadDate: String,
        },
        schedule: {
            scheduleFile: String,
            fileID: String,
            uploadDate: String
        },
        assignments: [{
            assignmentName: String,
            assignmentFile: String,
            fileID: String,
            dueDate: String,
        }],
        lectureNotes: [{
            noteName: String,
            noteFile: String,
            fileID: String,
            noteDate: String,
        }],
        classNotes: [{
            noteName: String,
            noteFile: String,
            fileID: String,
            noteDate: String,
        }],
        otherNotes: [{
            noteName: String,
            noteFile: String,
            fileID: String,
            noteDate: String,
        }]
    }],
    
    resetPassword: {
        token: String,
        expirationDate: Date
    }
});

exports.model = mongoose.model('teacher', teachersSchema);

exports.schema = teachersSchema;