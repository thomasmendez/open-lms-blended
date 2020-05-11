var express = require('express');
var router = express.Router();

let portal = require('../controllers/portal');
let settings = require('../controllers/settings/settings')

let files = require('../controllers/files');

// portal home
router.get('/', portal.getHome);

// checks if user is logged in 
router.get('/checkUser', portal.checkUser);
router.get('/resendEmailVerification', portal.resendEmailVerification)

// portal settings
router.get('/settings', settings.getSettings);
router.get('/settings/email', settings.getSettingsEmail);
router.get('/settings/semester', settings.getSettingsSemester);
router.get('/settings/password', settings.getSettingsPassword);
//router.get('/settings/archiveCourses', portal.getSettingsArchiveCourse);
router.get('/settings/viewArchieve', settings.getSettingsViewArchive);
router.get('/settings/deleteAccount', settings.getSettingsDeleteAccount);
router.get('/settings/confirmDeleteAccount', settings.getSettingsDeleteAccount);

// portal settings update info
router.post('/settings/update/email', settings.updateSettingsEmail);
router.post('/settings/update/semester', settings.updateSettingsSemester);
router.post('/settings/update/password', settings.updateSettingsPassword);
//router.post('/settings/update/archiveCourses', portal.updateSettingsArchiveCourse);
//router.post('/settings/update/viewArchieve', portal.updateSettingsViewArchive);
router.post('/settings/update/deleteAccount', settings.updateSettingsDeleteAccount);

router.get('/settings/update/email', settings.getSettingsEmail);
router.get('/settings/update/semester', settings.getSettingsSemester);
router.get('/settings/update/password', settings.updateSettingsPassword);
router.post('/settings/update/archiveCourses', settings.updateSettingsArchiveCourse);
//router.post('/settings/update/viewArchieve', settings.updateSettingsViewArchive);
router.get('/settings/update/deleteAccount', settings.getSettingsDeleteAccount);

// course info
router.get('/course/:course', portal.getCourse);
router.get('/course/:course/syllabus', portal.getSyllabus);
router.get('/course/:course/schedule', portal.getSchedule);
router.get('/course/:course/assignments', portal.getAssignments);
router.get('/course/:course/lectureNotes', portal.getLectureNotes);
router.get('/course/:course/classNotes', portal.getClassNotes);
router.get('/course/:course/otherNotes', portal.getOtherNotes);

// archive courses
router.get('/archivedCourse/:id', portal.getArchivedCourse);
router.get('/archivedCourse/:id/syllabus', portal.getArchivedSyllabus);
router.get('/archivedCourse/:id/schedule', portal.getArchivedSchedule);
router.get('/archivedCourse/:id/assignments', portal.getArchivedAssignments);
router.get('/archivedCourse/:id/lectureNotes', portal.getArchivedLectureNotes);
router.get('/archivedCourse/:id/classNotes', portal.getArchivedClassNotes);
router.get('/archivedCourse/:id/otherNotes', portal.getArchivedOtherNotes);

// file retrieval 
router.get('/course/:course/syllabus/id/:id/files/:filename', files.getFile);
router.get('/course/:course/schedule/id/:id/files/:filename', files.getFile);
router.get('/course/:course/assignments/id/:id/files/:filename', files.getFile);
router.get('/course/:course/lectureNotes/id/:id/files/:filename', files.getFile);
router.get('/course/:course/classNotes/id/:id/files/:filename', files.getFile);
router.get('/course/:course/otherNotes/id/:id/files/:filename', files.getFile);

router.get('/archivedCourse/:archivedCourse/syllabus/id/:id/files/:filename', files.getFile);
router.get('/archivedCourse/:archivedCourse/schedule/id/:id/files/:filename', files.getFile);
router.get('/archivedCourse/:archivedCourse/assignments/id/:id/files/:filename', files.getFile);
router.get('/archivedCourse/:archivedCourse/lectureNotes/id/:id/files/:filename', files.getFile);
router.get('/archivedCourse/:archivedCourse/classNotes/id/:id/files/:filename', files.getFile);
router.get('/archivedCourse/:archivedCourse/otherNotes/id/:id/files/:filename', files.getFile);

// settings
router.get('/settings');

module.exports = router;