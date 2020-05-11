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
import { confirmEmail } from "../public/apis/teacherApis"
import { corsOptionsPOST } from '../config/config'
import Loading from "../general/Loading"

class ConfirmEmail extends React.Component {

    constructor() {
        super()
        this.state = {
            isLoading: true,
            username: null,
            emailToken: null,
            isEmailConfirmed: null
        }
    }

    // check to make sure emailToken is valid 
    callAPI() {
        
        fetch(confirmEmail(), {
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
                emailToken: this.state.emailToken,
            })
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
        
        this.setState({
            username: this.props.match.params.username,
            emailToken: this.props.match.params.emailToken
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

        let isEmailConfirmed = data.isEmailConfirmed
        switch(statusCode) {
            case 200:
                this.setState({
                    isLoading: false,
                    isEmailConfirmed: isEmailConfirmed
                })
                break;
            case 401:
                this.setState({
                    isLoading: false,
                    isEmailConfirmed: isEmailConfirmed
                })
                break;
        }
    }
    
    render() {

        let headerStyle = {"textAlign":"center"}

        if (!this.state.isLoading) {
            if (this.state.isEmailConfirmed) {

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
                                            <h2 style={headerStyle}>Your email has been confirmed!</h2>
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
                                            <h2 style={headerStyle}>This email confirmation link is invalid</h2>
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

export default ConfirmEmail