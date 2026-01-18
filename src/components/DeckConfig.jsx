import React from 'react';
// import { Link } from 'react-router';
import { Col, Form, FormGroup, ButtonGroup, Button, ControlLabel, HelpBlock, Panel, Checkbox } from 'react-bootstrap';

class DeckConfig extends React.Component {

    constructor(props) {
        super(props);
        this.state = { showSide: 'front', randomize: true };

        // Manually bind this method to the component instance so "this" is what we expect
        this.startDeck = this.startDeck.bind(this);
        this.setShowSide = this.setShowSide.bind(this);
        this.toggleRandomize = this.toggleRandomize.bind(this);
    }

    startDeck() {

        // TODO: Validation of inputs
        const config = {
            showSide: this.state.showSide,
            randomize: this.state.randomize
        };
        this.props.onDeckConfigure(this.props.deckId, config);
    }

    setShowSide(side) {
        this.setState({ showSide: side });
    }

    toggleRandomize() {
        this.setState({ randomize: !this.state.randomize });
    }

    render() {

        return (
            <div className="container">

                <Panel className="app-form">

                    <div className="config-header" fill>
                        <h2>Get Ready!</h2>
                        <p>
                            Let us know how you'd like to go through this deck of flashcards.
                        </p>
                    </div>

                    <Form horizontal>

                        <FormGroup controlId="formBasicText">
                            {/*<ControlLabel className="config-label">Show me:</ControlLabel>*/}
                            <Col componentClass={ControlLabel} className="config-label" sm={3}>Show me:</Col>
                            <Col sm={8}>
                                <ButtonGroup>
                                    <Button onClick={() => { this.setShowSide('front'); }}
                                        bsStyle={this.state.showSide === 'front' ? 'primary' : 'default'}>Front side</Button>
                                    <Button onClick={() => { this.setShowSide('back'); }}
                                        bsStyle={this.state.showSide !== 'front' ? 'primary' : 'default'}>Back side</Button>
                                </ButtonGroup>
                                <HelpBlock className="inline-help-block">("Front side" is typical)</HelpBlock>
                            </Col>
                        </FormGroup>

                        <FormGroup controlId="formBasicText">
                            <Col componentClass={ControlLabel} className="config-label" sm={3}>Show details:</Col>
                            <Col sm={8}>
                                <ButtonGroup>
                                    <Button onClick={() => { ; }}
                                            bsStyle={this.state.showDetails === 'always' ? 'primary' : 'default'}>Always</Button>
                                    <Button onClick={() => { ; }}
                                            bsStyle={this.state.showDetails === 'never' ? 'primary' : 'default'}>Never</Button>
                                    <Button onClick={() => { ; }}
                                            bsStyle={this.state.showDetails === 'beforeFlipping' ? 'primary' : 'default'}>Before flipping</Button>
                                </ButtonGroup>
                            </Col>
                        </FormGroup>

                        <FormGroup controlId="formBasicText">
                            <Col componentClass={ControlLabel} className="config-label" sm={3}>Miscellaney:</Col>
                            <Col sm={8}>
                                <Checkbox checked={this.state.randomize} onChange={this.toggleRandomize}>Randomize</Checkbox>
                            </Col>
                        </FormGroup>

                    </Form>

                    <div className="config-submit-button-area">
                        <Button bsStyle="success" onClick={this.startDeck}>Start flipping!</Button>
                    </div>
                </Panel>
            </div>
        );
    }
}

export default DeckConfig;
