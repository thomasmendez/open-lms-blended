import React from "react"
import { Container, Row, Col, Alert, Form, Button } from 'react-bootstrap'
import { Redirect } from "react-router-dom"
import settingsCSS from "../../../../css/general/arrows.css"
import {
    BrowserView,
    MobileView,
    isBrowser,
    isMobile
} from "react-device-detect";
import UserNavbar from "../../../../general/UserNavbar"
import SettingsBar from "../../../general/SettingsBar"
import SettingsHeader from "../../../general/SettingsHeading"
import Loading from "../../../../general/Loading"
import { portalSettingsEmail, portalSettingsUpdateEmail } from "../../../apis/portalApis"
import { corsOptionsGET, corsOptionsPOST } from "../../../../config/config"

import { validateEmail } from "../../../../general/validator"

class Email extends React.Component {

    constructor() {
        super()
        this.state = {
            username: null,
            currentEmail: null,
            email: "",
            emailInfoText: "",
            isEmailValid: null,
            currentPassword: "",
            currentPasswordInfoText: "",
            isCurrentPasswordValid: null,
            isLoading: true,
            isFormValid: false,
            message: "",
            isErrorMessage: null
        }

        this.handleEmailChange = this.handleEmailChange.bind(this)
        this.handleEmailBlur = this.handleEmailBlur.bind(this)
        this.handleCurrentPasswordChange = this.handleCurrentPasswordChange.bind(this)
        this.handleCurrentPasswordBlur = this.handleCurrentPasswordBlur.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

        this.isFormValid = this.isFormValid.bind(this);
    }

