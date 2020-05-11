import React from "react"
import { Container, Row, Col } from 'react-bootstrap'
import { Redirect } from "react-router-dom"
import UserNavbar from '../../general/UserNavbar' 
import Loading from "../../general/Loading"
import { corsOptionsGET } from "../../config/config"
import { portalCheckUser } from '../../private/apis/portalApis'
import CoursePage from "../general/CoursePage"
import { teacherCourse } from "../apis/teacherApis"

class Course extends React.Component {

    constructor() {
        super()
        this.state = {
            username: null,
            course: null,
            isLoading: true
        }
    }

    callAPI() {
        
        fetch(teacherCourse(this.props.match.params.teacherUsername, this.props.match.params.course))

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
                course: data,
                isLoading: false
            })
        }

        else if (statusCode === 404) {
            this.setState(
                {
                    course: null,
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

            if (this.state.course) {
                return (
                    <>
                    {userNavbar}
                    <CoursePage course={this.state.course} params={this.props.match.params} />
                    </>
                )
            } else {
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

export default Course