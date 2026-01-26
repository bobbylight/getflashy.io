import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Decks } from '../api';

interface DecksContextType {
    decks: Decks;
    isLoading: boolean;
    error: string | null;
}

const DecksContext = createContext<DecksContextType | undefined>(undefined);

/**
 * Loads available decks from the API.
 */
export const DecksProvider = ({ children}: { children: ReactNode }) => {
    const [ decks, setDecks ] = useState<Decks>({});
    const [ isLoading, setIsLoading ] = useState(true);
    const [ error, setError ] = useState<string | null>(null);

    useEffect(() => {
        const fetchDecks = async() => {
            try {
                const repsonse = await fetch('/decks/metadata.json');
                if (!repsonse.ok) {
                    throw new Error('Failed to fetch decks');
                }
                const data = await repsonse.json() as Decks;
                setDecks(data);
            }
            catch (e: unknown) {
                if (e instanceof Error) {
                    setError(e.message);
                }
                else {
                    setError('Unknown error occurred loading decks');
                }
            }
            finally {
                setIsLoading(false);
            }
        };

        void fetchDecks();
    }, []);

    const value = { decks, isLoading, error };

    return <DecksContext.Provider value={value}>{children}</DecksContext.Provider>;
};

/**
 * Fetches available decks.
 */
export const useDecks = () => {
    const context = useContext(DecksContext);
    if (context === undefined) {
        throw new Error('useDecks must be used within a DecksProvider');
    }
    return context;
};
