import { useState } from 'react';
import { Col, Form, ButtonGroup, Button, Card as BootstrapCard } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

interface DeckConfigParams {
  deckId?: string;
  [key: string]: string | undefined;
}

function DeckConfig() {
    const [showSide, setShowSideState] = useState<'front' | 'back'>('front');
    const [randomize, setRandomize] = useState<boolean>(true);
    const [showDetails, setShowDetails] = useState<'always' | 'never' | 'beforeFlipping'>('always');

    const navigate = useNavigate();
    const { deckId } = useParams<DeckConfigParams>();

    const handleStartDeck = () => {
        if (!deckId) {
            console.error("Deck ID is missing!");
            navigate('/');
            return;
        }

        // Only pass overrides as query parameters to keep the URL cleaner
        const queryParams = new URLSearchParams();
        if (!randomize) {
            queryParams.append('randomize', 'false');
        }
        if (showSide !== 'front') {
            queryParams.append('showSide', showSide);
        }
        if (showDetails !== 'always') {
            queryParams.append('showDetails', showDetails);
        }
        navigate(`/decks/${deckId}?${queryParams.toString()}`);
    };

    const handleSetShowSide = (side: 'front' | 'back') => {
        setShowSideState(side);
    };

    const handleToggleRandomize = () => {
        setRandomize(!randomize);
    };

    const handleSetShowDetails = (detailOption: 'always' | 'never' | 'beforeFlipping') => {
        setShowDetails(detailOption);
    };

    return (
        <div className="container">
            <BootstrapCard className="app-form">
                <BootstrapCard.Header className="config-header">
                    <h2>Get Ready!</h2>
                    <p>
                        Let us know how you'd like to go through this deck of flashcards.
                    </p>
                </BootstrapCard.Header>

                <BootstrapCard.Body>
                    <Form>

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
                </BootstrapCard.Body>

                <BootstrapCard.Footer className="config-submit-button-area">
                    <Button variant="success" onClick={handleStartDeck}>Start flipping!</Button>
                </BootstrapCard.Footer>
            </BootstrapCard>
        </div>
    );
}

export default DeckConfig;
