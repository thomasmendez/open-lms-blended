import config from 'config'

export function signup() {
    return `${config.apiUrl}/signup`
}

export function login() {
    return `${config.apiUrl}/login`
}

export function confirmEmail() {
    return `${config.apiUrl}/confirmEmail`
}

export function resetPassword() {
    return `${config.apiUrl}/resetPassword`
}

export function checkToken(token) {
    return `${config.apiUrl}/resetPassword/token/` + token
}

export function resetPasswordToken(token) {
    return `${config.apiUrl}/resetPassword/token/` + token
}

export function teacherDirectory() {
    return `${config.apiUrl}/`
}

export function teacherHome(teacherUsername) {
    return `${config.apiUrl}/teacher/${teacherUsername}`
}

export function teacherCourse(teacherUsername, course) {
    return `${config.apiUrl}/teacher/${teacherUsername}/course/${course}`
}

export function teacherCourseAssignments(teacherUsername, course) {
    return `${config.apiUrl}/teacher/${teacherUsername}/course/${course}/assignments`
}

export function teacherCourseClassNotes(teacherUsername, course) {
    return `${config.apiUrl}/teacher/${teacherUsername}/course/${course}/classNotes`
}

export function teacherCourseLectureNotes(teacherUsername, course) {
    return `${config.apiUrl}/teacher/${teacherUsername}/course/${course}/lectureNotes`
}

export function teacherCourseOtherNotes(teacherUsername, course) {
    return `${config.apiUrl}/teacher/${teacherUsername}/course/${course}/otherNotes`
}

