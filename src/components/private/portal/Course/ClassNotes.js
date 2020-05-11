import React from "react"
import { Container, Row, Col, Alert, Button } from 'react-bootstrap'
import { Redirect } from "react-router-dom";
import UserNavBar from "../../../general/UserNavbar"
import Loading from "../../../general/Loading";
import BasicTable from "../../general/BasicTable"
import AddForm from "../../general/AddForm"
import { portalCourseClassNotes, portalAddClassNote, portalRemoveClassNote } from "../../apis/portalApis"
import { corsOptionsGET, corsOptionsPOST, apiURL } from "../../../config/config"


class ClassNotes extends React.Component {

    constructor() {
        super()
        this.state = {
            username: null,
            isLoading: true,
            classNotes: null,
            plusButtonClicked: false,
            classNoteNameInput: "",
            classNoteDateInput: "",
            classNoteFileInput: null,
            message: null,
            isErrorMessage: null
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.onPlusButtonClick = this.onPlusButtonClick.bind(this)
        this.onDeleteClick = this.onDeleteClick.bind(this)
        this.handleClassNoteNameChange = this.handleClassNoteNameChange.bind(this)
        this.handleDateChange = this.handleDateChange.bind(this)
        this.handleClassNoteFileChange = this.handleClassNoteFileChange.bind(this)
    }

    callAPI() {
        fetch(portalCourseClassNotes(this.props.match.params.course), {
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
               let classNotes = data.classNotes
               this.setState({
                   username: username,
                   classNotes: classNotes,
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

    onDeleteClick(classNoteID, classNoteFileID) {
    
        // send the response to the server 
        fetch(portalRemoveClassNote(), {
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
                course: this.state.classNotes.course,
                classNoteID: classNoteID,
                classNoteFileID: classNoteFileID
            })
        })
        .then(res => this.processResponse(res))
        .then(res => {
            const { statusCode, data } = res;
            this.processDeleteClassNote(statusCode, data)
        })
        .catch(error => {
            console.error(error);
        });

    }

    processDeleteClassNote(statusCode, data) {

        var message;

        switch(statusCode) {
            case 200: 
                message = data.message

                this.setState({
                    classNotes: data.classNotes,
                    plusButtonClicked: false,
                    classNoteNameInput: "",
                    classNoteDateInput: "",
                    classNoteFileInput: null,
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

    // add class note fields

    handleClassNoteNameChange(event) {
        this.setState({classNoteNameInput: event.target.value})
    }

    handleDateChange(date) {
        this.setState({classNoteDateInput: date})
    }

    handleClassNoteFileChange(event) {
        let file = event.target.files[0]
        this.setState({classNoteFileInput: file})
    }

    // submit function

    handleSubmit(event) {
        event.preventDefault()

        let formData = new FormData();
        formData.append('name', this.state.classNoteNameInput)
        formData.append('date', this.state.classNoteDateInput)
        formData.append('uploadFile', this.state.classNoteFileInput)
        formData.append('course', this.state.classNotes.course)

        // send the response to the server 
        fetch(portalAddClassNote(), {
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
                let classNotes = data.classNotes

                this.setState({
                    classNotes: classNotes,
                    isLoading: false,
                    plusButtonClicked: false,
                    classNoteNameInput: "",
                    classNoteDateInput: "",
                    classNoteFileInput: null,
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

            if (this.state.classNotes) {

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
                        controlId: "ClassNoteName",
                        label: "Class Note Name:",
                        type: "text",
                        name: "name",
                        value: this.state.classNoteNameInput,
                        placeholder: "Class Note 1",
                        onChange: this.handleClassNoteNameChange
                    },
                    {
                        controlId: "ClassNoteDate",
                        label: "Class Note Date:",
                        type: "date",
                        name: "date",
                        value: this.state.classNoteDateInput,
                        placeholder: "Select a date",
                        date: this.state.classNoteDateInput,
                        onChange: this.handleDateChange
                    },
                    {
                        controlId: "ClassNoteFile",
                        type: "file",
                        name: "uploadfile",
                        onChange: this.handleClassNoteFileChange
                    },
                    {
                        controlId: "ClassNoteCourse",
                        type: "hidden",
                        name: "course",
                        value: this.state.classNotes.course
                    }
                ]

                let title = "Class Notes for " + this.state.classNotes.fullCourseName + ": " + this.state.classNotes.course
                let tableHeaders = ["Class Note Name", "Note Date", "Options"]
                var tableData = []
                var rowData = {}

                {this.state.classNotes.classNotes.map((classNote, i) => (

                    rowData = <>
                                <td>
                                    <a href={`${apiURL}/teacher/${this.state.username}/course/${this.props.match.params.course}/classNotes/id/${classNote.fileID}/files/${classNote.noteFile}`}>{`${classNote.noteName}`} </a>
                                </td>
                                <td>
                                    {classNote.noteDate ? new Date(classNote.noteDate).toLocaleString() : 'No Date'}
                                </td>
                                <td>
                                    <Button variant="danger" onClick={this.onDeleteClick.bind(this, classNote._id, classNote.fileID)}>Delete</Button>
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
                            buttonName={`add class note`}
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

export default ClassNotes