import React, { useState, useEffect, MouseEvent, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Deck as FullDeck } from '../api';
import { Card } from './Card';
import { DeckStatus } from './DeckStatus';
import { Timer } from './Timer';
import { ProgressBar } from './ProgressBar';

// Utility function for Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ array[i], array[j] ] = [ array[j] as T, array[i] as T ];
    }
    return array;
}

interface DeckParams {
  deckId?: string;
  [key: string]: string | undefined;
}

export function Deck() {
    const navigate = useNavigate();
    const { deckId: currentDeckIdParam } = useParams<DeckParams>();
    const [ searchParams ] = useSearchParams();

    const config = {
        randomize: (searchParams.get('randomize') ?? 'true') === 'true',
        showSide: searchParams.get('showSide') ?? 'front',
        showDetails: searchParams.get('showDetails') ?? 'always',
    };

    // Local state
    const [ deck, setDeck ] = useState<FullDeck | null>(null);
    const [ curCard, setCurCard ] = useState<number>(0);
    const [ cardFlipped, setCardFlipped ] = useState<boolean>(false);
    const [ correctCount, setCorrectCount ] = useState<number>(0);
    const [ startTime, setStartTime ] = useState<Date>(new Date());
    const [ animating, setAnimating ] = useState<boolean>(false);
    const [ animation, setAnimation ] = useState<'right' | 'left' | undefined>();

    const userKnewCard = useCallback((knew: boolean) => {
        if (!animating) {
            setAnimating(true);
            setAnimation(knew ? 'right' : 'left');
        }
    }, [ animating ]);

    // When currentDeckIdParam changes, fetch and configure the specific deck
    useEffect(() => {
        const fetchSpecificDeck = async() => {
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
                const data = await response.json() as FullDeck;

                const loadedDeck = { ...data };
                if (config.randomize) {
                    loadedDeck.cards = shuffleArray([ ...loadedDeck.cards ]);
                }

                setDeck(loadedDeck);
                setCurCard(0);
                setCardFlipped(false);
                setCorrectCount(0);
                setStartTime(new Date());
                setAnimating(false);

            }
            catch (error) {
                console.error("Error fetching specific deck:", error);
                setDeck(null);
            }
        };

        void fetchSpecificDeck();
    }, [ currentDeckIdParam, config.randomize ]);


    // Global keydown handler for all card actions
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // When a card is animating away, don't allow updating the next card before it's done
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
    }, [ animating, cardFlipped, userKnewCard ]);


    const advance = (knewCard: boolean) => {
        setCorrectCount(prevCount => prevCount + (knewCard ? 1 : 0));

        if (deck && curCard < deck.cards.length - 1) {
            setCurCard(prevCard => prevCard + 1);
            setCardFlipped(false);
            setAnimating(false);
        }
        else if (deck) {
            const elapsedSeconds = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
            void navigate(`/results/${currentDeckIdParam}`, {
                state: {
                    correctCount: correctCount + (knewCard ? 1 : 0),
                    totalCards: deck.cards.length,
                    elapsedSeconds,
                    deckName: deck.name,
                },
            });
        }
    };

    const handleAnimationEnd = () => {
        const knew = animation === 'right';
        setAnimation(undefined);
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

    const toggleCardVisibleSide = (e: MouseEvent<HTMLDivElement>) => {
        setCardFlipped(prevFlipped => !prevFlipped);
        e.stopPropagation();
        e.preventDefault();
    };

    if (deck === null || !currentDeckIdParam) {
        return loadingScreen();
    }
    if (deck.cards.length === 0) {
        return noSuchDeck();
    }
    if (currentDeckIdParam !== deck.id) {
        return noSuchDeck();
    }

    const fillHeight: React.CSSProperties = { height: '100%' };

    const nextCardStyle: React.CSSProperties = {
        zIndex: -100,
        position: 'absolute',
        width: '100%',
    };

    const card = deck.cards[curCard];
    const nextCard = curCard < deck.cards.length - 1 ? deck.cards[curCard + 1] : null;
    const percent = curCard / deck.cards.length * 100.0;

    return (
        <div style={fillHeight}>
            <div className="deck">
                <ProgressBar percent={percent} color="var(--brand-color-light)"/>
                <div className="deck-nav left-nav" onClick={() => {
                    userKnewCard(false);
                }}>
                    <i className="fa-solid fa-chevron-left" aria-hidden="true"></i>
                </div>
                <div className="deck-card-section">
                    <Timer startTime={startTime}></Timer>
                    {nextCard &&
                        <div style={nextCardStyle}>
                            <Card key={nextCard.front.text} card={nextCard} flipped={false} isTopCard={false} icon={deck.icon} deckName={deck.name} />
                        </div>
                    }
                    {card &&
                        <Card
                            key={card.front.text}
                            card={card}
                            flipped={cardFlipped}
                            isTopCard={true}
                            animation={animation}
                            onAnimationEnd={handleAnimationEnd}
                            userKnewCard={userKnewCard}
                            toggleVisibleSide={toggleCardVisibleSide}
                            icon={deck.icon}
                            deckName={deck.name}
                        />
                    }
                    <div>
                        <DeckStatus curCard={curCard + 1} cardCount={deck.cards.length}
                            correctCount={correctCount} />
                    </div>
                </div>
                <div className="deck-nav right-nav" onClick={() => {
                    userKnewCard(true);
                }}>
                    <i className="fa-solid fa-chevron-right" aria-hidden="true"></i>
                </div>
            </div>
        </div>
    );
}
