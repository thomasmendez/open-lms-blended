import React from "react"
import { Container, Row, Col, Table, Alert, Button } from 'react-bootstrap'
import { Redirect } from "react-router-dom";
import UserNavBar from "../../../../../general/UserNavbar"
import Loading from "../../../../../general/Loading" 
import { portalArchivedCourseSchedule} from "../../../../apis/portalApis"
import { corsOptionsGET, apiURL } from "../../../../../config/config"


class Schedule extends React.Component {

    constructor() {
        super()
        this.state = {
            username: null,
            isLoading: true,
            schedule: null
        }
    }

    callAPI() {
        fetch(portalArchivedCourseSchedule(this.props.match.params.archivedCourse), {
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
               let schedule = data.archivedSchedule
               this.setState({
                   username: username,
                   schedule: schedule,
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

            if (this.state.schedule) {

                let title = "Schedule for " + this.state.schedule.fullCourseName + ": " + this.state.schedule.course + " (" + this.state.schedule.semester + " " + this.state.schedule.year + ")"
                // we have a previously uploaded schedule 
                if (this.state.schedule.schedule.fileID !== undefined) {

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
                                        <th>Schedule</th>
                                        <th>Date Uploaded</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td><a href={`${apiURL}/portal/archivedCourse/${this.props.match.params.archivedCourse}/schedule/id/${this.state.schedule.schedule.fileID}/files/${this.state.schedule.schedule.scheduleFile}`}>{`Current Schedule`} </a></td>
                                        <td>{this.state.schedule.schedule.uploadDate}</td>
                                      </tr>
                                    </tbody>
                                    </Table>
                                </Col>
                            </Row>
                            
                        </Container>
                        </>
                    )

                } else {

                    // there is no previous uploaded schedule
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
                                        <th>Schedule</th>
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

export default Schedule