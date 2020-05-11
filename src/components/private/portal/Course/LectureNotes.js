import React from "react"
import { Container, Row, Col, Alert, Button } from 'react-bootstrap'
import { Redirect } from "react-router-dom";
import UserNavBar from "../../../general/UserNavbar"
import Loading from "../../../general/Loading";
import BasicTable from "../../general/BasicTable"
import AddForm from "../../general/AddForm"
import { portalCourseLectureNotes, portalAddLectureNote, portalRemoveLectureNote } from "../../apis/portalApis"
import { corsOptionsGET, corsOptionsPOST, apiURL } from "../../../config/config"


class LectureNotes extends React.Component {

    constructor() {
        super()
        this.state = {
            username: null,
            isLoading: true,
            lectureNotes: null,
            plusButtonClicked: false,
            lectureNoteNameInput: "",
            lectureNoteDateInput: "",
            lectureNoteFileInput: null,
            message: null,
            isErrorMessage: null
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.onPlusButtonClick = this.onPlusButtonClick.bind(this)
        this.onDeleteClick = this.onDeleteClick.bind(this)
        this.handleLectureNoteNameChange = this.handleLectureNoteNameChange.bind(this)
        this.handleDateChange = this.handleDateChange.bind(this)
        this.handleLectureNoteFileChange = this.handleLectureNoteFileChange.bind(this)
    }

    callAPI() {
        fetch(portalCourseLectureNotes(this.props.match.params.course), {
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
               let lectureNotes = data.lectureNotes
               this.setState({
                   username: username,
                   lectureNotes: lectureNotes,
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

    onDeleteClick(lectureNoteID, lectureNoteFileID) {
    
        // send the response to the server 
        fetch(portalRemoveLectureNote(), {
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
                course: this.state.lectureNotes.course,
                lectureNoteID: lectureNoteID,
                lectureNoteFileID: lectureNoteFileID
            })
        })
        .then(res => this.processResponse(res))
        .then(res => {
            const { statusCode, data } = res;
            this.processDeleteLectureNote(statusCode, data)
        })
        .catch(error => {
            console.error(error);
        });

    }

    processDeleteLectureNote(statusCode, data) {

        var message;

        switch(statusCode) {
            case 200: 
                message = data.message

                this.setState({
                    lectureNotes: data.lectureNotes,
                    plusButtonClicked: false,
                    lectureNoteNameInput: "",
                    lectureNoteDateInput: "",
                    lectureNoteFileInput: null,
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

    // add lecture note fields

    handleLectureNoteNameChange(event) {
        this.setState({lectureNoteNameInput: event.target.value})
    }

    handleDateChange(date) {
        this.setState({lectureNoteDateInput: date})
    }

    handleLectureNoteFileChange(event) {
        let file = event.target.files[0]
        this.setState({lectureNoteFileInput: file})
    }

    // submit function

    handleSubmit(event) {
        event.preventDefault()

        let formData = new FormData();
        formData.append('name', this.state.lectureNoteNameInput)
        formData.append('date', this.state.lectureNoteDateInput)
        formData.append('uploadFile', this.state.lectureNoteFileInput)
        formData.append('course', this.state.lectureNotes.course)

        // send the response to the server 
        fetch(portalAddLectureNote(), {
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
                let lectureNotes = data.lectureNotes

                this.setState({
                    lectureNotes: lectureNotes,
                    isLoading: false,
                    plusButtonClicked: false,
                    lectureNoteNameInput: "",
                    lectureNoteDateInput: "",
                    lectureNoteFileInput: null,
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

            if (this.state.lectureNotes) {

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
                        controlId: "LectureNoteName",
                        label: "Lecture Note Name:",
                        type: "text",
                        name: "name",
                        value: this.state.lectureNoteNameInput,
                        placeholder: "Lecture Note 1",
                        onChange: this.handleLectureNoteNameChange
                    },
                    {
                        controlId: "LectureNoteDate",
                        label: "Lecture Note Date:",
                        type: "date",
                        name: "date",
                        value: this.state.lectureNoteDateInput,
                        placeholder: "Select a date",
                        date: this.state.lectureNoteDateInput,
                        onChange: this.handleDateChange
                    },
                    {
                        controlId: "LectureNoteFile",
                        type: "file",
                        name: "uploadfile",
                        onChange: this.handleLectureNoteFileChange
                    },
                    {
                        controlId: "LectureNoteCourse",
                        type: "hidden",
                        name: "course",
                        value: this.state.lectureNotes.course
                    }
                ]

                let title = "Lecture Notes for " + this.state.lectureNotes.fullCourseName + ": " + this.state.lectureNotes.course
                let tableHeaders = ["Lecture Note Name", "Note Date", "Options"]
                var tableData = []
                var rowData = {}

                {this.state.lectureNotes.lectureNotes.map((lectureNote, i) => (

                    rowData = <>
                                <td>
                                    <a href={`${apiURL}/teacher/${this.state.username}/course/${this.props.match.params.course}/lectureNotes/id/${lectureNote.fileID}/files/${lectureNote.noteFile}`}>{`${lectureNote.noteName}`} </a>
                                </td>
                                <td>
                                    {lectureNote.noteDate ? new Date(lectureNote.noteDate).toLocaleString(): 'No Date'}
                                </td>
                                <td>
                                    <Button variant="danger" onClick={this.onDeleteClick.bind(this, lectureNote._id, lectureNote.fileID)}>Delete</Button>
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
                            buttonName={`add lecture note`}
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

export default LectureNotes