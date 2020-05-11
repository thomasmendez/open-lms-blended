"use strict";
// NPM install mongoose and chai. Make sure mocha is globally
// installed
const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true); 
mongoose.set('useUnifiedTopology', true);
const Schema = mongoose.Schema;
const chai = require('chai');
const expect = chai.expect;
const TeacherModule = require('../../src/server/db/models/teacher');
const mongodb = require('../../src/server/db/mongodb');

// import the teacher module with schema
const testSchema = TeacherModule.schema;

//Create a new collection called 'Teacher'
const Teacher = mongoose.model('Teacher', testSchema);

describe('Database Tests', function() {

  //Before starting the test, create a sandboxed database connection
  //Once a connection is established invoke done()
  before(function (done) {
    mongoose.connect('mongodb://localhost/testDatabase');
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', function() {
      console.log('We are connected to test database!');
      done();
    });
  });

  // Test insertion of document to database 
  describe('Test Database', function() {

    //Save teacher object object to database
    it('New teacher saved to test database', function(done) {
      var testTeacher = Teacher({
        username: 'Mike',
        password: 'jfsdjfsdkfsjfs#@423fsdfjs',
        email: 'mike@email.com',
        firstName: 'Mike',
        lastName: 'Rogers',
        semester: 'Fall',
        year: '2020'
      });
      testTeacher.save(done);
    });

    it('Only save if it is in the correct format', function(done) {
      //Attempt to save with wrong info. An error should trigger
      var wrongSave = Teacher({
        wrongUsername: 'Mike',
        password: 'jfsdjfsdkfsjfs#@423fsdfjs',
        email: 'mike@email.com',
        firstName: 'Mike',
        semeseter: 'Fall',
        year: '2020'
      });
      wrongSave.save(err => {
        if(err) { return done(); }
        throw new Error('Document does not match teacher schema!');
      });
    });

    it('Should retrieve data from test database', function(done) {
      //Look up the teacher with username 'Mike' object previously saved.
      Teacher.find({username: 'Mike'}, (err, teacher) => {
        if(err) {throw err;}
        if(teacher.length === 0) {throw new Error('No data!');}
        done();
      });
    });

  });

  // Test custom functions from db folder
  describe('Test Custom Mongodb.js Functions', function() {

    let username = 'Smith';

    // course
    let course = 'Math 340';
    let fullCourseName = 'Algebra I';

    // syllabus
    let syllabusFile = 'Schedule';
    let syllabusFileID = '72898fsuwhsdvlknf$dslfas';
    let syllabusUploadDate = '01/20/2020';

    // schedule
    let scheduleFile = 'Schedule';
    let scheduleFileID = '72898fsuwhsdvlknf$dslfas';
    let scheduleUploadDate = '01/20/2020';

    // assignment
    let assignmentFileID = '4782asffaof$@23fajfldasdfl'; // id for assignment file (fs.files)
    var assignmentDocumentID; 
    let assignmentName = 'Worksheet 1';
    let assignmentFilename = 'Worksheet 1.pdf';
    let assignmentDueDate = '03/03/2020';

    // lectureNote
    let lectureNoteFileID = '891f11$@23fajfldasdfl'; // id for lectureNote file (fs.files)
    var lectureNoteDocumentID; 
    let lectureNoteName = 'Lecture 1';
    let lectureNoteFilename = 'Lecture 1.pdf';
    let lectureNoteDueDate = '03/03/2020';

    // classNote
    let classNoteFileID = 'fafaf28347298472$@23fajfldasdfl'; // id for classNote file (fs.files)
    var classNoteDocumentID; 
    let classNoteName = 'Class Note 1';
    let classNoteFilename = 'Class Note 1.pdf';
    let classNoteDueDate = '03/03/2020';

    // otherNote
    let otherNoteFileID = 'fafaf28347298472$@23fajfldasdfl'; // id for otherNote file (fs.files)
    var otherNoteDocumentID; 
    let otherNoteName = 'Class Note 1';
    let otherNoteFilename = 'Class Note 1.pdf';
    let otherNoteDueDate = '03/03/2020';

    it('New teacher saved to test database', function(done) {
      var testTeacher = Teacher({
        username: username,
        password: 'fjas%$#%$fjdsa#@423fsdfjs',
        email: 'smith@email.com',
        firstName: 'Smith',
        lastName: 'Jones',
        semester: 'Fall',
        year: '2020'
      });
      testTeacher.save(done);
    });

    it('Should get teacher from database', function(done) {
      mongodb.findTeacherByUsername(username).then(function(teacher) {
        if(teacher.length === 0) {
          throw new Error('No data!');
        } else {
          done();
        }
      }).catch(function(error) {
        throw new Error("MongoDB error: " + error);
      });
    });

    it ('Course does not exist yet', function(done) {
        mongodb.findCourse(course).then(function(result) {     
            if (result === null) {
                done();
            } else {
                throw new Error('Course exist already!');
            }
        }).catch(function(error) { 
          throw new Error("MongoDB error: " + error);
        });
    });

    it('Add course to teacher document', function(done) {
      mongodb.addCourse(username, course, fullCourseName).then(function(teacher) {        
        if(teacher.courses.length === 0) {
          throw new Error('Course not added!');
        } else {
          done();
        }
      }).catch(function(error) { 
        throw new Error("MongoDB error: " + error);
      });
    });

    it('Add syllabus to teacher document', function(done) {
      mongodb.addSyllabus(course, syllabusFileID, syllabusFile, syllabusUploadDate).then(function(teacher) {  
        if(teacher.courses[0].syllabus === null || teacher.courses[0].syllabus === undefined) {
          throw new Error('Course not added!');
        } else {
          done();
        }
      }).catch(function(error) { 
        throw new Error("MongoDB error: " + error);
      });
    });

    it('Add schedule to teacher document', function(done) {
      mongodb.addSchedule(course, scheduleFileID, scheduleFile, scheduleUploadDate).then(function(teacher) {  
        if(teacher.courses[0].schedule === null || teacher.courses[0].schedule === undefined) {
          throw new Error('Course not added!');
        } else {
          done();
        }
      }).catch(function(error) { 
        throw new Error("MongoDB error: " + error);
      });
    });

    it('Add assignment to teacher document', function(done) {
      mongodb.addAssignment(course, assignmentFileID, assignmentName, assignmentFilename, assignmentDueDate).then(function(teacher) {
        if (teacher.courses[0].assignments.lenght === 0) {
          throw new Error('Assignment not added!');
        } else {
          assignmentDocumentID = teacher.courses[0].assignments[0]._id;
          done();
        }
      }).catch(function(error) {
        throw new Error("MongoDB error: " + error);
      });
    });

    it('Remove assignment from teacher document', function(done) {
      mongodb.removeAssignment(course, assignmentDocumentID).then(function(teacher) {
        if (teacher.courses[0].assignments.lenght > 0) {
          throw new Error('Assignment was not removed!');
        } else {
          done();
        }
      }).catch(function (error) {
        throw new Error("MongoDB error: " + error);
      });
    });

    it('Add lecture note to teacher document', function(done) {
      mongodb.addLectureNote(course, lectureNoteFileID, lectureNoteName, lectureNoteFilename, lectureNoteDueDate).then(function(teacher) {
        if (teacher.courses[0].lectureNotes.lenght === 0) {
          throw new Error('Lecture not added!');
        } else {
          lectureNoteDocumentID = teacher.courses[0].lectureNotes[0]._id;
          done();
        }
      }).catch(function (error) {
        throw new Error("MongoDB error: " + error);
      });
    });

    it('Remove lecture note from teacher document', function(done) {
      mongodb.removeLectureNote(course, lectureNoteDocumentID).then(function(teacher) {
        if (teacher.courses[0].lectureNotes.lenght > 0) {
          throw new Error('Lecture was not removed!');
        } else {
          done();
        }
      }).catch(function (error) {
        throw new Error("MongoDB error: " + error);
      });
    });
    
    it('Add lecture note to teacher document', function(done) {
      mongodb.addClassNote(course, classNoteFileID, classNoteName, classNoteFilename, classNoteDueDate).then(function(teacher) {
        if (teacher.courses[0].classNotes.lenght === 0) {
          throw new Error('Lecture note not added!');
        } else {
          classNoteDocumentID = teacher.courses[0].classNotes[0]._id;
          done();
        }
      }).catch(function (error) {
        throw new Error("MongoDB error: " + error);
      });
    });

    it('Remove lecture note from teacher document', function(done) {
      mongodb.removeClassNote(course, classNoteDocumentID).then(function(teacher) {
        if (teacher.courses[0].classNotes.lenght > 0) {
          throw new Error('Lecture note was not removed!');
        } else {
          done();
        }
      }).catch(function (error) {
        throw new Error("MongoDB error: " + error);
      });
    });

    it('Add other note to teacher document', function(done) {
      mongodb.addOtherNote(course, otherNoteFileID, otherNoteName, otherNoteFilename, otherNoteDueDate).then(function(teacher) {
        if (teacher.courses[0].otherNotes.lenght === 0) {
          throw new Error('Other note not added!');
        } else {
          otherNoteDocumentID = teacher.courses[0].otherNotes[0]._id;
          done();
        }
      }).catch(function(error) {
        throw new Error("MongoDB error: " + error);
      });
    });

    it('Remove other note from teacher document', function(done) {
      mongodb.removeOtherNote(course, otherNoteDocumentID).then(function(teacher) {
        if (teacher.courses[0].otherNotes.lenght > 0) {
          throw new Error('Other note was not removed!');
        } else {
          done();
        }
      }).catch(function (error) {
        throw new Error("MongoDB error: " + error);
      });
    });

  });

  //After all tests are finished drop database and close connection
  after(function(done){
    mongoose.connection.db.dropDatabase(function(){
      mongoose.connection.close(done);
    });
  });

});