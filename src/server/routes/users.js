var express = require('express');
var router = express.Router();

let user = require('../controllers/user');

// user portal functions
router.post('/addCourse', user.addCourse);
router.post('/addSyllabus', user.addSyllabus);
router.post('/updateSyllabus', user.updateSyllabus);
router.post('/addSchedule', user.addSchedule);
router.post('/updateSchedule', user.updateSchedule);
router.post('/addAssignment', user.addAssignment);
router.post('/addLectureNote', user.addLectureNote);
router.post('/addClassNote', user.addClassNote);
router.post('/addOtherNote', user.addOtherNote);

router.post('/removeAssignment', user.removeAssignment);
router.post('/removeLectureNote', user.removeLectureNote);
router.post('/removeClassNote', user.removeClassNote);
router.post('/removeOtherNote', user.removeOtherNote);

// if there was an error (session ended maybe)
// user might try a get request
// try to send them back where they where
router.get('/addCourse', user.addCourseRedirect);
router.get('/addSyllabus', user.login);
router.get('/updateSyllabus', user.login);
router.get('/addSchedule', user.login);
router.get('/addAssignment', user.login);
router.get('/addLectureNote', user.login);
router.get('/addClassNote', user.login);
router.get('/addOtherNote', user.login);

router.get('/removeAssignment', user.login);
router.get('/removeLectureNote', user.login);
router.get('/removeClassNote', user.login);
router.get('/removeOtherNote', user.login);

module.exports = router;