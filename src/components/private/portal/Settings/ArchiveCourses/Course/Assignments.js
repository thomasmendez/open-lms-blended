import React from "react"
import { Container, Row, Col, Alert, Button } from 'react-bootstrap'
import { Redirect } from "react-router-dom";
import UserNavBar from "../../../../../general/UserNavbar"
import Loading from "../../../../../general/Loading"
import BasicTable from "../../../../general/BasicTable"
import { portalArchivedCourseAssignments} from "../../../../apis/portalApis"
import { corsOptionsGET, apiURL } from "../../../../../config/config"

class Assignments extends React.Component {

    constructor() {
        super()
        this.state = {
            username: null,
            isLoading: true,
            assignments: null,
            message: null,
            isErrorMessage: null
        }
    }

    callAPI() {
        fetch(portalArchivedCourseAssignments(this.props.match.params.archivedCourse), {
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
               let assignments = data.archivedAssignments
               this.setState({
                   username: username,
                   assignments: assignments,
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

            if (this.state.assignments) {

                let title = "Assignments for " + this.state.assignments.fullCourseName + ": " + this.state.assignments.course + " (" + this.state.assignments.semester + " " + this.state.assignments.year + ")"
                let tableHeaders = ["Assignment Name", "Due Date"]
                var tableData = []
                var rowData = {}

                {this.state.assignments.assignments.map((assignment, i) => (

                    rowData = <>
                                <td>
                                    <a href={`${apiURL}/portal/archivedCourse/${this.props.match.params.archivedCourse}/assignments/id/${assignment.fileID}/files/${assignment.assignmentFile}`}>{`${assignment.assignmentName}`} </a>
                                </td>
                                <td>
                                    {assignment.dueDate ? new Date(assignment.dueDate).toLocaleString(): 'No Due Date'}
                                </td>
                              </>,

                    tableData.push(rowData)

                ))}

                return (
                    <>
                    <UserNavBar isLoggedIn={true} username={this.state.username}></UserNavBar>
                    <Container fluid>
                        <BasicTable title={title} tableHeaders={tableHeaders} tableData={tableData}/>
                    </Container>
                    </>
                )

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

export default Assignments