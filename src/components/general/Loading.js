import React from "react"
import { Container, Row, Col } from 'react-bootstrap'

class Loading extends React.Component {

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
                        <p>Loading...</p>
                    </Col>
                </Row>
            </Container>
        )

    }

}

export default Loading