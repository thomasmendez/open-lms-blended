import React from "react"
import { Container, Row, Col } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'
import UserNavbar from '../general/UserNavbar'
import Loading from '../general/Loading'
import { corsOptionsGET } from "../config/config"
import { portalCheckUser } from '../private/apis/portalApis'
import config from 'config'
import { teacherDirectory } from './apis/teacherApis'

class Home extends React.Component {

    constructor() {
        super()
        this.state = {
            username: null,
            data: null,
            teachers: [],
            isLoading: true,
            message: null
        }
    }

    callAPI() {
        fetch(teacherDirectory())
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
            case 401:
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
        var teachers
        var data
        switch(statusCode) {
            case 200:
                teachers = data.teachers

                let horizontalDividers = []

                var data = []
                var rowData

                let style = {
                    "marginTop": "0.0rem",
                    "marginBottom": "0.5rem",
                    "border": "0",
                    "borderTop": "1px solid rgba(0,0,0,.1)"
                }

                for (var i = 0; i < teachers.length; i++) {
                    let teacher = teachers[i]
                    let name = teacher.firstName
                    let firstChar = name[0].toUpperCase()
                    if (!horizontalDividers.includes(firstChar)) {
                        horizontalDividers.push(firstChar)

                        rowData = <div key={`teacher-${teacher.username}`}>
                                      <div>
                                          <h5 style={{"marginTop":"0.5rem"}}>{firstChar}</h5>
                                            <hr style={style}></hr>
                                        </div>
                                      <div><a href={`/teacher/${teacher.username}`}>{`${teacher.firstName} ${teacher.lastName}`}</a></div>
                                  </div>,

                        data.push(rowData)

                    } else {

                        rowData = <div key={`teacher-${teacher.username}`}>
                                      <div><a href={`/teacher/${teacher.username}`}>{`${teacher.firstName} ${teacher.lastName}`}</a></div>
                                  </div>,

                        data.push(rowData)

                    }
                }

                this.setState({
                    data: data,
                    teachers: teachers,
                    isLoading: false
                })
                
                break;
            case 500:
                this.setState({
                    message: data.message,
                    isLoading: false
                })
                break;
            default:
                console.log("unregistered status code")
        }
    }
    
    render() {

        var userNavbar = <UserNavbar></UserNavbar>

        if (this.state.username) {
            userNavbar = <UserNavbar isLoggedIn={true} username={this.state.username}></UserNavbar>
        }

        if (!this.state.isLoading) {

            if (this.state.teachers) {
                
                return (
                    <>
                    {userNavbar}
                    <Container fluid>
                        <Row>
                            <Col xs={12}>
                                <h3>{`${config.institutionName}`}</h3>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <h4>Teacher Directory</h4>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                {this.state.data.map((rowData, i) => (
                                    <div key={`teacher-${i}`}>
                                        {rowData}
                                    </div>
                                ))}
                            </Col>
                        </Row>
                    </Container>
                    </>
                )

            } else {

                var alert
                if (this.state.message == false) {
                    alert = <Alert variant="danger">
                                {`${this.state.message}`}
                            </Alert>
                }

                return (
                    <>
                    {userNavbar}
                    <Container fluid>
                        <Row>
                            <Col xs={12}>
                                {alert}
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <h3>{`${config.institutionName}`}</h3>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <h4>Teachers</h4>
                            </Col>
                        </Row>
                    </Container>
                    </>
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