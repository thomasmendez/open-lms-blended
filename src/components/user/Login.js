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
import { login } from "../public/apis/teacherApis"
import { corsOptionsPOST } from '../config/config'

class Login extends React.Component {

    constructor() {
        super()
        this.state = {
            username: "",
            password: "",
            errorMessage: ""
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }

    handleSubmit(event) {

        event.preventDefault();

        fetch(login(), {
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
                username: this.state.username,
                password: this.state.password
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

        switch(statusCode) {
            case 200:
                this.props.history.push('/portal')
                break;
            case 401:
                let formData = data.formData;
                let message = data.errors.message;
                this.setState({
                    username: formData.username,
                    password: formData.password,
                    errorMessage: message
                })
                break;
            default:
                console.log("unregistered status code")
        }
    }

    handleUsernameChange(event) {
        this.setState({username: event.target.value})
    }

    handlePasswordChange(event) {
        this.setState({password: event.target.value})
    }
    
    render() {

        let headerStyle = {"textAlign":"center"}

        var alert;

        if (this.state.errorMessage) {
            alert = <Alert variant="danger">
                        {`${this.state.errorMessage}`}
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
                                  <h2 style={headerStyle}>Login</h2>
                                  <Row>
                                    <Col sm={12}>
                                        <Col md={12}>
                                            <Col md={12}>
                                                
                                                {alert}

                                                <Form onSubmit={this.handleSubmit}>
                                                    <Form.Group controlId="formUsername">
                                                        <Form.Label>Username:</Form.Label>
                                                        <Form.Control 
                                                            required 
                                                            type="text" 
                                                            name="username"
                                                            value={this.state.username}
                                                            placeholder="Enter your username"
                                                            onChange={this.handleUsernameChange} 
                                                        />
                                                    </Form.Group>

                                                    <Form.Group controlId="formPassword">
                                                        <Form.Label>Password:</Form.Label>
                                                        <Form.Control 
                                                            required 
                                                            type="password" 
                                                            name="password"
                                                            value={this.state.password}
                                                            placeholder="Enter your password" 
                                                            onChange={this.handlePasswordChange}
                                                        />
                                                    </Form.Group>
                                                    <Button variant="primary" type="submit">
                                                        Login
                                                    </Button>
                                                    <p className="mt-2 mb-0">Forgot your password? <a href="/resetPassword">Reset here</a></p>
                                                    <p className="m-0">Don't have an account? <a href="/signup">Sign Up here</a></p>
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

export default Login