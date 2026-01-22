import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import * as DecksContext from '../contexts/DecksContext';
import { Decks } from '../api';
import { DeckList } from './DeckList';

const mockDecks: Decks = {
    'deck1': {
        id: 'deck1',
        name: 'Spanish Vocabulary',
        size: 50,
        modified: '2024-01-15T10:00:00Z',
    },
    'deck2': {
        id: 'deck2',
        name: 'State Capitals',
        size: 50,
        modified: '2024-01-10T10:00:00Z',
    },
    'deck3': {
        id: 'deck3',
        name: 'Spanish Verbs',
        size: 30,
        modified: '2024-01-12T10:00:00Z',
    },
};

const mockNavigate = vi.fn();

vi.mock(import('react-router-dom'), async() => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const renderDeckList = (decks: Decks = mockDecks) => {
    vi.spyOn(DecksContext, 'useDecks').mockReturnValue({
        decks,
        isLoading: false,
        error: null,
    });

    return render(
        <MemoryRouter>
            <DeckList />
        </MemoryRouter>,
    );
};

describe('DeckList', () => {
    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    describe('rendering', () => {
        it('renders all decks', () => {
            renderDeckList();

            expect(screen.getByText('Spanish Vocabulary')).toBeInTheDocument();
            expect(screen.getByText('State Capitals')).toBeInTheDocument();
            expect(screen.getByText('Spanish Verbs')).toBeInTheDocument();
        });

        it('renders filter input', () => {
            renderDeckList();
            expect(screen.getByPlaceholderText('Example: State Capitals')).toBeInTheDocument();
        });

        it('renders empty list when no decks', () => {
            renderDeckList({});

            expect(screen.queryByText('Spanish Vocabulary')).not.toBeInTheDocument();
        });
    });

    describe('filtering', () => {
        it('filters decks by name', async() => {
            const user = userEvent.setup();
            renderDeckList();

            const filterInput = screen.getByPlaceholderText('Example: State Capitals');
            await user.type(filterInput, 'Spanish');

            expect(screen.getByText('Spanish Vocabulary')).toBeInTheDocument();
            expect(screen.getByText('Spanish Verbs')).toBeInTheDocument();
            expect(screen.queryByText('State Capitals')).not.toBeInTheDocument();
        });

        it('filters are case insensitive', async() => {
            const user = userEvent.setup();
            renderDeckList();

            const filterInput = screen.getByPlaceholderText('Example: State Capitals');
            await user.type(filterInput, 'spanish');

            expect(screen.getByText('Spanish Vocabulary')).toBeInTheDocument();
            expect(screen.getByText('Spanish Verbs')).toBeInTheDocument();
        });

        it('shows no decks when filter matches nothing', async() => {
            const user = userEvent.setup();
            renderDeckList();

            const filterInput = screen.getByPlaceholderText('Example: State Capitals');
            await user.type(filterInput, 'xyz');

            expect(screen.queryByText('Spanish Vocabulary')).not.toBeInTheDocument();
            expect(screen.queryByText('State Capitals')).not.toBeInTheDocument();
            expect(screen.queryByText('Spanish Verbs')).not.toBeInTheDocument();
        });
    });

    describe('navigation', () => {
        it('navigates to config page when deck is clicked', async() => {
            const user = userEvent.setup();
            renderDeckList();

            const deckButton = screen.getByText('Spanish Vocabulary').closest('.deck-button');
            if (!deckButton) throw new Error('Deck button not found!');
            await user.click(deckButton);

            expect(mockNavigate).toHaveBeenCalledWith('/config/deck1');
        });
    });
});
