export interface CardData {
    front: CardSideContent;
    back: CardSideContent;
}

interface CardSideContent {
    text: string;
    context1?: string;
    context2?: string;
}

/**
 * Information about a deck retrieved from the API.
 */
export interface DeckMetadata {
    id: string;
    name: string;
    icon?: {
        name: string;
        color: string;
    };
    size: number; // Added property
    modified: string; // Added property
}

/**
 * Information about all available decks, as retrieved from the API.
 */
export type Decks = Record<string, DeckMetadata>;

export interface Deck {
    id: string;
    name: string;
    icon?: {
        name: string;
        color: string;
    };
    cards: CardData[];
}
