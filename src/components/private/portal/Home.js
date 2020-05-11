import React from "react"
import { Container, Row, Col, Alert } from 'react-bootstrap'
import { Redirect } from "react-router-dom"
import UserNavbar from "../../general/UserNavbar"
import Loading from "../../general/Loading"
import AddForm from "../general/AddForm"
import { portalHome, portalAddCourse, portalResendEmailVerification } from "../apis/portalApis"
import { corsOptionsGET, corsOptionsPOST } from "../../config/config"
import config from 'config'

class Home extends React.Component {

    constructor() {
        super()
        this.state = {
            isLoading: true,
            teacher: null,
            plusButtonClicked: false,
            courseIDInput: "",
            courseFullNameInput: "",
            message: null,
            isErrorMessage: null,
            pressedEmailLink: false,
            emailMessage: null
        }

        this.onClickResendEmailVerification = this.onClickResendEmailVerification.bind(this)
        this.onPlusButtonClick = this.onPlusButtonClick.bind(this)
        this.handleCourseIDChange = this.handleCourseIDChange.bind(this)
        this.handleFullCourseNameChange = this.handleFullCourseNameChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

    }

    checkUser() {
        fetch(portalHome(), {
            method: corsOptionsGET.method, 
            mode: corsOptionsGET.mode,
            credentials: corsOptionsGET.credentials,
            headers: { 
                "Content-Type": corsOptionsGET.headers["Content-Type"],
                "Access-Control-Allow-Origin": corsOptionsGET.headers["Access-Control-Allow-Origin"],
                "Access-Control-Allow-Methods": corsOptionsGET.headers["Access-Control-Allow-Methods"],
                "Access-Control-Allow-Credentials": corsOptionsGET.headers["Access-Control-Allow-Credentials"]
            }
        })
        .then(res => this.processResponse(res))
        .then(res => {
            const { statusCode, data } = res;
            this.processFetchData(statusCode, data)
        })
        .catch(error => 
            console.error(error)
        )

    }

    componentDidMount() {
        this.checkUser();
    }

    processResponse(response) {
        const statusCode = response.status;
        const data = response.json();
        return Promise.all([statusCode, data]).then(res => ({
          statusCode: res[0],
          data: res[1]
        }));
    }

    processFetchData(statusCode, data) {
        var code = parseInt(statusCode)
        switch(statusCode) {
            case 200:
                let teacher = data.teacher
                var courses = []

                teacher.courses.map((course, i) => {
                    let courseID = course.course
                    let fullCourseName = course.fullCourseName
                    let semester = course.semester
                    let year = course.year
                    courses.push({
                        course: courseID,
                        fullCourseName: fullCourseName,
                        semester: semester,
                        year: year
                    })
                })

                this.setState({
                    isLoading: false,
                    teacher: {
                        username: teacher.username,
                        email: teacher.email,
                        confirmedEmail: teacher.confirmedEmail,
                        firstName: teacher.firstName,
                        lastName: teacher.lastName,
                        semester: teacher.semester,
                        year: teacher.year,
                        courses: courses
                    }
                })
                break;
            case 401: 
                this.props.history.push('/login')
                break;
            default:
                console.log("unregistered status code")
        }
    }

    // button functions

    onClickResendEmailVerification() {

        this.setState({
            pressedEmailLink: true
        }, function() {
            fetch(portalResendEmailVerification(), {
                method: corsOptionsGET.method, 
                mode: corsOptionsGET.mode,
                credentials: corsOptionsGET.credentials,
                headers: { 
                    "Content-Type": corsOptionsGET.headers["Content-Type"],
                    "Access-Control-Allow-Origin": corsOptionsGET.headers["Access-Control-Allow-Origin"],
                    "Access-Control-Allow-Methods": corsOptionsGET.headers["Access-Control-Allow-Methods"],
                    "Access-Control-Allow-Credentials": corsOptionsGET.headers["Access-Control-Allow-Credentials"]
                }
            })
            .then(res => this.processResponse(res))
            .then(res => {
                const { statusCode, data } = res;
                this.processEmailFetchData(statusCode, data)
            })
            .catch(error => 
                console.error(error)
            )
        })

    }

    processEmailFetchData(statusCode, data) {

        var emailMessage;

        switch(statusCode) {
            case 200: 
                emailMessage = data.emailMessage
                this.setState({
                    emailMessage: emailMessage
                })
                break;

            case 500:
                emailMessage = data.emailMessage
                this.setState({
                    emailMessage: emailMessage
                })
                break;
            default: 
                console.log("unregistered status code")
        }
    }

    onPlusButtonClick(event) {

        event.preventDefault()

        // check if + is hit first
        if (!this.state.plusButtonClicked) {
            // open the form 
            this.setState({plusButtonClicked: true})
        }        
    }

    // text fields

    handleCourseIDChange(event) {
        this.setState({courseIDInput: event.target.value})
    }

    handleFullCourseNameChange(event) {
        this.setState({courseFullNameInput: event.target.value})
    }

    // submit function

