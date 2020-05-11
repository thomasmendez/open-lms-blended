import React from "react"
import { Container, Row, Col, ListGroup } from 'react-bootstrap'
import { withRouter } from "react-router";

class SettingsBar extends React.Component {

    constructor() {
        super()
        this.state = {
            
        }
    }

    render() {
        return (
            <ListGroup defaultActiveKey={`${this.props.section}`}>
              <ListGroup.Item action href={`account`}>
                Manage Account 
              </ListGroup.Item>
              <ListGroup.Item action href={`archiveManage`}>
                Archive Course(s)
              </ListGroup.Item>
              <ListGroup.Item action href={`archiveView`}>
                View Archived Courses
              </ListGroup.Item>
            </ListGroup>
        )
    }

}

export default withRouter(SettingsBar)