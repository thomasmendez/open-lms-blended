import React from 'react'
import { withRouter } from "react-router";
import { Container, Row, Col } from 'react-bootstrap'
import { apiURL } from "../../config/config"

class CoursePage extends React.Component {

    constructor() {
        super()
        this.state = {

        }

    }

    render() {

        return (
            <Container fluid>
                <Row>
                    <Col xs={12}>
                        <h1>{`${this.props.course.fullCourseName}: ${this.props.course.course}`}</h1>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <div><a href={`${apiURL}/teacher/${this.props.match.params.teacherUsername}/course/${this.props.match.params.course}/syllabus/id/${this.props.course.syllabus.fileID}/files/${this.props.course.syllabus.syllabusFile}`}>Syllabus</a></div>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <div><a href={`${apiURL}/teacher/${this.props.match.params.teacherUsername}/course/${this.props.match.params.course}/schedule/id/${this.props.course.schedule.fileID}/files/${this.props.course.schedule.scheduleFile}`}>Schedule</a></div>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <div><a href={`${this.props.location.pathname}/assignments`}>Assignments</a></div>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <div><a href={`${this.props.location.pathname}/lectureNotes`}>Lecture Notes</a></div>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <div><a href={`${this.props.location.pathname}/classNotes`}>Class Notes</a></div>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <div><a href={`${this.props.location.pathname}/otherNotes`}>Other Notes</a></div>
                    </Col>
                </Row>
            </Container>
        )
    }

}

export default withRouter(CoursePage)