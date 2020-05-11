import React from "react"
import { Container, Row, Col } from 'react-bootstrap'
import { Redirect } from "react-router-dom"
import UserNavbar from '../../general/UserNavbar'
import Loading from "../../general/Loading"
import { corsOptionsGET } from "../../config/config"
import { portalCheckUser } from '../../private/apis/portalApis'
import config from 'config'
import { teacherHome } from "../apis/teacherApis"

class Home extends React.Component {

    constructor() {
        super()
        this.state = {
            username: null,
            teacher: {
                courses: []
            }
        }
    }

    callAPI() {
        fetch(teacherHome(this.props.match.params.teacherUsername))
            .then(res => res.json())
            .then(data => this.obtainData(data))
            .then(teacher => this.setState({teacher: teacher}))
            .catch(error => {
              console.error("error: " + error)
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
            case 401:
                this.setState({
                    isLoading: false,
                    username: null
                })
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
        switch(statusCode) {
            case 200:
                this.setState({
                    teacher: data,
                    isLoading: false
                })
                break;
            case 404:
                this.setState(
                    {
                        teacher: null,
                        isLoading: false
                    }
                )
                break;
            default:
                console.log("unregistered status code")
        }
    }

    obtainData(jsonData) {
        
        return new Promise((resolve, reject) => {

            var teacher = jsonData
            
            resolve(teacher)
            
        })
    }
    
    render() {

        var userNavbar = <UserNavbar></UserNavbar>

        if (this.state.username) {
            userNavbar = <UserNavbar isLoggedIn={true} username={this.state.username}></UserNavbar>
        }

        if (!this.state.isLoading) {

            if (this.state.teacher) {

                if (this.state.teacher.courses) {

                    return (
                        <>
                        {userNavbar}
                        <Container fluid>
                            <Row>
                                <Col xs={12}>
                                    <h3>{`${this.state.teacher.firstName} ${this.state.teacher.lastName}`}</h3>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <h4>{`${config.institutionName}`}</h4>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <h5>{`Classes (${this.state.teacher.semester} ${this.state.teacher.year})`}</h5>
                                </Col>
                            </Row>
                            {this.state.teacher.courses.map((course, i) => (
                                <div key={`course-${course.course}`}>
                                    <div><a href={`/teacher/${this.props.match.params.teacherUsername}/course/${course.course}`}>{`${course.fullCourseName}: ${course.course}`}</a></div>
                                </div>
                            ))}
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

export default Home