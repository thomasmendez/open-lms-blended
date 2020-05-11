import config from 'config'

export function logout() {
    return `${config.apiUrl}/logout`
}

export function portalCheckUser() {
    return `${config.apiUrl}/portal/checkUser`
}

export function portalResendEmailVerification() {
    return `${config.apiUrl}/portal/resendEmailVerification`
}

// portal pages 
export function portalHome() {
    return `${config.apiUrl}/portal`
}

export function portalCourse(course) {
    return `${config.apiUrl}/portal/course/${course}`
}

export function portalCourseSyllabus(course) {
    return `${config.apiUrl}/portal/course/${course}/syllabus`
}

export function portalCourseSchedule(course) {
    return `${config.apiUrl}/portal/course/${course}/schedule`
}

export function portalCourseAssignments(course) {
    return `${config.apiUrl}/portal/course/${course}/assignments`
}

export function portalCourseClassNotes(course) {
    return `${config.apiUrl}/portal/course/${course}/classNotes`
}

export function portalCourseLectureNotes(course) {
    return `${config.apiUrl}/portal/course/${course}/lectureNotes`
}

export function portalCourseOtherNotes(course) {
    return `${config.apiUrl}/portal/course/${course}/otherNotes`
}

// form actions
export function portalAddCourse() {
    return `${config.apiUrl}/user/addCourse`
}

export function portalAddSyllabus() {
    return `${config.apiUrl}/user/addSyllabus`
}

export function portalUpdateSyllabus() {
    return `${config.apiUrl}/user/updateSyllabus`
}

export function portalAddSchedule() {
    return `${config.apiUrl}/user/addSchedule`
}

export function portalUpdateSchedule() {
    return `${config.apiUrl}/user/updateSchedule`
}

export function portalAddAssignment() {
    return  `${config.apiUrl}/user/addAssignment`
}

export function portalRemoveAssignment() {
    return `${config.apiUrl}/user/removeAssignment`
}

export function portalAddClassNote() {
    return  `${config.apiUrl}/user/addClassNote`
}

export function portalRemoveClassNote() {
    return `${config.apiUrl}/user/removeClassNote`
}

export function portalAddLectureNote() {
    return  `${config.apiUrl}/user/addLectureNote`
}

export function portalRemoveLectureNote() {
    return `${config.apiUrl}/user/removeLectureNote`
}

export function portalAddOtherNote() {
    return  `${config.apiUrl}/user/addOtherNote`
}

export function portalRemoveOtherNote() {
    return `${config.apiUrl}/user/removeOtherNote`
}

// portal settings get

export function portalSettings() {
    return `${config.apiUrl}/portal/settings`
}

export function portalSettingsEmail() {
    return `${config.apiUrl}/portal/settings/email`
}

export function portalSettingsSemester() {
    return `${config.apiUrl}/portal/settings/semester`
}

export function portalSettingsPassword() {
    return `${config.apiUrl}/portal/settings/password`
}

export function portalSettingsDeleteAccount() {
    return `${config.apiUrl}/portal/settings/deleteAccount`
}

export function portalSettingsViewArchive() {
    return `${config.apiUrl}/portal/settings/viewArchieve`
}

export function portalViewArchive(id) {
    return `${config.apiUrl}/portal/archivedCourse/${id}`
}

// portal settings post

export function portalSettingsUpdateEmail() {
    return `${config.apiUrl}/portal/settings/update/email`
}

export function portalSettingsUpdateSemester() {
    return `${config.apiUrl}/portal/settings/update/semester`
}

export function portalSettingsUpdatePassword() {
    return `${config.apiUrl}/portal/settings/update/password`
}

export function portalSettingsConfirmedDeleteAccount() {
    return `${config.apiUrl}/portal/settings/update/deleteAccount`
}

export function portalSettingsArchiveCourses() {
    return `${config.apiUrl}/portal/settings/update/archiveCourses`
}

// portal archived courses

export function portalArchivedCourse(_id) {
    return `${config.apiUrl}/portal/archivedCourse/${_id}`
}

export function portalArchivedCourseSyllabus(_id) {
    return `${config.apiUrl}/portal/archivedCourse/${_id}/syllabus`
}

export function portalArchivedCourseSchedule(_id) {
    return `${config.apiUrl}/portal/archivedCourse/${_id}/schedule`
}

export function portalArchivedCourseAssignments(_id) {
    return `${config.apiUrl}/portal/archivedCourse/${_id}/assignments`
}

export function portalArchivedCourseClassNotes(_id) {
    return `${config.apiUrl}/portal/archivedCourse/${_id}/classNotes`
}

export function portalArchivedCourseLectureNotes(_id) {
    return `${config.apiUrl}/portal/archivedCourse/${_id}/lectureNotes`
}

export function portalArchivedCourseOtherNotes(_id) {
    return `${config.apiUrl}/portal/archivedCourse/${_id}/otherNotes`
}