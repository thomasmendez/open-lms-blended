import React from "react"
import { Container, Row, Col, Alert, Button } from 'react-bootstrap'
import { Redirect } from "react-router-dom"
import arrowsCSS from "../../../../css/general/arrows.css"
import {
    BrowserView,
    MobileView,
    isBrowser,
    isMobile
} from "react-device-detect";
import UserNavbar from "../../../../general/UserNavbar"
import SettingsBar from "../../../general/SettingsBar"
import Loading from "../../../../general/Loading"
import { portalHome, portalSettingsArchiveCourses } from "../../../apis/portalApis"
import { corsOptionsGET, corsOptionsPOST } from "../../../../config/config"
import BasicTable from "../../../../public/general/BasicTable"

class ArchiveCourse extends React.Component {

    constructor() {
        super()
        this.state = {
            username: null,
            isLoading: true,
            teacher: null,
            message: null,
            isErrorMessage: null
        }
        this.onArchiveClick = this.onArchiveClick.bind(this)
    }

    callAPI() {
        
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
            this.processData(statusCode, data)
        })
        .catch(error => {
            console.error(error);
        });
    }

    componentDidMount() {
      this.callAPI();
    }

    processResponse(response) {
        const statusCode = response.status;
        const data = response.json();
        return Promise.all([statusCode, data]).then(res => ({
          statusCode: res[0],
          data: res[1]
        }));
    }

    processData(statusCode, data) {

        switch(statusCode) {
            case 200:

                let teacher = data.teacher
                var courses = []

                let validUsername = teacher.username

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
                    username: validUsername,
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
                this.setState({
                    username: null,
                    isLoading: false
                })
                this.props.history.push('/login')
                break;

            default: 
                console.log("unregistered status code")
        }
        
    }

    onArchiveClick(course) {
    
        // send the response to the server 
        fetch(portalSettingsArchiveCourses(), {
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
                course: course
            })
        })
        .then(res => this.processResponse(res))
        .then(res => {
            const { statusCode, data } = res;
            this.processArchive(statusCode, data)
        })
        .catch(error => {
            console.error(error);
        });

    }

    processArchive(statusCode, data) {

        var message;

        switch(statusCode) {
            case 200: 
                message = data.message
                let teacher = data.teacher
                this.setState({
                    teacher: teacher,
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

        if (!this.state.isLoading) {

            if (this.state.username) {

                let alert2;

                alert2 = <Alert variant="warning">
                         Archived courses will be removed from the eyes from the general public, but they can still be viewed for references under your account.
                         Archived courses cannot be modified. 
                         </Alert>

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

                let title = ""
                let tableHeaders = ["Courses", "Options"]
                var tableData = []
                var rowData = {}

                {this.state.teacher.courses.map((course, i) => (

                    rowData = <>
                                <td>
                                    <a href={`/portal/course/${course.course}`}>{`${course.course} - ${course.fullCourseName}`} </a>
                                </td>
                                <td>
                                    <Button variant="warning" onClick={this.onArchiveClick.bind(this, course)}>Archive Course</Button>
                                </td>
                              </>,

                    tableData.push(rowData)

                ))}

                if (isMobile) {

                    return (
                        <>
                        <UserNavbar isLoggedIn={true} username={this.state.username}></UserNavbar>
                        <Container fluid>
                            <Row>
                                <Col xs={4}>
                                    <h3>Settings</h3>
                                </Col>
                                <Col xs={8}>
                                    <h3>Archive Course(s)</h3>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={4}>
                                    <SettingsBar section={"archiveManage"}></SettingsBar>
                                </Col>
                                <Col xs={8}>
                                    {alert2}
                                    {alert}
                                    <BasicTable title={title} tableHeaders={tableHeaders} tableData={tableData}/>
                                </Col>
                            </Row>
                        </Container>
                        </>
                    )

                } else {

                    return (
                        <>
                        <UserNavbar isLoggedIn={true} username={this.state.username}></UserNavbar>
                        <Container fluid>
                            <Row>
                                <Col xs={3}>
                                    <h3>Settings</h3>
                                </Col>
                                <Col xs={9}>
                                    <h3>Archive Course(s)</h3>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={3}>
                                    <SettingsBar section={"archiveManage"}></SettingsBar>
                                </Col>
                                <Col xs={9}>
                                    {alert2}
                                    {alert}
                                    <BasicTable title={title} tableHeaders={tableHeaders} tableData={tableData}/>
                                </Col>
                            </Row>
                        </Container>
                        </>
                    )

                }
            } else {
                return (
                    <Redirect to={`${this.props.location.pathname}/404`}/>
                )
            }
        } else {
            return (
                <>
                <Loading></Loading>
                </>
            )
        }
    }

}

export default ArchiveCourse