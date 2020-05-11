import React from "react"
import { Container, Row, Col } from 'react-bootstrap'
import { Redirect } from "react-router-dom"
import UserNavbar from "../../../../general/UserNavbar"
import Loading from "../../../../general/Loading"
import CoursePage from "../../../general/CoursePage"
import { portalArchivedCourse } from "../../../apis/portalApis"
import { corsOptionsGET } from "../../../../config/config"

class ArchivedCourse extends React.Component {

    constructor() {
        super()
        this.state = {
            username: null,
            archivedCourse: null,
            isLoading: true
        }
    }

    callAPI() {
        
        fetch(portalArchivedCourse(this.props.match.params.archivedCourse), {
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
               let archivedCourse = data.archivedCourse
               this.setState({
                   username: username,
                   archivedCourse: archivedCourse,
                   isLoading: false
               })
               break;

            case 401:
                this.setState({
                    username: null,
                    archivedCourse: null,
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
                return (
                    <>
                    <UserNavbar isLoggedIn={true} username={this.state.username}></UserNavbar>
                    <CoursePage course={this.state.archivedCourse} showSemester={true}/>
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

export default ArchivedCourse