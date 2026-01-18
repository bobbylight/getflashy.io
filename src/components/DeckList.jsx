import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { configureDeck } from '../slices/currentDeckSlice'; // Import configureDeck action
import DeckButton from './DeckButton';
import DeckFilter from './DeckFilter';

function DeckList() {
    const [deckFilter, setDeckFilter] = useState('');
    const allDecks = useSelector((state) => state.decks.data); // Get all decks from Redux state
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Initialize navigate hook

    const onDeckFilterChange = (filter) => {
        setDeckFilter(filter);
    };

    const handleDeckClick = (deck) => {
        dispatch(configureDeck(deck.id));
        navigate(`/config/${deck.id}`); // Navigate after dispatching action
    };

    // Filter decks based on deckFilter state
    const filteredDecks = Object.values(allDecks).filter(deck =>
        deck.name.toLowerCase().includes(deckFilter.toLowerCase())
    );

    return (
        <div className="container">
            <DeckFilter label="Filter decks:" helpText="" onChange={onDeckFilterChange} />
            <div className="deck-buttons">
                {filteredDecks.map((deck) => (
                    <DeckButton key={deck.id} deck={deck} onClick={() => handleDeckClick(deck)} />
                ))}
            </div>
        </div>
    );
}

export default DeckList;
