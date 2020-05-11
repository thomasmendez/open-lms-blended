import React from 'react'
import { 
    r, Row, Col,
    Table, thead, tr, th, tbody, td
} from 'react-bootstrap'

class BasicTable extends React.Component {

    constructor() {
        super()
        this.state = {

        }

    }

    render() {
        
        return (
            <>
                <Row>
                    <Col xs={12}>
                        <h1>{this.props.title}</h1>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <Table striped bordered hover>
                            <tbody>
                                <tr>
                                    {this.props.tableHeaders.map((header, i) => (
                                        <th key={`header-${i}`}>
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                                {this.props.tableData.map((tableData, i) => (
                                    <tr key={`data-${i}`}>
                                        {tableData}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </>
        )
    }

}

export default BasicTable