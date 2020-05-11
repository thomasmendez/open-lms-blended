import React from "react"
import { Container, Row, Col, Alert, Button } from 'react-bootstrap'
import { Redirect } from "react-router-dom";
import UserNavBar from "../../../general/UserNavbar"
import Loading from "../../../general/Loading";
import BasicTable from "../../general/BasicTable"
import AddForm from "../../general/AddForm"
import { portalCourseOtherNotes, portalAddOtherNote, portalRemoveOtherNote } from "../../apis/portalApis"
import { corsOptionsGET, corsOptionsPOST, apiURL } from "../../../config/config"


class OtherNotes extends React.Component {

    constructor() {
        super()
        this.state = {
            username: null,
            isLoading: true,
            otherNotes: null,
            plusButtonClicked: false,
            otherNoteNameInput: "",
            otherNoteDateInput: "",
            otherNoteFileInput: null,
            message: null,
            isErrorMessage: null
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.onPlusButtonClick = this.onPlusButtonClick.bind(this)
        this.onDeleteClick = this.onDeleteClick.bind(this)
        this.handleOtherNoteNameChange = this.handleOtherNoteNameChange.bind(this)
        this.handleDateChange = this.handleDateChange.bind(this)
        this.handleOtherNoteFileChange = this.handleOtherNoteFileChange.bind(this)
    }

    callAPI() {
        fetch(portalCourseOtherNotes(this.props.match.params.course), {
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
               let otherNotes = data.otherNotes
               this.setState({
                   username: username,
                   otherNotes: otherNotes,
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

    onDeleteClick(otherNoteID, otherNoteFileID) {
    
        // send the response to the server 
        fetch(portalRemoveOtherNote(), {
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
                course: this.state.otherNotes.course,
                otherNoteID: otherNoteID,
                otherNoteFileID: otherNoteFileID
            })
        })
        .then(res => this.processResponse(res))
        .then(res => {
            const { statusCode, data } = res;
            this.processDeleteotherNote(statusCode, data)
        })
        .catch(error => {
            console.error(error);
        });

    }

    processDeleteotherNote(statusCode, data) {

        var message;

        switch(statusCode) {
            case 200: 
                message = data.message
                let otherNotes = data.otherNotes

                this.setState({
                    otherNotes: otherNotes,
                    plusButtonClicked: false,
                    otherNoteNameInput: "",
                    otherNoteDateInput: "",
                    otherNoteFileInput: null,
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

    // add other note fields

    handleOtherNoteNameChange(event) {
        this.setState({otherNoteNameInput: event.target.value})
    }

    handleDateChange(date) {
        this.setState({otherNoteDateInput: date})
    }

    handleOtherNoteFileChange(event) {
        let file = event.target.files[0]
        this.setState({otherNoteFileInput: file})
    }

    // submit function

    handleSubmit(event) {
        event.preventDefault()

        let formData = new FormData();
        formData.append('name', this.state.otherNoteNameInput)
        formData.append('date', this.state.otherNoteDateInput)
        formData.append('uploadFile', this.state.otherNoteFileInput)
        formData.append('course', this.state.otherNotes.course)

        // send the response to the server 
        fetch(portalAddOtherNote(), {
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
                let otherNotes = data.otherNotes

                this.setState({
                    otherNotes: otherNotes,
                    isLoading: false,
                    plusButtonClicked: false,
                    otherNoteNameInput: "",
                    otherNoteDateInput: "",
                    otherNoteFileInput: null,
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

            if (this.state.otherNotes) {

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
                        controlId: "OtherNoteName",
                        label: "Other Note Name:",
                        type: "text",
                        name: "name",
                        value: this.state.otherNoteNameInput,
                        placeholder: "Other Note 1",
                        onChange: this.handleOtherNoteNameChange
                    },
                    {
                        controlId: "OtherNoteDate",
                        label: "Other Note Date:",
                        type: "date",
                        name: "date",
                        value: this.state.otherNoteDateInput,
                        placeholder: "Select a date",
                        date: this.state.otherNoteDateInput,
                        onChange: this.handleDateChange
                    },
                    {
                        controlId: "OtherNoteFile",
                        type: "file",
                        name: "uploadfile",
                        onChange: this.handleOtherNoteFileChange
                    },
                    {
                        controlId: "OtherNoteCourse",
                        type: "hidden",
                        name: "course",
                        value: this.state.otherNotes.course
                    }
                ]

                let title = "Other Notes for " + this.state.otherNotes.fullCourseName + ": " + this.state.otherNotes.course
                let tableHeaders = ["Other Note Name", "Note Date", "Options"]
                var tableData = []
                var rowData = {}

                {this.state.otherNotes.otherNotes.map((otherNote, i) => (

                    rowData = <>
                                <td>
                                    <a href={`${apiURL}/teacher/${this.state.username}/course/${this.props.match.params.course}/otherNotes/id/${otherNote.fileID}/files/${otherNote.noteFile}`}>{`${otherNote.noteName}`} </a>
                                </td>
                                <td>
                                    {otherNote.noteDate ? new Date(otherNote.noteDate).toLocaleString() : 'No Date'}
                                </td>
                                <td>
                                    <Button variant="danger" onClick={this.onDeleteClick.bind(this, otherNote._id, otherNote.fileID)}>Delete</Button>
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
                            buttonName={`add other note`}
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

export default OtherNotes