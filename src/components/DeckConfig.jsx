import React, { useState } from 'react';
import { Col, Form, ButtonGroup, Button, Card } from 'react-bootstrap';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { useParams, useNavigate } from 'react-router-dom'; // Import useParams and useNavigate
import { startDeck as setCurrentDeck } from '../slices/currentDeckSlice'; // Import startDeck for currentDeck
import { setDeckConfig } from '../slices/configSlice'; // Import setDeckConfig

function DeckConfig() { // No props needed anymore
    const [showSide, setShowSideState] = useState('front');
    const [randomize, setRandomize] = useState(true);
    const [showDetails, setShowDetails] = useState('always'); // Assuming 'always' as default

    const dispatch = useDispatch();
    const navigate = useNavigate(); // Initialize navigate hook
    const { deckId } = useParams(); // Get deckId from URL parameters

    const handleStartDeck = () => { // Renamed from startDeck to handleStartDeck
        const config = {
            showSide,
            randomize,
            showDetails // Include showDetails in config
        };
        dispatch(setCurrentDeck(deckId)); // Dispatch action to set currentDeck
        dispatch(setDeckConfig(config)); // Dispatch action to set config
        navigate(`/decks/${deckId}`); // Navigate to the decks page
    };

    const handleSetShowSide = (side) => {
        setShowSideState(side);
    };

    const handleToggleRandomize = () => {
        setRandomize(!randomize);
    };

    const handleSetShowDetails = (detailOption) => {
        setShowDetails(detailOption);
    };

    return (
        <div className="container">
            <Card className="app-form">
                <Card.Header className="config-header" fill="true">
                    <h2>Get Ready!</h2>
                    <p>
                        Let us know how you'd like to go through this deck of flashcards.
                    </p>
                </Card.Header>

                <Card.Body>
                    <Form horizontal="true">

                        <Form.Group as={Col} controlId="formShowSide" className="mb-3">
                            <Form.Label column sm={3} className="config-label">Show me:</Form.Label>
                            <Col sm={8}>
                                <ButtonGroup>
                                    <Button onClick={() => handleSetShowSide('front')}
                                            variant={showSide === 'front' ? 'primary' : 'secondary'}>Front side</Button>
                                    <Button onClick={() => handleSetShowSide('back')}
                                            variant={showSide !== 'front' ? 'primary' : 'secondary'}>Back side</Button>
                                </ButtonGroup>
                                <Form.Text className="inline-help-block text-muted">("Front side" is typical)</Form.Text>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formShowDetails" className="mb-3">
                            <Form.Label column sm={3} className="config-label">Show details:</Form.Label>
                            <Col sm={8}>
                                <ButtonGroup>
                                    <Button onClick={() => handleSetShowDetails('always')}
                                            variant={showDetails === 'always' ? 'primary' : 'secondary'}>Always</Button>
                                    <Button onClick={() => handleSetShowDetails('never')}
                                            variant={showDetails === 'never' ? 'primary' : 'secondary'}>Never</Button>
                                    <Button onClick={() => handleSetShowDetails('beforeFlipping')}
                                            variant={showDetails === 'beforeFlipping' ? 'primary' : 'secondary'}>Before flipping</Button>
                                </ButtonGroup>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formRandomize" className="mb-3">
                            <Form.Label column sm={3} className="config-label">Miscellaney:</Form.Label>
                            <Col sm={8}>
                                <Form.Check
                                    type="checkbox"
                                    label="Randomize"
                                    checked={randomize}
                                    onChange={handleToggleRandomize}
                                />
                            </Col>
                        </Form.Group>

                    </Form>
                </Card.Body>

                <Card.Footer className="config-submit-button-area">
                    <Button variant="success" onClick={handleStartDeck}>Start flipping!</Button>
                </Card.Footer>
            </Card>
        </div>
    );
}

export default DeckConfig;
