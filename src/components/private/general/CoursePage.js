import React from 'react'
import { withRouter } from "react-router";
import { Container, Row, Col } from 'react-bootstrap'

class CoursePage extends React.Component {

    constructor() {
        super()
        this.state = {

        }

    }

    render() {

        var header;
        if (this.props.showSemester) {
            header = <h1>{`${this.props.course.fullCourseName}: ${this.props.course.course} (${this.props.course.semester} ${this.props.course.year})`}</h1>
        } else {
            header = <h1>{`${this.props.course.fullCourseName}: ${this.props.course.course}`}</h1>
        }

        return (
            <Container fluid>
                <Row>
                    <Col xs={12}>
                        {header}
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <div><a href={`${this.props.location.pathname}/syllabus`}>Syllabus</a></div>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <div><a href={`${this.props.location.pathname}/schedule`}>Schedule</a></div>
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