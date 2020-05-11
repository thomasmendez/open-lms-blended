import React from "react"
import { Container, Row, Col, Alert, Button } from 'react-bootstrap'
import { Redirect } from "react-router-dom";
import UserNavBar from "../../../general/UserNavbar"
import Loading from "../../../general/Loading"
import BasicTable from "../../general/BasicTable"
import AddForm from "../../general/AddForm"
import { portalCourseAssignments, portalAddAssignment, portalRemoveAssignment } from "../../apis/portalApis"
import { corsOptionsGET, corsOptionsPOST, apiURL } from "../../../config/config"

class Assignments extends React.Component {

    constructor() {
        super()
        this.state = {
            username: null,
            isLoading: true,
            assignments: null,
            plusButtonClicked: false,
            assignmentNameInput: "",
            assignmentDateInput: "",
            assignemntFileInput: null,
            message: null,
            isErrorMessage: null
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.onPlusButtonClick = this.onPlusButtonClick.bind(this)
        this.onDeleteClick = this.onDeleteClick.bind(this)
        this.handleAssignmentNameChange = this.handleAssignmentNameChange.bind(this)
        this.handleDueDateChange = this.handleDueDateChange.bind(this)
        this.handleAssignmentFileChange = this.handleAssignmentFileChange.bind(this)
    }

    callAPI() {
        fetch(portalCourseAssignments(this.props.match.params.course), {
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
               console.log("username: " + username)
               let assignments = data.assignments
               console.log("assignments: " + assignments)
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

    // button functions

    onPlusButtonClick(event) {

        event.preventDefault()

        // check if + is hit first
        if (!this.state.plusButtonClicked) {
            // open the form 
            this.setState({plusButtonClicked: true})
        }        
    }

    onDeleteClick(assignmentID, assignmentFileID) {
    
        // send the response to the server 
        fetch(portalRemoveAssignment(), {
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
                course: this.state.assignments.course,
                assignmentID: assignmentID,
                assignmentFileID: assignmentFileID
            })
        })
        .then(res => this.processResponse(res))
        .then(res => {
            const { statusCode, data } = res;
            this.processDeleteAssignment(statusCode, data)
        })
        .catch(error => {
            console.error(error);
        });

    }

    processDeleteAssignment(statusCode, data) {

        var message;

        switch(statusCode) {
            case 200: 
                message = data.message

                this.setState({
                    assignments: data.assignments,
                    plusButtonClicked: false,
                    assignmentNameInput: "",
                    assignmentDateInput: "",
                    assignemntFileInput: null,
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

    // add assignment fields

    handleAssignmentNameChange(event) {
        this.setState({assignmentNameInput: event.target.value})
    }

    handleDueDateChange(date) {
        this.setState({assignmentDateInput: date})
    }

    handleAssignmentFileChange(event) {
        let file = event.target.files[0]
        this.setState({assignemntFileInput: file})
    }

    // submit function

    handleSubmit(event) {
        event.preventDefault()

        let formData = new FormData();
        formData.append('name', this.state.assignmentNameInput)
        formData.append('date', this.state.assignmentDateInput)
        formData.append('uploadFile', this.state.assignemntFileInput)
        formData.append('course', this.state.assignments.course)

        // send the response to the server 
        fetch(portalAddAssignment(), {
            method: corsOptionsPOST.method, 
            mode: corsOptionsPOST.mode,
            credentials: corsOptionsPOST.credentials,
            headers: { 
                "Access-Control-Allow-Origin": corsOptionsPOST.headers["Access-Control-Allow-Origin"],
                "Access-Control-Allow-Methods": corsOptionsPOST.headers["Access-Control-Allow-Methods"],
                "Access-Control-Allow-Credentials": corsOptionsPOST.headers["Access-Control-Allow-Credentials"]
            },
            body: formData
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
                let assignments = data.assignments

                this.setState({
                    assignments: assignments,
                    isLoading: false,
                    plusButtonClicked: false,
                    assignmentNameInput: "",
                    assignmentDateInput: "",
                    assignemntFileInput: null,
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

            case 505:
            
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

            if (this.state.assignments) {

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

                let formGroups = [
                    {
                        controlId: "AssignmentName",
                        label: "Assignment Name:",
                        type: "text",
                        name: "name",
                        value: this.state.assignmentNameInput,
                        placeholder: "Assignment 1",
                        onChange: this.handleAssignmentNameChange
                    },
                    {
                        controlId: "AssignmentDueDate",
                        label: "Assignment Due Date:",
                        type: "date",
                        name: "date",
                        value: this.state.assignmentDateInput,
                        placeholder: "Select a date",
                        date: this.state.assignmentDateInput,
                        onChange: this.handleDueDateChange
                    },
                    {
                        controlId: "AssignmentFile",
                        type: "file",
                        name: "uploadfile",
                        onChange: this.handleAssignmentFileChange
                    },
                    {
                        controlId: "AssignmentCourse",
                        type: "hidden",
                        name: "course",
                        value: this.state.assignments.course
                    }
                ]

                let title = "Assignments for " + this.state.assignments.fullCourseName + ": " + this.state.assignments.course
                let tableHeaders = ["Assignment Name", "Due Date", "Options"]
                var tableData = []
                var rowData = {}

                {this.state.assignments.assignments.map((assignment, i) => (

                    rowData = <>
                                <td>
                                    <a href={`${apiURL}/teacher/${this.props.match.params.username}/course/${this.props.match.params.course}/assignments/id/${assignment.fileID}/files/${assignment.assignmentFile}`}>{`${assignment.assignmentName}`} </a>
                                </td>
                                <td>
                                    {assignment.dueDate ? new Date(assignment.dueDate).toLocaleString(): 'No Due Date'}
                                </td>
                                <td>
                                    <Button variant="danger" onClick={this.onDeleteClick.bind(this, assignment._id, assignment.fileID)}>Delete</Button>
                                </td>
                              </>,

                    tableData.push(rowData)

                ))}

                return (
                    <>
                    <UserNavBar isLoggedIn={true} username={this.state.username}></UserNavBar>
                    <Container fluid>
                        {alert}
                        <BasicTable title={title} tableHeaders={tableHeaders} tableData={tableData}/>
                        <AddForm 
                            pressed={this.state.plusButtonClicked} 
                            handleSubmit={this.handleSubmit}
                            formGroups={formGroups}
                            buttonName={`add assignment`}
                            onClick={this.onPlusButtonClick}
                        >
                        </AddForm>

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