import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeckMetadata } from '../api';
import { DeckButton } from './DeckButton';

const createMockDeck = (overrides?: Partial<DeckMetadata>): DeckMetadata => ({
    id: 'deck-123',
    name: 'Spanish Vocabulary',
    size: 50,
    modified: '2024-01-15T10:00:00Z',
    ...overrides,
});

describe('DeckButton', () => {
    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    describe('rendering', () => {
        it('renders the deck name', () => {
            const deck = createMockDeck({ name: 'State Capitals' });
            render(<DeckButton deck={deck} onClick={vi.fn()} />);

            expect(screen.getByText('State Capitals')).toBeInTheDocument();
        });

        it('renders the card count', () => {
            const deck = createMockDeck({ size: 75 });
            render(<DeckButton deck={deck} onClick={vi.fn()} />);

            expect(screen.getByText('75 cards')).toBeInTheDocument();
        });

        it('renders the formatted upload date', () => {
            const deck = createMockDeck({ modified: '2024-03-20T15:30:00Z' });
            render(<DeckButton deck={deck} onClick={vi.fn()} />);

            const expectedDate = new Date('2024-03-20T15:30:00Z').toDateString();
            expect(screen.getByText(`Uploaded ${expectedDate}`)).toBeInTheDocument();
        });
    });

    describe('icon rendering', () => {
        it('renders default icon when no icon provided', () => {
            const deck = createMockDeck({ icon: undefined });
            const { container } = render(<DeckButton deck={deck} onClick={vi.fn()} />);

            const icon = container.querySelector('.fa-smile-o');
            expect(icon).toBeInTheDocument();
        });

        it('renders custom icon when provided', () => {
            const deck = createMockDeck({ icon: { name: 'star', color: 'gold' } });
            const { container } = render(<DeckButton deck={deck} onClick={vi.fn()} />);

            const icon = container.querySelector('.fa-star');
            expect(icon).toBeInTheDocument();
        });

        it('renders default color when no icon color provided', () => {
            const deck = createMockDeck({ icon: undefined });
            const { container } = render(<DeckButton deck={deck} onClick={vi.fn()} />);

            const icon = container.querySelector('.deck-icon i');
            expect(icon).toHaveStyle({ color: 'rgb(0, 0, 0)' });
        });

        it('renders custom color when provided', () => {
            const deck = createMockDeck({ icon: { name: 'heart', color: 'red' } });
            const { container } = render(<DeckButton deck={deck} onClick={vi.fn()} />);

            const icon = container.querySelector('.deck-icon i');
            expect(icon).toHaveStyle({ color: 'rgb(255, 0, 0)' });
        });
    });

    describe('click handling', () => {
        it('calls onClick with deck when clicked', async() => {
            const user = userEvent.setup();
            const handleClick = vi.fn();
            const deck = createMockDeck();
            render(<DeckButton deck={deck} onClick={handleClick} />);

            const button = screen.getByText('Spanish Vocabulary').closest('.deck-button');
            if (!button) throw new Error('Deck button not found!');
            await user.click(button);

            expect(handleClick).toHaveBeenCalledTimes(1);
            expect(handleClick).toHaveBeenCalledWith(deck);
        });

        it('does not call onClick before being clicked', () => {
            const handleClick = vi.fn();
            const deck = createMockDeck();
            render(<DeckButton deck={deck} onClick={handleClick} />);

            expect(handleClick).not.toHaveBeenCalled();
        });
    });
});
