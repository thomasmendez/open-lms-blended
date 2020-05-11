import React from "react"
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import DatePicker from "react-datepicker";
 
import "react-datepicker/dist/react-datepicker.css";
 
// CSS Modules, react-datepicker-cssmodules.css
//import 'react-datepicker/dist/react-datepicker-cssmodules.css';

class AddFormGroup extends React.Component {

    constructor() {
        super()
        this.state = {
            
        }
    }

    render() {

        if (this.props.formGroup.type === "file") {
            return (
                <>
                <Row>
                    <Col xs={12}>
                        <Form.Group controlId={this.props.formGroup.controlId}>
                            <Form.Control
                                required
                                type={this.props.formGroup.type}
                                name={this.props.formGroup.name}
                                onChange={this.props.formGroup.onChange}
                            >
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                </>
            )
        } else if (this.props.formGroup.type === "hidden") {
            return (
                <>
                <Row>
                    <Col xs={12}>
                        <Form.Group controlId={this.props.formGroup.controlId}>
                            <Form.Control
                                required
                                type={this.props.formGroup.type}
                                name={this.props.formGroup.name}
                            >
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                </>
            )
        } else if (this.props.formGroup.type === "date") {
            return (
                <>
                <Row>
                    <Col xs={12}>
                        <Form.Group controlId={this.props.formGroup.controlId}>
                            <Form.Label>{this.props.formGroup.label}</Form.Label>
                            <Row>
                                <Col xs={12}>
                                <DatePicker
                                    selected={this.props.formGroup.date}
                                    onChange={this.props.formGroup.onChange}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    timeCaption="Time"
                                    dateFormat="MMMM d, yyyy h:mm aa"
                                    placeholderText={this.props.formGroup.placeholder}
                                />
                                </Col>
                            </Row>
                        </Form.Group>
                    </Col>
                </Row>
                </>
            )
        } else {
            return (
                <>
                <Row>
                    <Col xs={12}>
                        <Form.Group controlId={this.props.formGroup.controlId}>
                            <Form.Label>{this.props.formGroup.label}</Form.Label>
                            <Form.Control
                                required
                                type={this.props.formGroup.type}
                                name={this.props.formGroup.name}
                                value={this.props.formGroup.value}
                                placeholder={this.props.formGroup.placeholder}
                                onChange={this.props.formGroup.onChange}
                            >
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                </>
            )
        }
    }

}

export default AddFormGroup