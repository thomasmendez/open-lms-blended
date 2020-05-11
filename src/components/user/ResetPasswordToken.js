import React from "react"
import { 
    Form, 
    Button,
    Container, 
    Row, 
    Col, 
    Jumbotron,
    Alert
} from 'react-bootstrap'
import UserNavbar from "../general/UserNavbar"
import Loading from "../general/Loading"
import { validatePassword, validateConfirmedPassword } from "../general/validator"
import { checkToken, resetPasswordToken } from "../public/apis/teacherApis"
import { corsOptionsGET, corsOptionsPOST } from '../config/config'

class ResetPasswordToken extends React.Component {

    constructor() {
        super()
        this.state = {
            isLoading: true,
            token: "",
            isTokenValid: null,
            newPassword: "",
            newPasswordInfoText: "Requires 1 lower, 1 upper, 1 digit, 1 special character, and must be at least 6 characters long",
            isNewPasswordValid: null,
            confirmedNewPassword: "",
            confirmedNewPasswordInfoText: "",
            isConfirmedNewPasswordValid: null,
            isFormValid: false,
            message: "",
            isErrorMessage: null,
            didUpdatePassword: null
        }
        this.handleSubmit = this.handleSubmit.bind(this);

        this.handleNewPasswordChange = this.handleNewPasswordChange.bind(this);
        this.handleNewPasswordBlur = this.handleNewPasswordBlur.bind(this);

        this.handleConfirmedNewPasswordChange = this.handleConfirmedNewPasswordChange.bind(this);
        this.handleConfirmedNewPasswordBlur = this.handleConfirmedNewPasswordBlur.bind(this);

    }

    getTokenValue() {
        this.setState({
            token: this.props.match.params.token
        })
    }

    // check to make sure token is valid 
    callAPI() {
        
        fetch(checkToken(this.state.token))

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
        
        this.setState({
            token: this.props.match.params.token
        }, function() {
            this.callAPI()
        })
        
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

        let isTokenValid = data.isTokenValid
        switch(statusCode) {
            case 200:
                this.setState({
                    isLoading: false,
                    isTokenValid: isTokenValid
                })
                break;
            case 401:
                this.setState({
                    isLoading: false,
                    isTokenValid: isTokenValid
                })
                break;
        }
    }