    callAPI() {
        
        fetch((portalSettingsEmail()), {
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
                let currentEmail = data.currentEmail
                this.setState({
                    username: validUsername,
                    currentEmail: currentEmail,
                    isLoading: false
                })
                break;

            case 401:
                this.setState({
                    username: null,
                    currentEmail: null,
                    isLoading: false
                })
                this.props.history.push('/login')
                break;

            default: 
                console.log("unregistered status code")
        }
    }

    // input functions

    handleEmailChange(event) {
        let enteredEmail = event.target.value
        let result = validateEmail(enteredEmail)
        if (result.isValid) {
            this.setState({
                email: enteredEmail,
                emailInfoText: "",
                isEmailValid: true
            }, function() {
                this.isFormValid()
            })
        } else {
            this.setState({
                email: enteredEmail,
                isEmailValid: false
            }, function() {
                this.isFormValid()
            })
        }
    }

    handleEmailBlur(event) {
        let enteredEmail = event.target.value
        if (enteredEmail === "") {
            this.setState({
                emailInfoText: "",
                isEmailValid: false
            }, function () {
                this.isFormValid()
            })
            return  
        }
        let result = validateEmail(enteredEmail)
        if (result.isValid) {
            this.setState({
                email: enteredEmail,
                emailInfoText: result.infoText,
                isEmailValid: true
            }, function() {
                this.isFormValid()
            })
        } else {
            this.setState({
                email: enteredEmail,
                emailInfoText: result.infoText,
                isEmailValid: false
            }, function() {
                this.isFormValid()
            })
        }
    }

    handleCurrentPasswordChange(event) {
        let enteredPassword = event.target.value
        this.setState({
            currentPassword: enteredPassword,
            currentPasswordInfoText: "",
            isCurrentPasswordValid: true
        }, function () {
            this.isFormValid()
        })
    }

    handleCurrentPasswordBlur(event) {
        let enteredPassword = event.target.value
        if (enteredPassword === "") {
            this.setState({
                currentPasswordInfoText: "",
                isCurrentPasswordValid: false
            }, function () {
                this.isFormValid()
            })
        } else {
            this.setState({
                currentPassword: enteredPassword,
                isCurrentPasswordValid: true
            }, function () {
                this.isFormValid()
            })
        }
    }

    isFormValid() {
        if (this.state.isEmailValid &&
            this.state.isCurrentPasswordValid) {
                this.setState({
                    isFormValid: true
                })
        } else {
            this.setState({
                isFormValid: false
            })
        }
    }

    // form submit

    handleSubmit(event) {
        event.preventDefault()

        fetch(portalSettingsUpdateEmail(), {
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
                email: this.state.email,
                currentPassword: this.state.currentPassword,
            })
        })
        .then(res => this.processResponse(res))
        .then(res => {
            const { statusCode, data } = res;
            this.processSubmitData(statusCode, data)
        })
        .catch(error => {
            console.error("error: " + error);
        });
    }

    processSubmitData(statusCode, data) {
        var message;
        var formData;
        var errors;

        switch(statusCode) {

            case 200:
                message = data.message
                let email = data.email
                this.setState({
                    currentEmail: email,
                    email: "",
                    isEmailValid: null,
                    currentPassword: "",
                    isCurrentPasswordValid: null,
                    isFormValid: false,
                    message: message,
                    isErrorMessage: false
                })
                break;

            case 401:
                message = data.message
                formData = data.formData
                errors = data.errors
                this.setState({
                    message: message,
                    email: formData.email,
                    currentPassword: formData.currentPassword,
                    currentPasswordInfoText: errors.currentPassword,
                    isFormValid: false,
                    isErrorMessage: true
                })
                break;

            case 422:
                message = data.message
                formData = data.formData
                errors = data.errors
                this.setState({
                    message: message,
                    email: formData.email,
                    emailInfoText: errors.email,
                    currentPassword: formData.currentPassword,
                    isFormValid: false,
                    isErrorMessage: true
                })
                break;
            case 500:
                message = data.message
                formData = data.formData
                this.setState({
                    message: message,
                    email: formData.email,
                    currentPassword: formData.currentPassword,
                    isErrorMessage: true
                })
                break;
            default: 
                console.log("unregistered status code")
        }
    }
    
    render() {

        if (!this.state.isLoading) {

            if (this.state.username) {

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

                let errorInputStyle = {'borderColor': 'red'}
                let defaultInputStyle = {'borderColor': '#ced4da'}

                var emailInputStyle;

                if (this.state.emailInfoText) {
                    emailInputStyle = errorInputStyle
                } else {
                    emailInputStyle = defaultInputStyle
                }

                var confirmedPasswordInputStyle;

                if (this.state.currentPasswordInfoText) {
                    confirmedPasswordInputStyle = errorInputStyle
                } else {
                    confirmedPasswordInputStyle = defaultInputStyle
                }

                if (isMobile) { 

                    return (
                        <>
                        <UserNavbar isLoggedIn={true} username={this.state.username}></UserNavbar>
                        <Container fluid>
                            <Row>
                                <Col xs={4}>
                                    <h3>Settings</h3>
                                </Col>
                                <Col xs={7}>
                                    <SettingsHeader title={"Change Email"}></SettingsHeader>
                                </Col>
                            </Row>
    
                            <Row>
                                <Col xs={4}>
                                    <SettingsBar section={"account"}></SettingsBar>
                                </Col>
                                <Col xs={7}>
                                    <p>Current Email: {`${this.state.currentEmail}`}</p>
    
                                    {alert}
                                    <Form onSubmit={this.handleSubmit}>
                    
                                        <Row>
                                            <Col ms={6}>
                                                <Form.Group controlId="Email">
                                                    <Form.Label>Email:</Form.Label>
                                                    <Form.Control
                                                        required
                                                        type="email"
                                                        name="email"
                                                        value={this.state.email}
                                                        placeholder="New email"
                                                        onChange={this.handleEmailChange}
                                                        onBlur={this.handleEmailBlur}
                                                        style={emailInputStyle}
                                                    >
                                                    </Form.Control>
                                                    <Form.Text className="text-danger">
                                                        {this.state.emailInfoText}
                                                    </Form.Text>
                                                </Form.Group>
                                            </Col>
                                        </Row>
    
                                        <Row>
                                            <Col ms={6}>
                                                <Form.Group controlId="CurrentPassword">
                                                    <Form.Label>Current Password:</Form.Label>
                                                    <Form.Control
                                                        required
                                                        type="password"
                                                        name="currentPassword"
                                                        value={this.state.currentPassword}
                                                        placeholder="Current password"
                                                        onChange={this.handleCurrentPasswordChange}
                                                        onBlur={this.handleCurrentPasswordBlur}
                                                        style={confirmedPasswordInputStyle}
                                                    >
                                                    </Form.Control>
                                                    <Form.Text className="text-danger">
                                                        {this.state.currentPasswordInfoText}
                                                    </Form.Text>
                                                </Form.Group>
                                            </Col>
                                        </Row>
    
                                        <Row>
                                            <Col sm={12}>
                                                <Button variant="primary" type="submit" disabled={!this.state.isFormValid}>
                                                    Update email
                                                </Button>
                                            </Col>
                                        </Row>
                                        
                                    </Form>
    
                                </Col>
                            </Row>
                        </Container>
                        </>
                    )

                } else {

                    return (
                        <>
                        <UserNavbar isLoggedIn={true} username={this.state.username}></UserNavbar>
                        <Container fluid>
                            <Row>
                                <Col xs={3}>
                                    <h3>Settings</h3>
                                </Col>
                                <Col xs={6}>
                                    <SettingsHeader title={"Change Email"}></SettingsHeader>
                                </Col>
                            </Row>
    
                            <Row>
                                <Col xs={3}>
                                    <SettingsBar section={"account"}></SettingsBar>
                                </Col>
                                <Col xs={6}>
                                    <p>Current Email: {`${this.state.currentEmail}`}</p>
    
                                    {alert}
                                    <Form onSubmit={this.handleSubmit}>
                    
                                        <Row>
                                            <Col ms={6}>
                                                <Form.Group controlId="Email">
                                                    <Form.Label>Email:</Form.Label>
                                                    <Form.Control
                                                        required
                                                        type="email"
                                                        name="email"
                                                        value={this.state.email}
                                                        placeholder="New email"
                                                        onChange={this.handleEmailChange}
                                                        onBlur={this.handleEmailBlur}
                                                        style={emailInputStyle}
                                                    >
                                                    </Form.Control>
                                                    <Form.Text className="text-danger">
                                                        {this.state.emailInfoText}
                                                    </Form.Text>
                                                </Form.Group>
                                            </Col>
                                        </Row>
    
                                        <Row>
                                            <Col ms={6}>
                                                <Form.Group controlId="CurrentPassword">
                                                    <Form.Label>Current Password:</Form.Label>
                                                    <Form.Control
                                                        required
                                                        type="password"
                                                        name="currentPassword"
                                                        value={this.state.currentPassword}
                                                        placeholder="Current password"
                                                        onChange={this.handleCurrentPasswordChange}
                                                        onBlur={this.handleCurrentPasswordBlur}
                                                        style={confirmedPasswordInputStyle}
                                                    >
                                                    </Form.Control>
                                                    <Form.Text className="text-danger">
                                                        {this.state.currentPasswordInfoText}
                                                    </Form.Text>
                                                </Form.Group>
                                            </Col>
                                        </Row>
    
                                        <Row>
                                            <Col sm={12}>
                                                <Button variant="primary" type="submit" disabled={!this.state.isFormValid}>
                                                    Update email
                                                </Button>
                                            </Col>
                                        </Row>
                                        
                                    </Form>
    
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
                <Loading></Loading>
            )
        }
    }

}

export default Email