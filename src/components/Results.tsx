import { useState, useEffect } from 'react';
import { Button, Card } from 'react-bootstrap';
import { Location } from 'react-router';
import { useNavigate, useLocation } from 'react-router-dom';
import { ProgressBar } from './ProgressBar';

interface ResultsState {
    correctCount: number;
    totalCards: number;
    elapsedSeconds: number;
    deckName: string;
}

const encouragingPhrases = [
    "You're on fire!",
    "Knowledge is power!",
    "Keep up the great work!",
    "Your brain thanks you!",
    "Practice makes perfect!",
    "You're getting smarter every day!",
    "Impressive dedication!",
    "Way to exercise that brain!",
    "Learning looks good on you!",
    "You crushed it!",
];

function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function getRandomPhrase(): string | undefined {
    const index = Math.floor(Math.random() * encouragingPhrases.length);
    return encouragingPhrases[index] ?? encouragingPhrases[0];
}

function isValidState(state: ResultsState | null): state is ResultsState {
    if (!state) return false;
    // tsc might not like this, but we're ensuring values are defined
    return (
        typeof state.correctCount === 'number' &&
        typeof state.totalCards === 'number' &&
        typeof state.elapsedSeconds === 'number' &&
        typeof state.deckName === 'string' &&
        state.totalCards > 0
    );
}

export function Results() {
    const navigate = useNavigate();
    const location: Location<ResultsState> = useLocation() as Location<ResultsState>;
    const [ animatedPercent, setAnimatedPercent ] = useState(0);
    const [ phrase ] = useState(getRandomPhrase);

    const state = location.state as ResultsState | null;

    // Bookmarks won't remember the route state so should be punted
    useEffect(() => {
        if (!isValidState(state)) {
            void navigate('/');
        }
    }, [ state, navigate ]);

    useEffect(() => {
        if (!isValidState(state)) {
            return;
        }
        // Trigger animation after mount, otherwise it would render immediately
        const timer = setTimeout(() => {
            setAnimatedPercent(Math.round(state.correctCount / state.totalCards * 100));
        }, 100);
        return () => clearTimeout(timer);
    }, [ state ]);

    if (!isValidState(state)) {
        return null;
    }

    const { correctCount, totalCards, elapsedSeconds, deckName } = state;

    const startNewDeck = () => {
        void navigate('/');
    };

    const percentCorrect = Math.round(correctCount / totalCards * 100.0);
    const colorVar = percentCorrect >= 80 ? 'success' :
        percentCorrect >= 50 ? 'warning' : 'danger';

    return (
        <div className="container">
            <Card className="app-form">
                <Card.Header className="config-header">
                    <h2>All Done!</h2>
                    <p>{deckName}</p>
                </Card.Header>

                <Card.Body>
                    <div className="results-stats">
                        <div className="results-score">
                            You got <strong>{correctCount}</strong> out of <strong>{totalCards}</strong> correct!
                        </div>

                        <div className="results-progress">
                            <ProgressBar
                                percent={animatedPercent}
                                variant="standard"
                                color={`var(--bs-${colorVar})`}
                            />
                            <div className="results-percent">{animatedPercent}%</div>
                        </div>

                        <div className="results-time">
                            Completed in <strong>{formatTime(elapsedSeconds)}</strong>
                        </div>

                        <div className="results-phrase">
                            {phrase}
                        </div>
                    </div>
                </Card.Body>

                <Card.Footer className="config-submit-button-area">
                    <Button variant="success" onClick={startNewDeck}>
                        Start another deck
                    </Button>
                </Card.Footer>
            </Card>
        </div>
    );
}
