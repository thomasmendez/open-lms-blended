import React from "react"
import { Container, Row, Col, Table, Alert, Button } from 'react-bootstrap'
import { Redirect } from "react-router-dom";
import UserNavBar from "../../../../../general/UserNavbar"
import Loading from "../../../../../general/Loading"
import { portalArchivedCourseSyllabus } from "../../../../apis/portalApis"
import { corsOptionsGET, apiURL } from "../../../../../config/config"

class Syllabus extends React.Component {

    constructor() {
        super()
        this.state = {
            username: null,
            isLoading: true,
            syllabus: null
        }
    }

    callAPI() {
        fetch(portalArchivedCourseSyllabus(this.props.match.params.archivedCourse), {
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
               let username = data.username
               let syllabus = data.archivedSyllabus
               this.setState({
                   username: username,
                   syllabus: syllabus,
                   isLoading: false
               })
               break;

            case 401:
                this.props.history.push('/login')
                break;

            default: 
                console.log("unregistered status code")
        }
    }

    render() {

        if (!this.state.isLoading) {

            if (this.state.syllabus) {

                let title = "Syllabus for " + this.state.syllabus.fullCourseName + ": " + this.state.syllabus.course + " (" + this.state.syllabus.semester + " " + this.state.syllabus.year + ")"

                // we have a previously uploaded syllabus 
                if (this.state.syllabus.syllabus.fileID) {

                    return (
                        <>
                        <UserNavBar isLoggedIn={true} username={this.state.username}></UserNavBar>
                        <Container fluid>
                            <Row>
                                <Col xs={12}>
                                    <h1>{title}</h1>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={12}>
                                    <Table striped bordered hover>
                                    <thead>
                                      <tr>
                                        <th>Syllabus</th>
                                        <th>Date Uploaded</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td><a href={`${apiURL}/portal/archivedCourse/${this.props.match.params.archivedCourse}/syllabus/id/${this.state.syllabus.syllabus.fileID}/files/${this.state.syllabus.syllabus.syllabusFile}`}>{`Current Syllabus`} </a></td>
                                        <td>{this.state.syllabus.syllabus.uploadDate}</td>
                                      </tr>
                                    </tbody>
                                    </Table>
                                </Col>
                            </Row>
                            
                        </Container>
                        </>
                    )

                } else {

                    // there is no previous uploaded syllabus
                    return (
                        <>
                        <UserNavBar isLoggedIn={true} username={this.state.username}></UserNavBar>
                        <Container fluid>
                            <Row>
                                <Col xs={12}>
                                    <h1>{title}</h1>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <Table striped bordered hover>
                                    <thead>
                                      <tr>
                                        <th>Syllabus</th>
                                        <th>Date Uploaded</th>
                                      </tr>
                                    </thead>
                                    </Table>
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
                <Loading></Loading>
            )
        }
    }

}

export default Syllabus