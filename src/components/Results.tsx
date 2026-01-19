import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export function Results() {

    const navigate = useNavigate();

    const startNewDeck = () => {
        void navigate('/'); // Navigate to home
    };

    return (
        <div className="container">
            <Card className="app-form">
                <Card.Header className="config-header">
                    <h2>All Done!</h2>
                    <p>
                        Here's you you did:
                    </p>
                </Card.Header>

                <Card.Body>
                    Amazing!!!
                </Card.Body>

                <Card.Footer className="config-submit-button-area">
                    <Button variant="success" onClick={startNewDeck}>Start another deck</Button>
                </Card.Footer>
            </Card>
        </div>
    );
}
