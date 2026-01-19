import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DeckButton from './DeckButton';
import DeckFilter from './DeckFilter';
import { DeckMetadata } from '../api';
import { useDecks } from '../contexts/DecksContext';

function DeckList() {
    const [deckFilter, setDeckFilter] = useState<string>('');
    const decksContext = useDecks();
    const navigate = useNavigate();

    const onDeckFilterChange = (filter: string) => {
        setDeckFilter(filter);
    };

    const handleDeckClick = (deck: DeckMetadata) => {
        navigate(`/config/${deck.id}`);
    };

    // Filter decks based on deckFilter state
    const allDecks = decksContext.decks;
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
