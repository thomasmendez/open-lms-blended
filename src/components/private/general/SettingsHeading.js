import React from "react"
import { withRouter } from "react-router";
import { Container, Row, Col, Table, Button } from 'react-bootstrap'
import arrowsCSS from "../../css/general/arrows.css"
import settingsHeader from "../../css/private/settingsHeader.css"

class SettingsHeader extends React.Component {

    constructor() {
        super()
        this.state = {
            
        }
        this.onClick = this.onClick.bind(this)
    }

    onClick() {
        this.props.history.goBack();
    }

    render() {
        return (
            <table>
                <tbody>
                    <tr>
                        <th className="button">
                        <button className="backButton" onClick={this.onClick}>
                            <i className="left"></i>
                        </button>
                        </th>
                        <th className="title">
                            <h3>
                                {this.props.title}
                            </h3>
                        </th>
                    </tr>
                </tbody>
            </table>
        )
    }

}

export default withRouter(SettingsHeader)