import React from "react"
import { Container, Row, Col, ListGroup } from 'react-bootstrap'
import { Redirect } from "react-router-dom"
import arrowsCSS from "../../../css/general/arrows.css"
import {
    BrowserView,
    MobileView,
    isBrowser,
    isMobile
} from "react-device-detect";
import UserNavbar from "../../../general/UserNavbar"
import SettingsBar from "../../general/SettingsBar"
import Loading from "../../../general/Loading"
import { portalSettings } from "../../apis/portalApis"
import { corsOptionsGET } from "../../../config/config"

class Settings extends React.Component {

    constructor() {
        super()
        this.state = {
            validUsername: null,
            isLoading: true
        }
    }

    callAPI() {
        
        fetch(portalSettings(), {
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
                let validUsername = data.validUsername
                this.setState({
                    username: validUsername,
                    isLoading: false
                })
                break;

            case 401:
                this.setState({
                    username: null,
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

                if (isMobile) {

                    let style = {"width":"100%"}
                
                    return (
                        <>
                        <UserNavbar isLoggedIn={true} username={this.state.username}></UserNavbar>
                        <Container fluid>
                            <Row>
                                <Col xs={4}>
                                    <h3>Settings</h3>
                                </Col>
                                <Col xs={8}>
                                    <h3>Manage Account</h3>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={4}>
                                    <SettingsBar section={"account"}></SettingsBar>
                                </Col>
                                <Col xs={8}>
                                    <ListGroup style={style}>
                                      <ListGroup.Item action href={`email`}>
                                        Email
                                        <i className="right"></i>
                                      </ListGroup.Item>
                                      <ListGroup.Item action href={`semester`}>
                                        Semester
                                        <i className="right"></i>
                                      </ListGroup.Item>
                                      <ListGroup.Item action href={`password`}>
                                        Password
                                        <i className="right"></i>
                                      </ListGroup.Item>
                                      <ListGroup.Item action variant="danger" href={`deleteAccount`}>
                                        Delete Account
                                        <i className="right"></i>
                                      </ListGroup.Item>
                                    </ListGroup>
                                </Col>
                            </Row>
                        </Container>
                        </>
                    )

                } else {

                    let style = {"width":"50%"}
                
                    return (
                        <>
                        <UserNavbar isLoggedIn={true} username={this.state.username}></UserNavbar>
                        <Container fluid>
                            <Row>
                                <Col xs={3}>
                                    <h3>Settings</h3>
                                </Col>
                                <Col xs={9}>
                                    <h3>Manage Account</h3>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={3}>
                                    <SettingsBar section={"account"}></SettingsBar>
                                </Col>
                                <Col xs={9}>
                                    <ListGroup style={style}>
                                      <ListGroup.Item action href={`email`}>
                                        Email
                                        <i className="right"></i>
                                      </ListGroup.Item>
                                      <ListGroup.Item action href={`semester`}>
                                        Semester
                                        <i className="right"></i>
                                      </ListGroup.Item>
                                      <ListGroup.Item action href={`password`}>
                                        Password
                                        <i className="right"></i>
                                      </ListGroup.Item>
                                      <ListGroup.Item action variant="danger" href={`deleteAccount`}>
                                        Delete Account
                                        <i className="right"></i>
                                      </ListGroup.Item>
                                    </ListGroup>
                                </Col>
                            </Row>
                        </Container>
                        </>
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
                <Loading></Loading>
                </>
            )
        }
    }

}

export default Settings