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
import { portalSettingsSemester, portalSettingsUpdateSemester } from "../../../apis/portalApis"
import { corsOptionsGET, corsOptionsPOST } from "../../../../config/config"

import { validateSemester, validateYear } from "../../../../general/validator"

class Semester extends React.Component {

    constructor() {
        super()
        this.state = {
            username: null,
            currentSemester: null,
            currentYear: null,
            semester: "",
            semesterInfoText: "",
            isSemesterValid: null,
            year: "",
            yearInfoText: "",
            isYearValid: null,
            yearOptions: [],
            currentPassword: "",
            currentPasswordInfoText: "",
            isCurrentPasswordValid: null,
            isLoading: true,
            isFormValid: false,
            message: "",
            isErrorMessage: null
        }

        this.handleSemesterChange = this.handleSemesterChange.bind(this)
        this.handleYearChange = this.handleYearChange.bind(this)
        this.handleCurrentPasswordChange = this.handleCurrentPasswordChange.bind(this)
        this.handleCurrentPasswordBlur = this.handleCurrentPasswordBlur.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

        this.isFormValid = this.isFormValid.bind(this);
    }

    callAPI() {
        
        fetch((portalSettingsSemester()), {
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
        this.createYearOptions();
    }

    createYearOptions() {

        // get the current year that we are in
        let currentYear = new Date().getFullYear();

        let nextYear = currentYear + 1;

        this.setState({
            year: currentYear,
            isYearValid: true,
            yearOptions: [currentYear, nextYear]
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

        switch(statusCode) {
            case 200:
                let validUsername = data.validUsername
                let currentSemester = data.semester
                let currentYear = data.year
                this.setState({
                    username: validUsername,
                    currentSemester: currentSemester,
                    currentYear: currentYear,
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

    handleSemesterChange(event) {
        let enteredSemester = event.target.value
        if (enteredSemester === "") {
            this.setState({
                semesterInfoText: "",
                isSemesterValid: false
            }, function () {
                this.isFormValid()
            })
            return 
        }
        let result = validateSemester(enteredSemester)

        if (result.isValid) {
            this.setState({
                semester: enteredSemester,
                semesterInfoText: result.infoText,
                isSemesterValid: true
            }, function() {
                this.isFormValid()
            })
            
        } else {
            this.setState({
                semester: enteredSemester,
                semesterInfoText: result.infoText,
                isSemesterValid: false
            }, function() {
                this.isFormValid()
            })
        }
    }

    handleYearChange(event) {
        let enteredYear = event.target.value
        let result = validateYear(enteredYear)
        if (result.isValid) {
            this.setState({
                year: enteredYear,
                yearInfoText: result.infoText,
                isYearValid: true
            }, function () {
                this.isFormValid()
            })
        } else {
            this.setState({
                semester: enteredYear,
                semesterInfoText: result.infoText,
                isYearValid: false
            }, function () {
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
        if (this.state.isSemesterValid &&
            this.state.isYearValid &&
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

        fetch(portalSettingsUpdateSemester(), {
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
                semester: this.state.semester,
                year: this.state.year,
                currentPassword: this.state.currentPassword
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
                let semester = data.semester
                let year = data.year
                this.setState({
                    currentSemester: semester,
                    currentYear: year,
                    semester: "",
                    isSemesterValid: null,
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
                    semester: formData.semester,
                    year: formData.year,
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
                    semester: formData.semester,
                    semesterInfoText: errors.semester,
                    year: formData.year,
                    yearInfoText: errors.year,
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
                    semester: formData.semester,
                    year: formData.year,
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

                var semesterInputStyle;
                var yearInputStyle;
                var confirmedPasswordInputStyle;

                if (this.state.semesterInfoText) {
                    semesterInputStyle = errorInputStyle
                } else {
                    semesterInputStyle = defaultInputStyle
                }

                if (this.state.yearInputStyle) {
                    yearInputStyle = errorInputStyle
                } else {
                    yearInputStyle = defaultInputStyle
                }

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
                                    <SettingsHeader title={"Change Semester"}></SettingsHeader>
                                </Col>
                            </Row>
    
                            <Row>
                                <Col xs={4}>
                                    <SettingsBar section={"account"}></SettingsBar>
                                </Col>
                                <Col xs={7}>
                                    {alert}
                                    <Alert variant="warning">
                                        {`Before updating semesters, it is recommended to archive all courses for the current semester to prevent confusion for public viewers and to keep your previous courses organized in the correct semester`}
                                    </Alert>
                                    
                                    <p>Current Semester: {`${this.state.currentSemester} ${this.state.currentYear}`}</p>
                                    
                                    <Form onSubmit={this.handleSubmit}>
                    
                                        <Row>
                                            <Col ms={6}>
                                                <Row>
                                                    <Col ms={6}>
                                                        <Form.Group controlId="formSemester">
                                                            <Form.Label>Semester:</Form.Label>
                                                            <Form.Check
                                                                type="radio"
                                                                name="semester"
                                                                value='Fall'
                                                                id="Fall"
                                                                label="Fall"
                                                                checked={this.state.semester === "Fall"}
                                                                onChange={this.handleSemesterChange}
                                                            >
                                                            </Form.Check>
                                                            <Form.Check
                                                                type="radio"
                                                                name="semester"
                                                                value="Spring"
                                                                id="Spring"
                                                                label="Spring"
                                                                checked={this.state.semester === "Spring"}
                                                                onChange={this.handleSemesterChange}
                                                            >
                                                            </Form.Check>
                                                            <Form.Check
                                                                type="radio"
                                                                name="semester"
                                                                value="Summer"
                                                                id="Summer"
                                                                label="Summer"
                                                                checked={this.state.semester === "Summer"}
                                                                onChange={this.handleSemesterChange}
                                                            >
                                                            </Form.Check>
                                                            <Form.Check
                                                                type="radio"
                                                                name="semester"
                                                                value="Full-Year"
                                                                id="Full-Year"
                                                                label="Full-Year"
                                                                checked={this.state.semester === "Full-Year"}
                                                                onChange={this.handleSemesterChange}
                                                            >
                                                            </Form.Check>
                                                            <Form.Text className="text-danger">
                                                                {this.state.semesterInfoText}
                                                            </Form.Text>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col sm={6}>
                                                        <Form.Group controlId="formYear">
                                                            <Form.Label>Year:</Form.Label>
                                                            <Form.Control as="select" onChange={this.handleYearChange}>
                                                                {this.state.yearOptions.map((year, i) => (
                                                                    <option key={`option-${i}`} value={`${year}`}>{year}</option>
                                                                ))}
                                                            </Form.Control>
                                                            <Form.Text className="text-danger">
                                                                {this.state.yearInfoText}
                                                            </Form.Text>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
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
                                                    Update semester
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
                                    <SettingsHeader title={"Change Semester"}></SettingsHeader>
                                </Col>
                            </Row>
    
                            <Row>
                                <Col xs={3}>
                                    <SettingsBar section={"account"}></SettingsBar>
                                </Col>
                                <Col xs={6}>
                                    {alert}
                                    <Alert variant="warning">
                                        {`Before updating semesters, it is recommended to archive all courses for the current semester to prevent confusion for public viewers and to keep your previous courses organized in the correct semester`}
                                    </Alert>

                                    <p>Current Semester: {`${this.state.currentSemester} ${this.state.currentYear}`}</p>
                                    
                                    <Form onSubmit={this.handleSubmit}>
                    
                                        <Row>
                                            <Col ms={6}>
                                                <Row>
                                                    <Col ms={6}>
                                                        <Form.Group controlId="formSemester">
                                                            <Form.Label>Semester:</Form.Label>
                                                            <Form.Check
                                                                type="radio"
                                                                name="semester"
                                                                value='Fall'
                                                                id="Fall"
                                                                label="Fall"
                                                                checked={this.state.semester === "Fall"}
                                                                onChange={this.handleSemesterChange}
                                                            >
                                                            </Form.Check>
                                                            <Form.Check
                                                                type="radio"
                                                                name="semester"
                                                                value="Spring"
                                                                id="Spring"
                                                                label="Spring"
                                                                checked={this.state.semester === "Spring"}
                                                                onChange={this.handleSemesterChange}
                                                            >
                                                            </Form.Check>
                                                            <Form.Check
                                                                type="radio"
                                                                name="semester"
                                                                value="Summer"
                                                                id="Summer"
                                                                label="Summer"
                                                                checked={this.state.semester === "Summer"}
                                                                onChange={this.handleSemesterChange}
                                                            >
                                                            </Form.Check>
                                                            <Form.Check
                                                                type="radio"
                                                                name="semester"
                                                                value="Full-Year"
                                                                id="Full-Year"
                                                                label="Full-Year"
                                                                checked={this.state.semester === "Full-Year"}
                                                                onChange={this.handleSemesterChange}
                                                            >
                                                            </Form.Check>
                                                            <Form.Text className="text-danger">
                                                                {this.state.semesterInfoText}
                                                            </Form.Text>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col sm={6}>
                                                        <Form.Group controlId="formYear">
                                                            <Form.Label>Year:</Form.Label>
                                                            <Form.Control as="select" onChange={this.handleYearChange}>
                                                                {this.state.yearOptions.map((year, i) => (
                                                                    <option key={`option-${i}`} value={`${year}`}>{year}</option>
                                                                ))}
                                                            </Form.Control>
                                                            <Form.Text className="text-danger">
                                                                {this.state.yearInfoText}
                                                            </Form.Text>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
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
                                                    Update semester
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

export default Semester