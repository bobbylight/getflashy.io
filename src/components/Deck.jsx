import React, { useState, useEffect } from 'react'; // Added useState, useEffect, useRef
import { useSelector, useDispatch } from 'react-redux'; // For Redux state and dispatch
import { useParams, useNavigate, Link } from 'react-router-dom'; // For route parameters, navigation, Link
import { fetchDeckMetadata } from '../slices/decksSlice'; // For fetching deck info
import Card from './Card';
import DeckStatus from './DeckStatus';
//import ProgressBar from 'react-progress-bar-plus'; // Still commented out
import Timer from './Timer';

// Utility function for Fisher-Yates shuffle
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function Deck() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { deckId: currentDeckIdParam } = useParams(); // Get deckId from URL

    // Redux state
    const currentDeckRedux = useSelector(state => state.currentDeck); // The ID of the currently selected deck from Redux
    const allDecks = useSelector(state => state.decks.data); // All decks metadata
    const config = useSelector(state => state.config); // Configuration for the deck

    // Local state
    const [deck, setDeck] = useState(null); // Full deck data, after fetching and configuring
    const [curCard, setCurCard] = useState(0);
    const [cardFlipped, setCardFlipped] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [animating, setAnimating] = useState(false);
    const [animation, setAnimation] = useState(null);

    // Fetch deck info when component mounts or deckId changes
    useEffect(() => {
        if (!allDecks[currentDeckIdParam]) { // If deck metadata not in Redux state, fetch it
            dispatch(fetchDeckMetadata()); // Dispatch the async thunk
        }
    }, [currentDeckIdParam, allDecks, dispatch]);

    // When currentDeckIdParam changes, fetch and configure the specific deck
    useEffect(() => {
        const fetchSpecificDeck = async () => {
            if (!currentDeckIdParam) {
                setDeck(null);
                return;
            }

            // Fetch full deck data from API
            try {
                const response = await fetch(`/api/decks/${currentDeckIdParam}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch specific deck data');
                }
                const data = await response.json();
                
                let loadedDeck = { ...data }; // Clone to avoid direct mutation

                if (config.randomize) {
                    loadedDeck.cards = shuffleArray([...loadedDeck.cards]); // Shuffle cards if randomize is true
                }

                setDeck(loadedDeck);
                setCurCard(0);
                setCardFlipped(false);
                setCorrectCount(0);
                setStartTime(new Date());
                setAnimating(false);

            } catch (error) {
                console.error("Error fetching specific deck:", error);
                setDeck(null);
            }
        };

        fetchSpecificDeck();
    }, [currentDeckIdParam, config.randomize]); // Dependencies: currentDeckIdParam, config.randomize


    // Global keydown handler for all card actions
    useEffect(() => {
        const handleKeyDown = (e) => {
            // When a card is animating away, don't allow updating the next card before it's done'
            if (animating) {
                return;
            }
            switch (e.key) {
                case 'ArrowLeft':
                    userKnewCard(false);
                    break;
                case 'ArrowRight':
                    userKnewCard(true);
                    break;
                case 'ArrowDown':
                    if (!cardFlipped) {
                        setCardFlipped(true);
                    }
                    e.stopPropagation();
                    e.preventDefault();
                    break;
                case 'ArrowUp':
                    if (cardFlipped) {
                        setCardFlipped(false);
                    }
                    e.stopPropagation();
                    e.preventDefault();
                    break;
                default:
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [animating, cardFlipped]); // Re-run if animating or flipped state changes


    const advance = (knewCard) => {
        setCorrectCount(prevCount => prevCount + (knewCard ? 1 : 0));

        if (curCard < deck.cards.length - 1) {
            setCurCard(prevCard => prevCard + 1);
            setCardFlipped(false);
            setAnimating(false);
        } else {
            navigate(`/results/${currentDeckIdParam}`);
        }
    };

    const handleAnimationEnd = () => {
        const knew = animation === 'right';
        setAnimation(null); // Reset animation state
        advance(knew);
    };

    const noSuchDeck = () => {
        return (
            <div className="container">
                No such deck!
                <p>
                    <Link to="/">Back to deck list</Link>
                </p>
            </div>
        );
    };

    const loadingScreen = () => {
        return (
            <div className="container">
                Loading...
            </div>
        );
    };

    const toggleCardVisibleSide = (e) => {
        setCardFlipped(prevFlipped => !prevFlipped);
        e.stopPropagation();
        e.preventDefault();
    };

    const userKnewCard = (knew) => {
        if (!animating) {
            setAnimating(true);
            setAnimation(knew ? 'right' : 'left');
        }
    };

    if (deck === null) {
        return loadingScreen();
    }
    if (!deck.cards || deck.cards.length === 0) {
        return noSuchDeck();
    }
    if (currentDeckIdParam !== deck.id) {
        return noSuchDeck();
    }


    const fillHeight = { height: '100%' };
    const percent = (curCard / deck.cards.length) * 100;

    const nextCardStyle = {
        zIndex: -100,
        position: 'absolute',
        width: '100%'
    };

    const card = deck.cards[curCard];
    const nextCard = curCard < deck.cards.length - 1 ? deck.cards[curCard + 1] : null;


    return (
        <div style={fillHeight}>
            <div className="deck">
                {/*<ProgressBar spinner={false} percent={percent}/>*/}
                <div className="deck-nav left-nav" onClick={() => userKnewCard(false)}>
                    <i className="fa fa-chevron-left" aria-hidden="true"></i>
                </div>
                <div className="deck-card-section">
                    <Timer startTime={startTime}></Timer>
                    {nextCard && (
                        <div style={nextCardStyle}>
                            <Card key={nextCard.front.text} card={nextCard} flipped={false} isTopCard={false} />
                        </div>
                    )}
                    <Card
                        key={card.front.text}
                        card={card}
                        flipped={cardFlipped}
                        isTopCard={true}
                        animation={animation}
                        onAnimationEnd={handleAnimationEnd}
                        userKnewCard={userKnewCard}
                        toggleVisibleSide={toggleCardVisibleSide}
                    />

                    <div>
                        <DeckStatus curCard={curCard + 1} cardCount={deck.cards.length}
                                correctCount={correctCount} />
                    </div>
                </div>
                <div className="deck-nav right-nav" onClick={() => userKnewCard(true)}>
                    <i className="fa fa-chevron-right" aria-hidden="true" ></i>
                </div>
            </div>
        </div>
    );
}

export default Deck;
