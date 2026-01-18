import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Results() { // No props needed for Redux connection here

    const navigate = useNavigate();

    const startNewDeck = () => {
        // The original goHome action (which onStartNewDeck dispatched) primarily handled navigation.
        // Since navigation is now handled directly via useNavigate, no Redux dispatch is needed here.
        navigate('/'); // Navigate to home
    };

    return (
        <div className="container">
            <Card className="app-form">
                <Card.Header className="config-header" fill>
                    <h2>All Done!</h2>
                    <p>
                        Here's you you did:
                    </p>
                </Card.Header>

                <Card.Body> {/* Panel body content goes into Card.Body */}
                    Amazing!!!
                </Card.Body>

                <Card.Footer className="config-submit-button-area"> {/* Footer for actions */}
                    <Button variant="success" onClick={startNewDeck}>Start another deck</Button>
                </Card.Footer>
            </Card>
        </div>
    );
}

export default Results;
