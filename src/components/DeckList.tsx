import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeckMetadata } from '../api';
import { useDecks } from '../contexts/DecksContext';
import { DeckButton } from './DeckButton';
import { DeckFilter } from './DeckFilter';

export function DeckList() {
    const [ deckFilter, setDeckFilter ] = useState<string>('');
    const decksContext = useDecks();
    const navigate = useNavigate();

    const onDeckFilterChange = (filter: string) => {
        setDeckFilter(filter);
    };

    const handleDeckClick = (deck: DeckMetadata) => {
        void navigate(`/config/${deck.id}`);
    };

    // Filter decks based on deckFilter state
    const allDecks = decksContext.decks;
    const filteredDecks: DeckMetadata[] = Object.values(allDecks).filter((deck: DeckMetadata) =>
        deck.name.toLowerCase().includes(deckFilter.toLowerCase()),
    );

    return (
        <div className="container">
            <DeckFilter label="Filter decks:" onChange={onDeckFilterChange} />
            <div className="deck-buttons">
                {filteredDecks.map(deck =>
                    <DeckButton key={deck.id} deck={deck} onClick={handleDeckClick} />,
                )}
            </div>
        </div>
    );
}
