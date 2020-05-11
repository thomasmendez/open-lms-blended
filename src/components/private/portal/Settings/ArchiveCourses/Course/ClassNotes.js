import React from "react"
import { Container, Row, Col, Alert, Button } from 'react-bootstrap'
import { Redirect } from "react-router-dom";
import UserNavBar from "../../../../../general/UserNavbar"
import Loading from "../../../../../general/Loading";
import BasicTable from "../../../../general/BasicTable"
import { portalArchivedCourseClassNotes } from "../../../../apis/portalApis"
import { corsOptionsGET, apiURL } from "../../../../../config/config"


class ClassNotes extends React.Component {

    constructor() {
        super()
        this.state = {
            username: null,
            isLoading: true,
            classNotes: null,
        }
    }

    callAPI() {
        fetch(portalArchivedCourseClassNotes(this.props.match.params.archivedCourse), {
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
               let classNotes = data.archivedClassNotes
               this.setState({
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
    
    render() {

        if (!this.state.isLoading) {

            if (this.state.classNotes) {

                let title = "Class Notes for " + this.state.classNotes.fullCourseName + ": " + this.state.classNotes.course + " (" + this.state.classNotes.semester + " " + this.state.classNotes.year + ")"
                let tableHeaders = ["Class Note Name", "Note Date"]
                var tableData = []
                var rowData = {}

                {this.state.classNotes.classNotes.map((classNote, i) => (

                    rowData = <>
                                <td>
                                    <a href={`${apiURL}/portal/archivedCourse/${this.props.match.params.archivedCourse}/classNotes/id/${classNote.fileID}/files/${classNote.noteFile}`}>{`${classNote.noteName}`} </a>
                                </td>
                                <td>
                                    {classNote.noteDate ? new Date(classNote.noteDate).toLocaleString() : 'No Date'}
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

export default ClassNotes