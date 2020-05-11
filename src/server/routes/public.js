var express = require('express');
var router = express.Router();

let teacher = require('../controllers/public');

let files = require('../controllers/files');

// public urls 
router.get('/:teacherUsername', teacher.getHome);
router.get('/:teacherUsername/course/:course', teacher.getCourse);
router.get('/:teacherUsername/course/:course/assignments', teacher.getAssignments);
router.get('/:teacherUsername/course/:course/lectureNotes', teacher.getLectureNotes);
router.get('/:teacherUsername/course/:course/classNotes', teacher.getClassNotes);
router.get('/:teacherUsername/course/:course/otherNotes', teacher.getOtherNotes);

// public file retrieval 
router.get('/:teacherUsername/course/:course/syllabus/id/:id/files/:filename', files.getFile);
router.get('/:teacherUsername/course/:course/schedule/id/:id/files/:filename', files.getFile);
router.get('/:teacherUsername/course/:course/assignments/id/:id/files/:filename', files.getFile);
router.get('/:teacherUsername/course/:course/lectureNotes/id/:id/files/:filename', files.getFile);
router.get('/:teacherUsername/course/:course/classNotes/id/:id/files/:filename', files.getFile);
router.get('/:teacherUsername/course/:course/otherNotes/id/:id/files/:filename', files.getFile);

module.exports = router;
