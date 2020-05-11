import React from "react"
import { Container, Row, Col } from 'react-bootstrap'
import { Redirect } from "react-router-dom";
import UserNavbar from '../../../general/UserNavbar'
import Loading from "../../../general/Loading"
import { portalCheckUser } from '../../../private/apis/portalApis'
import BasicTable from "../../general/BasicTable"
import { teacherCourseAssignments } from "../../apis/teacherApis"
import { apiURL, corsOptionsGET } from "../../../config/config"

class Assignments extends React.Component {

    constructor() {
        super()
        this.state = {
            username: null,
            assignments: null,
            isLoading: true
        }
    }

    callAPI() {
        
        fetch(teacherCourseAssignments(this.props.match.params.teacherUsername, this.props.match.params.course))

            .then(res => this.processResponse(res))
            .then(res => {
                const { statusCode, data } = res;
                this.processData(statusCode, data)

            })
            .catch(error => {
            console.error(error);
        });
    }

    checkUser() {
        fetch(portalCheckUser(), {
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
            this.processCheckUser(statusCode, data)
        })
    }

    processCheckUser(statusCode, data) {
        let username = data.validUsername
        switch(statusCode) {
            case 200:
                this.setState({
                    username: username
                })
                break;
            case 500:
                break;
            default:
                console.log("unregistered status code")
        }
    }

    componentDidMount() {
      this.callAPI();
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

    processData(statusCode, data) {
        if (statusCode === 200) {
            this.setState({
                assignments: data,
                isLoading: false
            })
        }

        else if (statusCode === 404) {
            this.setState(
                {
                    assignments: null,
                    isLoading: false
                }
            )
        } 
    }
    
    render() {

        var userNavbar = <UserNavbar></UserNavbar>

        if (this.state.username) {
            userNavbar = <UserNavbar isLoggedIn={true} username={this.state.username}></UserNavbar>
        }

        if (!this.state.isLoading) {

            if (this.state.assignments) {

                // we have an array of assignments 
                if (this.state.assignments.assignments) {

                    let title = "Assignments for " + this.state.assignments.fullCourseName + ": " + this.state.assignments.course
                    let tableHeaders = ["Assignment Name", "Due Date"]
                    var tableData = []
                    var rowData = {}
    
                    {this.state.assignments.assignments.map((assignment, i) => (
    
                        rowData = <>
                                    <td>
                                        <a href={`${apiURL}/teacher/${this.props.match.params.teacherUsername}/course/${this.props.match.params.course}/assignments/id/${assignment.fileID}/files/${assignment.assignmentFile}`}>{`${assignment.assignmentName}`} </a>
                                    </td>
                                    <td>
                                        {assignment.dueDate ? new Date(assignment.dueDate).toLocaleString() : 'No Due Date'}
                                    </td>
                                  </>,
    
                        tableData.push(rowData)
    
                    ))}
    
                    return (
                        <>
                        {userNavbar}
                        <Container fluid>
                            <BasicTable title={title} tableHeaders={tableHeaders} tableData={tableData}/>
                        </Container>
                        </>
                    )
    
                } else {
                    
                    // we don't have assignments 
                    let title = "Assignments for " + this.state.assignments.fullCourseName + ": " + this.state.assignments.course
                    let tableHeaders = ["Assignment Name", "Due Date"]
                    var tableData = []
    
                    return (
                        <>
                        {userNavbar}
                        <Container fluid>
                            <BasicTable title={title} tableHeaders={tableHeaders} tableData={tableData}/>
                        </Container>
                        </>
                    )
    
                }

            } else {
                // no data was returned 
                return (
                    <Redirect to={`${this.props.location.pathname}/404`}/>
                )
            }

            
        } else {
            return (
                <>
                {userNavbar}
                <Loading></Loading>
                </>
            )
        }
    }

}

export default Assignments