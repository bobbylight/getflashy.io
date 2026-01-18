import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { configureDeck } from '../slices/currentDeckSlice';
import DeckButton from './DeckButton';
import DeckFilter from './DeckFilter';
import { RootState, AppDispatch } from '../main';
import { DeckMetadata } from '../slices/decksSlice';

function DeckList() {
    const [deckFilter, setDeckFilter] = useState<string>('');
    const allDecks = useSelector((state: RootState) => state.decks.data);
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();

    const onDeckFilterChange = (filter: string) => {
        setDeckFilter(filter);
    };

    const handleDeckClick = (deck: DeckMetadata) => {
        dispatch(configureDeck(deck.id));
        navigate(`/config/${deck.id}`);
    };

    // Filter decks based on deckFilter state
    const filteredDecks: DeckMetadata[] = Object.values(allDecks).filter((deck: DeckMetadata) =>
        deck.name.toLowerCase().includes(deckFilter.toLowerCase())
    );

    return (
        <div className="container">
            <DeckFilter label="Filter decks:" helpText="" onChange={onDeckFilterChange} />
            <div className="deck-buttons">
                {filteredDecks.map((deck) => (
                    <DeckButton key={deck.id} deck={deck} onClick={handleDeckClick} />
                ))}
            </div>
        </div>
    );
}

export default DeckList;