    handleSubmit(event) {
        event.preventDefault()
    
        // send the response to the server 
        fetch(portalAddCourse(), {
            method: corsOptionsPOST.method, 
            mode: corsOptionsPOST.mode,
            credentials: corsOptionsPOST.credentials,
            headers: { 
                "Content-Type": corsOptionsPOST.headers["Content-Type"],
                "Access-Control-Allow-Origin": corsOptionsPOST.headers["Access-Control-Allow-Origin"],
                "Access-Control-Allow-Methods": corsOptionsPOST.headers["Access-Control-Allow-Methods"],
                "Access-Control-Allow-Credentials": corsOptionsPOST.headers["Access-Control-Allow-Credentials"]
            },
            body: JSON.stringify({
                course: this.state.courseIDInput,
                courseFullName: this.state.courseFullNameInput
            })
        })
        .then(res => this.processResponse(res))
        .then(res => {
            const { statusCode, data } = res;
            this.processSubmitData(statusCode, data)
        })
        .catch(error => {
            console.error(error);
        });

    }

    
    processSubmitData(statusCode, data) {

        var message;

        switch(statusCode) {
            case 200: 
                message = data.message
                let teacher = data.teacher
                var courses = []

                teacher.courses.map((course, i) => {
                    let courseID = course.course
                    let fullCourseName = course.fullCourseName
                    let semester = course.semester
                    let year = course.year
                    courses.push({
                        course: courseID,
                        fullCourseName: fullCourseName,
                        semester: semester,
                        year: year
                    })
                })

                this.setState({
                    isLoading: false,
                    courseIDInput: "",
                    courseFullNameInput: "",
                    teacher: {
                        email: teacher.email,
                        firstName: teacher.firstName,
                        lastName: teacher.lastName,
                        semester: teacher.semester,
                        year: teacher.year,
                        courses: courses
                    },
                    message: message,
                    isErrorMessage: false
                })
                break;
            case 401:
                this.props.history.push('/login')
                break;

            case 403:
                
                message = data.message
                this.setState({
                    message: message,
                    isErrorMessage: true
                })
                break;

            case 500:

                message = data.message
                this.setState({
                    message: message,
                    isErrorMessage: true
                })
                break;
            default: 
                console.log("unregistered status code")
        }

    }

    render() {

        let formGroups = [
            {
                controlId: "CourseID",
                label: "Course / Class (With ID):",
                type: "text",
                name: "course",
                value: this.state.courseIDInput,
                placeholder: "MATH-340-00300 / Class 4A",
                onChange: this.handleCourseIDChange
            },
            {
                controlId: "FullCourseName",
                label: "Course / Class Name:",
                type: "text",
                name: "courseFullName",
                value: this.state.courseFullNameInput,
                placeholder: "Algebra I / Reading 4",
                onChange: this.handleFullCourseNameChange
            }
        ]

        let alert;

        if (this.state.isErrorMessage == true) {
            alert = <Alert variant="danger">
                        {`${this.state.message}`}
                    </Alert>
        } else if (this.state.isErrorMessage == false) {
            alert = <Alert variant="success">
                        {`${this.state.message}`}
                    </Alert>
        }

        if (!this.state.isLoading) {
            
            if (this.state.teacher) {

                let alert2;

                if (!this.state.teacher.confirmedEmail) {

                    if (this.state.pressedEmailLink) {

                        if (this.state.emailMessage) {
                            alert2 = <Alert variant="warning">
                                     {this.state.emailMessage}
                                     </Alert>
                        }

                    } else {
                        alert2 = <Alert variant="warning">
                                 Please confirm your email to prevent the loss of your account. Check your inbox or spam folder. If it was deleted <a href="#" onClick={this.onClickResendEmailVerification}>click here</a> to resend the email verification link to {this.state.teacher.email}
                                 </Alert>
                    }
                    
                }

                return (
                    <>
                    <UserNavbar isLoggedIn={true} username={this.state.teacher.username}></UserNavbar>

                    <Container fluid>
                        <Row>
                            <Col xs={12}>
                            <Row>
                            <Col xs={12}>
                                {alert2}
                                {alert}
                                <h3>{`${this.state.teacher.firstName} ${this.state.teacher.lastName}`}</h3>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <h4>{`${config.institutionName}`}</h4>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <h5>{`Courses (${this.state.teacher.semester} ${this.state.teacher.year})`}</h5>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>

                            {this.state.teacher.courses.map((course, i) => (
                            
                                <div key={`course-${i}`}>
                                    <p>
                                        <a href={`/portal/course/${course.course}`}>{`${course.course} - ${course.fullCourseName}`} </a>
                                    </p>
                                </div>
    
                            ))}
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <AddForm 
                                    pressed={this.state.plusButtonClicked} 
                                    handleSubmit={this.handleSubmit}
                                    formGroups={formGroups}
                                    buttonName={`add course`}
                                    onClick={this.onPlusButtonClick}
                                >
                                </AddForm>
                            </Col>
                        </Row>
                            </Col>
                        </Row>
                    </Container>
                    </>
                )

            } else {

                return (
                    <Redirect to={`${this.props.location.pathname}/404`}/>
                )

            }

        }

        else {
            return (
                <Loading></Loading>
            )
        }
    }
}

export default Home