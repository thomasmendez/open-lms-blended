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
import { resetPassword } from "../public/apis/teacherApis"
import { corsOptionsPOST } from '../config/config'

class ResetPassword extends React.Component {

    constructor() {
        super()
        this.state = {
            email: "",
            message: "",
            isErrorMessage: null
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
    }

    handleSubmit(event) {

        event.preventDefault();

        fetch(resetPassword(), {
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
            })
        })
        .then(res => this.processResponse(res))
        .then(res => {
            const { statusCode, data } = res;
            this.processData(statusCode, data)
        })
        .catch(error => {
            console.error("error: " + error);
        });
        
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

        var message;
        switch(statusCode) {
            case 200:
                message = data.message
                this.setState({
                    message: message,
                    email: "",
                    isErrorMessage: false
                })
                break;
            case 401:
                message = data.message
                let formData = data.formData;
                this.setState({
                    message: message,
                    email: formData.email,
                    isErrorMessage: true
                })
                break;
        }
    }

    handleEmailChange(event) {
        this.setState({email: event.target.value})
    }
    
    render() {

        let headerStyle = {"textAlign":"center"}

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
                                                    <Form.Group controlId="formEmail">
                                                        <Form.Label>Email:</Form.Label>
                                                        <Form.Control 
                                                            required 
                                                            type="email" 
                                                            name="email"
                                                            value={this.state.email}
                                                            placeholder="Enter your email"
                                                            onChange={this.handleEmailChange} 
                                                        />
                                                    </Form.Group>
                                                    <Button variant="primary" type="submit">
                                                        Reset Password
                                                    </Button>
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
    }

}

export default ResetPassword