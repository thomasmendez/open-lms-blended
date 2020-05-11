import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Redirect,
    Switch,
    Route,
    Link
} from "react-router-dom";

import Home from './components/public/Home'
import TeacherHome from './components/public/teacher/Home'
import TeacherCourse from './components/public/teacher/Course'
import TeacherAssignments from './components/public/teacher/Course/Assignments'
import TeacherLectureNotes from './components/public/teacher/Course/LectureNotes'
import TeacherClassNotes from './components/public/teacher/Course/ClassNotes'
import TeacherOtherNotes from './components/public/teacher/Course/OtherNotes'

import TeacherPortalHome from './components/private/portal/Home'
import TeacherPortalCourse from './components/private/portal/Course'
import TeacherPortalSyllabus from './components/private/portal/Course/Syllabus'
import TeacherPortalSchedule from './components/private/portal/Course/Schedule'
import TeacherPortalAssignments from './components/private/portal/Course/Assignments'
import TeacherPortalLectureNotes from './components/private/portal/Course/LectureNotes'
import TeacherPortalClassNotes from './components/private/portal/Course/ClassNotes'
import TeacherPortalOtherNotes from './components/private/portal/Course/OtherNotes'

import TeacherPortalArchivedCourse from './components/private/portal/Settings/ArchiveCourses/ArchivedCourseHome'
import TeacherPortalArchivedSyllabus from './components/private/portal/Settings/ArchiveCourses/Course/Syllabus'
import TeacherPortalArchivedSchedule from './components/private/portal/Settings/ArchiveCourses/Course/Schedule'
import TeacherPortalArchivedAssignments from './components/private/portal/Settings/ArchiveCourses/Course/Assignments'
import TeacherPortalArchivedLectureNotes from './components/private/portal/Settings/ArchiveCourses/Course/LectureNotes'
import TeacherPortalArchivedClassNotes from './components/private/portal/Settings/ArchiveCourses/Course/ClassNotes'
import TeacherPortalArchivedOtherNotes from './components/private/portal/Settings/ArchiveCourses/Course/OtherNotes'

import TeacherPortalSettings from './components/private/portal/Settings/Settings'
import TeacherPortalArchiveCourses from './components/private/portal/Settings/ArchiveCourses/ArchiveCourses'
import TeacherPortalViewArchiveCourse from './components/private/portal/Settings/ViewArchivedCourses/ViewArchivedCourses'
import TeacherPortalEmail from './components/private/portal/Settings/ManageAccount/Email'
import TeacherPortalSemester from './components/private/portal/Settings/ManageAccount/Semester'
import TeacherPortalPassword from './components/private/portal/Settings/ManageAccount/Password'
import TeacherPortalDeleteAccount from './components/private/portal/Settings/ManageAccount/DeleteAccount'

import Login from './components/user/Login'
import Signup from './components/user/Signup'
import ResetPassword from './components/user/ResetPassword'
import ResetPasswordToken from './components/user/ResetPasswordToken'
import ConfirmEmail from './components/user/ConfirmEmail'

import NotFound from './components/statusCodes/NotFound'

class App extends React.Component {

  constructor(props) {
      super(props)
  }
  
  render() {

    return (
      <Router>
        <Switch>
          <Route exact={true} path="/" component={Home}/>
          <Route exact={true} path="/teacher/:teacherUsername" component={TeacherHome}/>
          <Route exact={true} path="/teacher/:teacherUsername/course/:course" component={TeacherCourse}/>
          <Route exact={true} path="/teacher/:teacherUsername/course/:course/assignments" component={TeacherAssignments}/>
          <Route exact={true} path="/teacher/:teacherUsername/course/:course/lectureNotes" component={TeacherLectureNotes}/>
          <Route exact={true} path="/teacher/:teacherUsername/course/:course/classNotes" component={TeacherClassNotes}/>
          <Route exact={true} path="/teacher/:teacherUsername/course/:course/otherNotes" component={TeacherOtherNotes}/>

          <Route exact={true} path="/portal" component={TeacherPortalHome}/>
          <Route exact={true} path="/portal/course/:course" component={TeacherPortalCourse}/>
          <Route exact={true} path="/portal/course/:course/syllabus" component={TeacherPortalSyllabus}/>
          <Route exact={true} path="/portal/course/:course/schedule" component={TeacherPortalSchedule}/>
          <Route exact={true} path="/portal/course/:course/assignments" component={TeacherPortalAssignments}/>
          <Route exact={true} path="/portal/course/:course/lectureNotes" component={TeacherPortalLectureNotes}/>
          <Route exact={true} path="/portal/course/:course/classNotes" component={TeacherPortalClassNotes}/>
          <Route exact={true} path="/portal/course/:course/otherNotes" component={TeacherPortalOtherNotes}/>

          <Route exact={true} path="/portal/archivedCourse/:archivedCourse" component={TeacherPortalArchivedCourse}/>
          <Route exact={true} path="/portal/archivedCourse/:archivedCourse/syllabus" component={TeacherPortalArchivedSyllabus}/>
          <Route exact={true} path="/portal/archivedCourse/:archivedCourse/schedule" component={TeacherPortalArchivedSchedule}/>
          <Route exact={true} path="/portal/archivedCourse/:archivedCourse/assignments" component={TeacherPortalArchivedAssignments}/>
          <Route exact={true} path="/portal/archivedCourse/:archivedCourse/lectureNotes" component={TeacherPortalArchivedLectureNotes}/>
          <Route exact={true} path="/portal/archivedCourse/:archivedCourse/classNotes" component={TeacherPortalArchivedClassNotes}/>
          <Route exact={true} path="/portal/archivedCourse/:archivedCourse/otherNotes" component={TeacherPortalArchivedOtherNotes}/>


          <Route exact={true} path="/portal/settings/account" component={TeacherPortalSettings}></Route>
          <Route exact={true} path="/portal/settings/archiveManage" component={TeacherPortalArchiveCourses}></Route>
          <Route exact={true} path="/portal/settings/archiveView" component={TeacherPortalViewArchiveCourse}></Route>

          <Route exact={true} path="/portal/settings/email" component={TeacherPortalEmail}></Route>
          <Route exact={true} path="/portal/settings/semester" component={TeacherPortalSemester}></Route>
          <Route exact={true} path="/portal/settings/password" component={TeacherPortalPassword}></Route>
          <Route exact={true} path="/portal/settings/deleteAccount" component={TeacherPortalDeleteAccount}></Route>

          <Route exact={true} path="/login" component={Login}/>
          <Route exact={true} path="/signup" component={Signup}/>
          <Route exact={true} path="/resetPassword" component={ResetPassword}/>
          <Route exact={true} path="/teacher/token/:token" component={ResetPasswordToken}/>
          <Route exact={true} path="/teacher/confirmEmail/:username/:emailToken" component={ConfirmEmail}/>

          <Route path="*/404" component={NotFound} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    )
  }
}

export default App;