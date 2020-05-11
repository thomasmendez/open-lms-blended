import React from 'react';
import { Link } from 'react-router-dom';
import UserNavbar from '../general/UserNavbar'
import Loading from '../general/Loading'
import { corsOptionsGET } from "../config/config"
import { portalCheckUser } from '../private/apis/portalApis'

class NotFound extends React.Component{

  constructor() {
    super()
    this.state = {
        username: null,
        isLoading: true
    }
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

  processResponse(response) {
    const statusCode = response.status;
    const data = response.json();
    return Promise.all([statusCode, data]).then(res => ({
      statusCode: res[0],
      data: res[1]
    }));
  }

  processCheckUser(statusCode, data) {
      let username = data.validUsername
      switch(statusCode) {
          case 200:
              this.setState({
                  username: username,
                  isLoading: false
              })
              break;
          case 401:
              this.setState({
                username: null,
                isLoading: false
              })
              break;
          default:
              console.log("unregistered status code")
      }
  }

  componentDidMount() {
    this.checkUser();
  }

  render() {

    var userNavbar = <UserNavbar></UserNavbar>

    if (this.state.username) {
        userNavbar = <UserNavbar isLoggedIn={true} username={this.state.username}></UserNavbar>
    }

    if (!this.state.isLoading) {

      return (
        <>
        {userNavbar}
        <h1 style={{textAlign: "center"}}>404 Page Not Found</h1>
        </>
      )

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

export default NotFound;