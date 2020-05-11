import React from "react"
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import { FormGroup } from "react-bootstrap"
import AddFormGroup from "./AddFormGroup"

class AddForm extends React.Component {

    constructor() {
        super()
        this.state = {
            
        }
    }

    render() {

        // if the button to open the form is pressed
        if (this.props.pressed) {
            return (
                <Form onSubmit={this.props.handleSubmit}>

                    <>
                    {this.props.formGroups.map((formGroup, i) => (
                        
                        <div key={`group-${i}`}>
                            <AddFormGroup
                                formGroup={formGroup}
                            >
                            </AddFormGroup>
                       </div>
                    ))}
                    <Row>
                        <Col xs={12}>
                            <Button variant="primary" type="submit">
                                {this.props.buttonName}
                            </Button>
                        </Col>
                    </Row>
                    </>
                    
                </Form>
            )
            
        } else {

            if (this.props.updateForm === true) {

                return (
                    <Button variant="primary" onClick={this.props.onClick}>
                    update
                    </Button>
                )

            } else {
                return (
                    <Row>
                        <Col xs={12}>
                            <Button variant="primary" onClick={this.props.onClick}>
                            +
                            </Button>
                        </Col>
                    </Row>
                    
                )
            }
            
        }

    }

}

export default AddForm