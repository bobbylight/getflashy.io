import React from 'react';
// import { Link } from 'react-router';
import { FormGroup, ButtonGroup, Button, ControlLabel, HelpBlock, Panel, Checkbox } from 'react-bootstrap';

class Results extends React.Component {

    constructor(props) {
        super(props);
        this.state = { };

        // Manually bind this method to the component instance so "this" is what we expect
        this.startNewDeck= this.startNewDeck.bind(this);
    }

    startNewDeck() {
        this.props.onStartNewDeck();
    }

    render() {

        return (
            <div className="container">

                <Panel className="app-form">

                    <div className="config-header" fill>
                        <h2>All Done!</h2>
                        <p>
                            Here's you you did:
                        </p>
                    </div>

                    Amazing!!!

                    <div className="config-submit-button-area">
                        <Button bsStyle="success" onClick={this.startNewDeck}>Start another deck</Button>
                    </div>
                </Panel>
            </div>
        );
    }
}

export default Results;
