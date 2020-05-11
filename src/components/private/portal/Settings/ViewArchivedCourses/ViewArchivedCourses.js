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
import { portalSettingsViewArchive } from "../../../apis/portalApis"
import { corsOptionsGET, corsOptionsPOST } from "../../../../config/config"
import BasicTable from "../../../../public/general/BasicTable"

class ViewArchivedCourses extends React.Component {

    constructor() {
        super()
        this.state = {
            username: null,
            isLoading: true,
            archivedCourses: null,
        }
    }

    callAPI() {
        
        fetch(portalSettingsViewArchive(), {
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

                let validUsername = data.username
                let archivedCourses = data.archivedCourses
                let settingsURL = `/portal/${validUsername}/settings`

                this.setState({
                    username: validUsername,
                    isLoading: false,
                    archivedCourses: archivedCourses
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

    render() {

        if (!this.state.isLoading) {

            if (this.state.username) {

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
                let tableHeaders = ["Courses", "Semester", "Year"]
                var tableData = []
                var rowData = {}

                {this.state.archivedCourses.map((course, i) => (

                    rowData = <>
                                <td>
                                    <a href={`/portal/archivedCourse/${course._id}`}>{`${course.course} - ${course.fullCourseName}`} </a>
                                </td>
                                <td>
                                    {course.semester}
                                </td>
                                <td>
                                    {course.year}
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
                                    <h3>View Archive Courses</h3>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={4}>
                                    <SettingsBar section={"archiveView"}></SettingsBar>
                                </Col>
                                <Col xs={8}>
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
                                    <h3>View Archive Courses</h3>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={3}>
                                    <SettingsBar section={"archiveView"}></SettingsBar>
                                </Col>
                                <Col xs={9}>
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

export default ViewArchivedCourses