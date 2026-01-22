import { useState } from 'react';
import { Form, ButtonGroup, Button, Card as BootstrapCard } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

interface DeckConfigParams {
  deckId?: string;
  [key: string]: string | undefined;
}

export function DeckConfig() {
    const [ showSide, setShowSideState ] = useState<'front' | 'back'>('front');
    const [ randomize, setRandomize ] = useState<boolean>(true);
    const [ showDetails, setShowDetails ] = useState<'always' | 'never' | 'beforeFlipping'>('always');

    const navigate = useNavigate();
    const { deckId } = useParams<DeckConfigParams>();

    const handleStartDeck = () => {
        if (!deckId) {
            console.error("Deck ID is missing!");
            void navigate('/');
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
        void navigate(`/decks/${deckId}?${queryParams.toString()}`);
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
                    <p>Configure how you'd like to study this deck</p>
                </BootstrapCard.Header>

                <BootstrapCard.Body>
                    <Form>
                        <div className="config-section">
                            <div className="config-label">Show me:</div>
                            <ButtonGroup>
                                <Button
                                    onClick={() => handleSetShowSide('front')}
                                    variant={showSide === 'front' ? 'primary' : 'secondary'}
                                >
                                    Front side
                                </Button>
                                <Button
                                    onClick={() => handleSetShowSide('back')}
                                    variant={showSide === 'back' ? 'primary' : 'secondary'}
                                >
                                    Back side
                                </Button>
                            </ButtonGroup>
                            <div className="config-hint">Front side is typical</div>
                        </div>

                        <div className="config-section">
                            <div className="config-label">Show details:</div>
                            <ButtonGroup>
                                <Button
                                    onClick={() => handleSetShowDetails('always')}
                                    variant={showDetails === 'always' ? 'primary' : 'secondary'}
                                >
                                    Always
                                </Button>
                                <Button
                                    onClick={() => handleSetShowDetails('never')}
                                    variant={showDetails === 'never' ? 'primary' : 'secondary'}
                                >
                                    Never
                                </Button>
                                <Button
                                    onClick={() => handleSetShowDetails('beforeFlipping')}
                                    variant={showDetails === 'beforeFlipping' ? 'primary' : 'secondary'}
                                >
                                    Before flip
                                </Button>
                            </ButtonGroup>
                        </div>

                        <div className="config-section">
                            <div className="config-label">Options:</div>
                            <Form.Check
                                type="checkbox"
                                id="randomize-checkbox"
                                label="Shuffle card order"
                                checked={randomize}
                                onChange={handleToggleRandomize}
                            />
                        </div>
                    </Form>
                </BootstrapCard.Body>

                <BootstrapCard.Footer className="config-submit-button-area">
                    <Button variant="success" onClick={handleStartDeck}>
                        Start Studying
                    </Button>
                </BootstrapCard.Footer>
            </BootstrapCard>
        </div>
    );
}