    handleSubmit(event) {

        event.preventDefault();

        fetch(resetPasswordToken(this.state.token), {
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
        switch(statusCode) {
            case 200:
                message = data.message
                this.setState({
                    message: message,
                    newPassword: "",
                    confirmedNewPassword: "",
                    didUpdatePassword: data.didUpdatePassword,
                    isErrorMessage: false
                })
                break;
            case 401:
                message = data.message
                this.setState({
                    message: message,
                    newPassword: "",
                    confirmedNewPassword: "",
                    isTokenValid: data.isTokenValid,
                    isErrorMessage: true
                })
                break;
            case 422: 
                message = data.message
                formData = data.formData;
                let formErrors = data.errors;
                this.setState({
                    message: message,
                    newPassword: formData.newPassword,
                    newPasswordInfoText: formErrors.newPassword,
                    confirmedNewPassword: formData.confirmedNewPassword,
                    confirmedNewPasswordInfoText: formErrors.confirmedNewPassword,
                    isFormValid: false,
                    isErrorMessage: true
                })
                break;
            case 500: 
                message = data.message
                formData = data.formData
                this.setState({
                    message: message,
                    newPassword: formData.newPassword,
                    confirmedNewPassword: formData.confirmedNewPassword,
                    isErrorMessage: true
                })
                break;
            default: 
                console.log("unregistered status code")

        }
    }

    handleNewPasswordChange(event) {
        let enteredNewPassword = event.target.value
        if (enteredNewPassword === "") {
            this.setState({
                newPassword: enteredNewPassword,
                newPasswordInfoText: "Requires 1 lower, 1 upper, 1 digit, 1 special character, and must be at least 6 characters long",
                isNewPasswordValid: null
            }, function () {
                this.isFormValid()
            })
            return 
        }
        let result = validateConfirmedPassword(enteredNewPassword)
        if (result.isValid) {
            this.setState({
                newPassword: enteredNewPassword,
                newPasswordInfoText: result.infoText,
                isNewPasswordValid: true
            }, function() {
                if (this.state.confirmedNewPassword) {
                    this.isNewPasswordsMatching(this.state.newPassword, this.state.confirmedNewPassword)
                } else {
                    this.isFormValid()
                }
            })
        } else {
            this.setState({
                newPassword: enteredNewPassword,
                newPasswordInfoText: "Requires 1 lower, 1 upper, 1 digit, 1 special character, and must be at least 6 characters long",
                isNewPasswordValid: null
            }, function() {
                if (this.state.confirmedNewPassword) {
                    this.isNewPasswordsMatching(this.state.newPassword, this.state.confirmedNewPassword)
                } else {
                    this.isFormValid()
                }
            })
        }
    }

    handleNewPasswordBlur(event) {
        let enteredNewPassword = event.target.value
        if (enteredNewPassword === "") {
            this.setState({
                newPassword: enteredNewPassword,
                newPasswordInfoText: "Requires 1 lower, 1 upper, 1 digit, 1 special character, and must be at least 6 characters long",
                isNewPasswordValid: null
            }, function () {
                this.isFormValid()
            })
            return 
        }
        let result = validatePassword(enteredNewPassword)
        if (result.isValid) {
            this.setState({
                newPassword: enteredNewPassword,
                newPasswordInfoText: result.infoText,
                isNewPasswordValid: true
            }, function() {
                if (this.state.confirmedNewPassword) {
                    this.isNewPasswordsMatching(this.state.newPassword, this.state.confirmedNewPassword)
                } else {
                    this.isFormValid()
                }
            })
        } else {
            this.setState({
                newPassword: enteredNewPassword,
                newPasswordInfoText: result.infoText,
                isNewPasswordValid: false
            }, function() {
                if (this.state.confirmedNewPassword) {
                    this.isNewPasswordsMatching(this.state.newPassword, this.state.confirmedNewPassword)
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
                NewPasswordInfoText: false
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

    isNewPasswordsMatching(NewPassword, confirmedNewPassword) {
        // in case user switches NewPasswords from here
        let result = validateConfirmedPassword(NewPassword, confirmedNewPassword)
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
        if (this.state.isCurrentNewPasswordValid &&
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
    
    render() {

        if (!this.state.isLoading) {

            let headerStyle = {"textAlign":"center"}

            if (this.state.isTokenValid) {

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

                if (!this.state.didUpdatePassword) {

                    var NewPasswordFormInfoText
                    if (this.state.isNewPasswordValid === false) {
                        NewPasswordFormInfoText =  <Form.Text className="text-danger">
                                                {this.state.newPasswordInfoText}
                                            </Form.Text>
                    } else {
                        NewPasswordFormInfoText =  <Form.Text className="text-muted">
                                                {this.state.newPasswordInfoText}
                                            </Form.Text>
                    }
                
                    let errorInputStyle = {'borderColor': 'red'}
                    let defaultInputStyle = {'borderColor': '#ced4da'}
                
                    var NewPasswordInputStyle;
                    var confirmedNewPasswordInputStyle;
                
                    if (this.state.newPasswordInfoText && (this.state.isNewPasswordValid === false)) {
                        NewPasswordInputStyle = errorInputStyle
                    } else {
                        NewPasswordInputStyle = defaultInputStyle
                    }
                
                    if (this.state.confirmedNewPasswordInfoText) {
                        confirmedNewPasswordInputStyle = errorInputStyle
                    } else {
                        confirmedNewPasswordInputStyle = defaultInputStyle
                    }
                
                    return (
                      <>
                      <UserNavbar></UserNavbar>
                      <Container>
                          <Row>
                              <Col sm={12}>
                                  <Row>
                                      <Col md={2}></Col>
                                      <Col md={8}>
                                          <Jumbotron>
                                              <h2 style={headerStyle}>Reset Password</h2>
                                              <Row>
                                                <Col sm={12}>
                                                    <Col md={12}>
                                                        <Col md={12}>

                                                            {alert}
                    
                                                            <Form onSubmit={this.handleSubmit}>
                                                                <Row>
                                                                    <Col sm={{span: 6, offset: 3}}>
                                                                        <Row>
                                                                            <Col sm={12}>
                                                                                <Form.Group controlId="formNewPassword">
                                                                                    <Form.Label>New Password:</Form.Label>
                                                                                    <Form.Control 
                                                                                        required 
                                                                                        type="password" 
                                                                                        name="NewPassword"
                                                                                        defaultValue={this.state.newPassword}
                                                                                        placeholder="Please enter a new password"
                                                                                        onChange={this.handleNewPasswordChange} 
                                                                                        onBlur={this.handleNewPasswordBlur.bind(this)}
                                                                                        style={NewPasswordInputStyle}
                                                                                    />
                                                                                    {NewPasswordFormInfoText}
                                                                                </Form.Group>
                                                                            </Col>
                                                                        </Row>
                                                                        <Row>
                                                                            <Col sm={12}>
                                                                                <Form.Group controlId="formConfirmedNewPassword">
                                                                                    <Form.Label>Confirm New Password:</Form.Label>
                                                                                    <Form.Control 
                                                                                        required 
                                                                                        type="password" 
                                                                                        name="confirmedNewPassword"
                                                                                        defaultValue={this.state.confirmedNewPassword}
                                                                                        placeholder="Please confirm your new password"
                                                                                        onChange={this.handleConfirmedNewPasswordChange} 
                                                                                        onBlur={this.handleConfirmedNewPasswordBlur.bind(this)}
                                                                                        style={confirmedNewPasswordInputStyle}
                                                                                    />
                                                                                    <Form.Text className="text-danger">
                                                                                        {this.state.confirmedNewPasswordInfoText}
                                                                                    </Form.Text>
                                                                                </Form.Group>
                                                                            </Col>
                                                                        </Row>
                                                                        <Row>
                                                                            <Col sm={12}>
                                                                                <Button variant="primary" type="submit">
                                                                                Reset Password
                                                                                </Button>
                                                                            </Col>
                                                                        </Row>
                                                                    </Col>
                                                                </Row>                                            
                                                            </Form>
                                                        </Col>
                                                    </Col>
                                                </Col>
                                              </Row>
                                          </Jumbotron>
                                      </Col>
                                  </Row>
                              </Col>
                          </Row>
                      </Container>
                      </>
                    )

                } else {

                    return (
                        <>
                        <UserNavbar></UserNavbar>
                        <Container>
                            <Row>
                                <Col sm={12}>
                                    <Row>
                                        <Col md={2}></Col>
                                        <Col md={8}>
                                            <Jumbotron>
                                                <h2 style={headerStyle}>Reset Password</h2>
                                                <Row>
                                                  <Col sm={12}>
                                                      <Col md={12}>
                                                          <Col md={12}>
                                                              {alert}
                                                          </Col>
                                                      </Col>
                                                  </Col>
                                                </Row>
                                            </Jumbotron>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Container>
                        </>
                    )

                }

            } else {
                
                return (
                    <>
                    <UserNavbar></UserNavbar>
                    <Container>
                        <Row>
                            <Col sm={12}>
                                <Row>
                                    <Col md={2}></Col>
                                    <Col md={8}>
                                        <Jumbotron>
                                            <h2 style={headerStyle}>This reset password link is no longer valid</h2>
                                        </Jumbotron>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Container>
                    </>
                  )
  
            }

        } else {
            return (
                <>
                <UserNavbar></UserNavbar>
                <Loading></Loading>
                </>
            )
        }
    }

}

export default ResetPasswordToken