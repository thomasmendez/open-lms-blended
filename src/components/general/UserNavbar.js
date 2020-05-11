import React from "react"
import { withRouter } from "react-router";
import { Navbar, Nav } from 'react-bootstrap'
import {
    BrowserView,
    MobileView,
    isBrowser,
    isMobile
} from "react-device-detect";
import { logout } from "../private/apis/portalApis"
import { corsOptionsGET } from "../config/config"

class UserNavbar extends React.Component {

    constructor() {
        super()
        this.state = {
            
        }
        this.handleLogout = this.handleLogout.bind(this)
    }

    handleLogout(event) {
        event.preventDefault();
        
        fetch(logout(), {
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
            this.processFetchData(statusCode, data)
        })
        .catch(error => 
            console.log("error: " + error.message)
        )
    
    }

    processResponse(response) {
        const statusCode = response.status;
        const data = response.json();
        return Promise.all([statusCode, data]).then(res => ({
          statusCode: res[0],
          data: res[1]
        }));
    }

    processFetchData(statusCode, data) {
        // chrome browser turns 205 to 200 response?
        // chrome browser does not like status code 205 from server??
        switch(statusCode) {
            case 200:
                this.props.history.push('/login')
                break;
            case 205:
                this.props.history.push('/login')
                break;
            default:
                console.log("other: " + statusCode)
        }
    }

    render() {

        if (isMobile) {

            if (this.props.isLoggedIn) {
                return (
                    <MobileView>
                        <Navbar bg="light" expand="sm">

                            <Nav className="navbar-right">
                                <Navbar.Text>Hello {`${this.props.username}!`}</Navbar.Text>
                                <Nav.Item>
                                    <Nav.Link href={`/`}>Directory Home</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link href={`/portal`}>My Home</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link href={`/portal/settings/account`}>Settings</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link href="#" onClick={this.handleLogout}>Logout</Nav.Link>
                                </Nav.Item>
                            </Nav>

                        </Navbar>
                    </MobileView>
                )
            } else {
                return (
                    <MobileView>
                        <Navbar bg="light" expand="sm">
    
                            <Nav className="navbar-right">
                                <Nav.Item>
                                    <Nav.Link href={`/`}>Home</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link href="/signup">Sign Up</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link href="/login">Login</Nav.Link>
                                </Nav.Item>
                            </Nav>
                    
                        </Navbar>
                    </MobileView>
                )
            }

        } else {

            if (this.props.isLoggedIn) {
                return (
                    <Navbar bg="light" expand="sm">
        
                        <Navbar.Collapse>
                            <Nav className="mr-auto">
                                <Nav.Link href={`/`}>Directory Home</Nav.Link>
                                <Nav.Link href={`/portal`}>My Home</Nav.Link>
                                <Nav.Link href={`/portal/settings/account`}>Settings</Nav.Link>
                            </Nav>
        
                        </Navbar.Collapse>
        
                        <Nav className="navbar-right">
                            <Navbar.Text>Hello {`${this.props.username}!`}</Navbar.Text>
                            <Nav.Item>
                                <Nav.Link href="#" onClick={this.handleLogout}>Logout</Nav.Link>
                            </Nav.Item>
                        </Nav>
        
                    </Navbar>
                )
            } else {
                return (
                    <Navbar bg="light" expand="sm">
        
                        <Navbar.Collapse>
                            <Nav className="mr-auto">
                                <Nav.Link href={`/`}>Home</Nav.Link>
                            </Nav>
        
                        </Navbar.Collapse>
        
                        <Nav className="navbar-right">
                            <Nav.Item>
                                <Nav.Link href="/signup">Sign Up</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link href="/login">Login</Nav.Link>
                            </Nav.Item>
                        </Nav>
        
                    </Navbar>
                )
            }
        }
    }
}


export default withRouter(UserNavbar)