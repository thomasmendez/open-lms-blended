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
import { portalSettingsPassword, portalSettingsUpdatePassword } from "../../../apis/portalApis"
import { corsOptionsGET, corsOptionsPOST } from "../../../../config/config"
import { validatePassword, validateConfirmedPassword } from "../../../../general/validator"

class Password extends React.Component {

    constructor() {
        super()
        this.state = {
            username: null,
            currentPassword: "",
            currentPasswordInfoText: "",
            isCurrentPasswordValid: null,
            newPassword: "",
            newPasswordInfoText: "Requires 1 lower, 1 upper, 1 digit, 1 special character, and must be at least 6 characters long",
            isNewPasswordValid: null,
            confirmedNewPassword: "",
            confirmedNewPasswordInfoText: "",
            isConfirmedNewPasswordValid: null,
            isLoading: true,
            isFormValid: false,
            message: "",
            isErrorMessage: null
        }

        this.handleCurrentPasswordChange = this.handleCurrentPasswordChange.bind(this)
        this.handleCurrentPasswordBlur = this.handleCurrentPasswordBlur.bind(this)

        this.handleNewPasswordChange = this.handleNewPasswordChange.bind(this)
        this.handleNewPasswordBlur = this.handleNewPasswordBlur.bind(this)

        this.handleConfirmedNewPasswordChange = this.handleConfirmedNewPasswordChange.bind(this)
        this.handleConfirmedNewPasswordBlur = this.handleConfirmedNewPasswordBlur.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

        this.isPasswordsMatching = this.isPasswordsMatching.bind(this)
        this.isFormValid = this.isFormValid.bind(this);
    }

    callAPI() {
        
        fetch((portalSettingsPassword()), {
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
                    currentSemester: null,
                    currentYear: null,
                    isLoading: false
                })
                this.props.history.push('/login')
                break;

            default: 
                console.log("unregistered status code")
        }
    }

    // input functions

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

    handleNewPasswordChange(event) {
        let enteredPassword = event.target.value
        if (enteredPassword === "") {
            this.setState({
                newPassword: enteredPassword,
                newPasswordInfoText: "Requires 1 lower, 1 upper, 1 digit, 1 special character, and must be at least 6 characters long",
                isNewPasswordValid: null
            }, function () {
                this.isFormValid()
            })
            return 
        }
        let result = validatePassword(enteredPassword)
        if (result.isValid) {
            this.setState({
                newPassword: enteredPassword,
                newPasswordInfoText: result.infoText,
                isNewPasswordValid: true
            }, function() {
                if (this.state.confirmedNewPassword) {
                    this.isPasswordsMatching(this.state.newPassword, this.state.confirmedNewPassword)
                } else {
                    this.isFormValid()
                }
            })
        } else {
            this.setState({
                newPassword: enteredPassword,
                passwordInfoText: "Requires 1 lower, 1 upper, 1 digit, 1 special character, and must be at least 6 characters long",
                isNewPasswordValid: null
            }, function() {
                if (this.state.confirmedNewPassword) {
                    this.isPasswordsMatching(this.state.newPassword, this.state.confirmedNewPassword)
                } else {
                    this.isFormValid()
                }
            })
        }
    }

    handleNewPasswordBlur(event) {
        let enteredPassword = event.target.value
        if (enteredPassword === "") {
            this.setState({
                newPassword: enteredPassword,
                newPasswordInfoText: "Requires 1 lower, 1 upper, 1 digit, 1 special character, and must be at least 6 characters long",
                isNewPasswordValid: null
            }, function () {
                this.isFormValid()
            })
            return 
        }
        let result = validatePassword(enteredPassword)
        if (result.isValid) {
            this.setState({
                newPassword: enteredPassword,
                newPasswordInfoText: result.infoText,
                isNewPasswordValid: true
            }, function() {
                if (this.state.confirmedNewPassword) {
                    this.isPasswordsMatching(this.state.newPassword, this.state.confirmedNewPassword)
                } else {
                    this.isFormValid()
                }
            })
        } else {
            this.setState({
                newPassword: enteredPassword,
                newPasswordInfoText: result.infoText,
                isNewPasswordValid: false
            }, function() {
                if (this.state.confirmedNewPassword) {
                    this.isPasswordsMatching(this.state.newPassword, this.state.confirmedNewPassword)
                } else {
                    this.isFormValid()
                }
            })
        }
    }

    handleConfirmedNewPasswordChange(event) {
        let enteredConfirmedNewPassword = event.target.value
        if (enteredConfirmedNewPassword === "") {
            this.setState({
                confirmedNewPassword: enteredConfirmedNewPassword,
                confirmedNewPasswordInfoText: "",
                isConfirmedNewPasswordValid: false
            }, function () {
                this.isFormValid()
            })
            return 
        }
        let result = validateConfirmedPassword(this.state.newPassword, enteredConfirmedNewPassword)
        if (result.isValid) {
            this.setState({
                confirmedNewPassword: enteredConfirmedNewPassword,
                confirmedNewPasswordInfoText: result.infoText,
                isConfirmedNewPasswordValid: true
            }, function() {
                this.isFormValid()
            })
        } else {
            this.setState({
                confirmedNewPassword: enteredConfirmedNewPassword,
                confirmedNewPasswordInfoText: result.infoText,
                isConfirmedNewPasswordValid: false
            }, function() {
                this.isFormValid()
            })
        }
    }

    handleConfirmedNewPasswordBlur(event) {
        let enteredConfirmedNewPassword = event.target.value
        if (enteredConfirmedNewPassword === "") {
            this.setState({
                confirmedNewPassword: enteredConfirmedNewPassword,
                confirmedNewPasswordInfoText: "",
                passwordInfoText: false
            }, function () {
                this.isFormValid()
            })
            return 
        }
        let result = validateConfirmedPassword(this.state.newPassword, enteredConfirmedNewPassword)
        if (result.isValid) {
            this.setState({
                confirmedNewPassword: enteredConfirmedNewPassword,
                confirmedNewPasswordInfoText: result.infoText,
                isConfirmedNewPasswordValid: true
            }, function() {
                this.isFormValid()
            })
        } else {
            this.setState({
                confirmedNewPassword: enteredConfirmedNewPassword,
                confirmedNewPasswordInfoText: result.infoText,
                isConfirmedNewPasswordValid: false
            }, function() {
                this.isFormValid()
            })
        }
    }

    isPasswordsMatching(newPassword, confirmedNewPassword) {
        // in case user switches passwords from here
        let result = validateConfirmedPassword(newPassword, confirmedNewPassword)
        if (result.isValid) {
            this.setState({
                confirmedNewPasswordInfoText: result.infoText,
                isConfirmedNewPasswordValid: true
            }, function() {
                this.isFormValid()
            })
        } else {
            this.setState({
                confirmedNewPasswordInfoText: result.infoText, 
                isConfirmedNewPasswordValid: false
            }, function() {
                this.isFormValid()
            })
        }
    }

    isFormValid() {
        if (this.state.isCurrentPasswordValid &&
            this.state.isNewPasswordValid &&
            this.state.isConfirmedNewPasswordValid) {
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

        fetch(portalSettingsUpdatePassword(), {
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
                currentPassword: this.state.currentPassword,
                newPassword: this.state.newPassword,
                confirmedNewPassword: this.state.confirmedNewPassword
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
                this.setState({
                    currentPassword: "",
                    currentPasswordInfoText: "",
                    isCurrentPasswordValid: null,
                    newPassword: "",
                    newPasswordInfoText: "Requires 1 lower, 1 upper, 1 digit, 1 special character, and must be at least 6 characters long",
                    isNewPasswordValid: null,
                    confirmedNewPassword: "",
                    confirmedNewPasswordInfoText: "",
                    isConfirmedNewPasswordValid: null,
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
                    currentPassword: formData.currentPassword,
                    currentPasswordInfoText: errors.currentPassword,
                    newPassword: formData.newPassword,
                    confirmedNewPassword: formData.confirmedNewPassword,
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
                    currentPassword: formData.currentPassword,
                    currentPasswordInfoText: formData.currentPasswordInfoText,
                    newPassword: formData.newPassword,
                    newPasswordFormInfoText: formData.newPasswordFormInfoText,
                    confirmedNewPassword: formData.confirmedNewPassword,
                    confirmedNewPasswordInfoText: formData.confirmedNewPasswordInfoText,
                    isFormValid: false,
                    isErrorMessage: true
                })
                break;
            case 500:
                message = data.message
                formData = data.formData
                this.setState({
                    message: message,
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
                    confirmedNewPassword: formData.confirmedNewPassword,
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

                var newPasswordFormInfoText
                if (this.state.isNewPasswordValid === false) {
                    newPasswordFormInfoText =  <Form.Text className="text-danger">
                                            {this.state.newPasswordInfoText}
                                        </Form.Text>
                } else {
                    newPasswordFormInfoText =  <Form.Text className="text-muted">
                                            {this.state.newPasswordInfoText}
                                        </Form.Text>
                }

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

                var currentPasswordInputStyle;
                var newPasswordInputStyle;
                var confirmedNewPasswordInputStyle;

                if (this.state.currentPasswordInfoText) {
                    currentPasswordInputStyle = errorInputStyle
                } else {
                    currentPasswordInputStyle = defaultInputStyle
                }

                if (this.state.newPasswordInfoText && (this.state.isNewPasswordValid === false)) {
                    newPasswordInputStyle = errorInputStyle
                } else {
                    newPasswordInputStyle = defaultInputStyle
                }

                if (this.state.confirmedNewPasswordInfoText) {
                    confirmedNewPasswordInputStyle = errorInputStyle
                } else {
                    confirmedNewPasswordInputStyle = defaultInputStyle
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
                                    <SettingsHeader title={"Change Password"}></SettingsHeader>
                                </Col>
                            </Row>
    
                            <Row>
                                <Col xs={4}>
                                    <SettingsBar section={"account"}></SettingsBar>
                                </Col>
                                <Col xs={7}>
    
                                    {alert}
                                    <Form onSubmit={this.handleSubmit}>
    
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
                                                        style={currentPasswordInputStyle}
                                                    >
                                                    </Form.Control>
                                                    <Form.Text className="text-danger">
                                                        {this.state.currentPasswordInfoText}
                                                    </Form.Text>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                    
                                        <Row>
                                            <Col ms={6}>
                                                <Row>
                                                    <Col ms={6}>
                                                        <Form.Group controlId="formNewPassword">
                                                            <Form.Label>New Password:</Form.Label>
                                                            <Form.Control 
                                                                required 
                                                                type="password" 
                                                                name="newPassword"
                                                                value={this.state.newPassword}
                                                                placeholder="New Password"
                                                                onChange={this.handleNewPasswordChange} 
                                                                onBlur={this.handleNewPasswordBlur}
                                                                style={newPasswordInputStyle}
                                                            />
                                                            {newPasswordFormInfoText}
                                                        </Form.Group>
                                                    </Col>
                                                    <Col sm={6}>
                                                        <Form.Group controlId="formConfirmedNewPassword">
                                                            <Form.Label>Confirm New Password:</Form.Label>
                                                            <Form.Control 
                                                                required 
                                                                type="password" 
                                                                name="confirmedNewPassword"
                                                                value={this.state.confirmedNewPassword}
                                                                placeholder="Please confirm password"
                                                                onChange={this.handleConfirmedNewPasswordChange} 
                                                                onBlur={this.handleConfirmedNewPasswordBlur}
                                                                style={confirmedNewPasswordInputStyle}
                                                            />
                                                            <Form.Text className="text-danger">
                                                                {this.state.confirmedNewPasswordInfoText}
                                                            </Form.Text>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
    
                                        <Row>
                                            <Col sm={12}>
                                                <Button variant="primary" type="submit" disabled={!this.state.isFormValid}>
                                                    Update password
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
                                    <SettingsHeader title={"Change Password"}></SettingsHeader>
                                </Col>
                            </Row>
    
                            <Row>
                                <Col xs={3}>
                                    <SettingsBar section={"account"}></SettingsBar>
                                </Col>
                                <Col xs={6}>
    
                                    {alert}
                                    <Form onSubmit={this.handleSubmit}>
    
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
                                                        style={currentPasswordInputStyle}
                                                    >
                                                    </Form.Control>
                                                    <Form.Text className="text-danger">
                                                        {this.state.currentPasswordInfoText}
                                                    </Form.Text>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                    
                                        <Row>
                                            <Col ms={6}>
                                                <Row>
                                                    <Col ms={6}>
                                                        <Form.Group controlId="formNewPassword">
                                                            <Form.Label>New Password:</Form.Label>
                                                            <Form.Control 
                                                                required 
                                                                type="password" 
                                                                name="newPassword"
                                                                value={this.state.newPassword}
                                                                placeholder="New Password"
                                                                onChange={this.handleNewPasswordChange} 
                                                                onBlur={this.handleNewPasswordBlur}
                                                                style={newPasswordInputStyle}
                                                            />
                                                            {newPasswordFormInfoText}
                                                        </Form.Group>
                                                    </Col>
                                                    <Col sm={6}>
                                                        <Form.Group controlId="formConfirmedNewPassword">
                                                            <Form.Label>Confirm New Password:</Form.Label>
                                                            <Form.Control 
                                                                required 
                                                                type="password" 
                                                                name="confirmedNewPassword"
                                                                value={this.state.confirmedNewPassword}
                                                                placeholder="Please confirm password"
                                                                onChange={this.handleConfirmedNewPasswordChange} 
                                                                onBlur={this.handleConfirmedNewPasswordBlur}
                                                                style={confirmedNewPasswordInputStyle}
                                                            />
                                                            <Form.Text className="text-danger">
                                                                {this.state.confirmedNewPasswordInfoText}
                                                            </Form.Text>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
    
                                        <Row>
                                            <Col sm={12}>
                                                <Button variant="primary" type="submit" disabled={!this.state.isFormValid}>
                                                    Update password
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

export default Password