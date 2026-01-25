import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import { render, screen, cleanup, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Deck as FullDeck } from '../api';
import { Deck } from './Deck';

const mockNavigate = vi.fn();
let mockDeckId: string | undefined = 'test-deck-123';
let mockSearchParams = new URLSearchParams();

vi.mock(import('react-router-dom'), async() => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => ({ deckId: mockDeckId }),
        useSearchParams: () => [ mockSearchParams ],
    } as unknown as typeof actual;
});

const createMockDeck = (overrides?: Partial<FullDeck>): FullDeck => ({
    id: 'test-deck-123',
    name: 'Spanish Vocabulary',
    cards: [
        { front: { text: 'Hola' }, back: { text: 'Hello' } },
        { front: { text: 'Adiós' }, back: { text: 'Goodbye' } },
        { front: { text: 'Gracias' }, back: { text: 'Thank you' } },
    ],
    ...overrides,
});

const renderDeck = () => {
    return render(
        <MemoryRouter>
            <Deck />
        </MemoryRouter>,
    );
};

const waitForDeckToLoad = async(container: HTMLElement) => {
    await waitFor(() => {
        expect(container.querySelector('.card.topCard')).toBeInTheDocument();
    });
};

describe('Deck', () => {
    beforeEach(() => {
        mockDeckId = 'test-deck-123';
        mockSearchParams = new URLSearchParams('randomize=false');
        vi.spyOn(globalThis, 'fetch').mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(createMockDeck()),
        } as Response);
    });

    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
        vi.restoreAllMocks();
    });

    describe('loading state', () => {
        it('shows loading screen initially', () => {
            renderDeck();
            expect(screen.getByText('Loading...')).toBeInTheDocument();
        });

        it('shows loading screen when no deckId param', () => {
            mockDeckId = undefined;
            renderDeck();
            expect(screen.getByText('Loading...')).toBeInTheDocument();
        });
    });

    describe('fetching deck data', () => {
        it('fetches deck from API on mount', async() => {
            renderDeck();

            await waitFor(() => {
                expect(globalThis.fetch).toHaveBeenCalledWith('/api/decks/test-deck-123');
            });
        });

        it('renders deck content after fetch', async() => {
            const { container } = renderDeck();

            await waitForDeckToLoad(container);

            // Once on front of card, once as "hint text" on back
            expect(screen.getAllByText(/Hola/).length).toEqual(2);
        });

        it('shows no such deck when deck has no cards', async() => {
            vi.spyOn(globalThis, 'fetch').mockResolvedValue({
                ok: true,
                json: () => Promise.resolve(createMockDeck({ cards: [] })),
            } as Response);

            renderDeck();

            await waitFor(() => {
                expect(screen.getByText('No such deck!')).toBeInTheDocument();
            });
        });

        it('shows no such deck when deckId does not match', async() => {
            vi.spyOn(globalThis, 'fetch').mockResolvedValue({
                ok: true,
                json: () => Promise.resolve(createMockDeck({ id: 'different-deck' })),
            } as Response);

            renderDeck();

            await waitFor(() => {
                expect(screen.getByText('No such deck!')).toBeInTheDocument();
            });
        });

        it('handles fetch error gracefully', async() => {
            vi.spyOn(globalThis, 'fetch').mockResolvedValue({
                ok: false,
            } as Response);
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            renderDeck();

            await waitFor(() => {
                expect(consoleSpy).toHaveBeenCalled();
            });
        });
    });

    describe('deck status display', () => {
        it('shows current card position', async() => {
            renderDeck();

            await waitFor(() => {
                expect(screen.getByText(/1 \/ 3/)).toBeInTheDocument();
            });
        });

        it('shows the number of cards correct count', async() => {
            renderDeck();

            await waitFor(() => {
                // The correct count is shown as just the number in a span
                const statusElement = screen.getByText(/1 \/ 3/).closest('.deck-status');
                expect(statusElement).toHaveTextContent('0');
            });
        });
    });

    describe('navigation arrows', () => {
        it('renders left navigation arrow', async() => {
            const { container } = renderDeck();

            await waitForDeckToLoad(container);

            const leftNav = container.querySelector('.left-nav');
            expect(leftNav).toBeInTheDocument();
        });

        it('renders right navigation arrow', async() => {
            const { container } = renderDeck();

            await waitForDeckToLoad(container);

            const rightNav = container.querySelector('.right-nav');
            expect(rightNav).toBeInTheDocument();
        });

        it('triggers animation when left nav clicked', async() => {
            const { container } = renderDeck();

            await waitForDeckToLoad(container);

            const leftNav = container.querySelector('.left-nav');
            if (!leftNav) throw new Error('Left nav not found');
            fireEvent.click(leftNav);

            await waitFor(() => {
                const card = container.querySelector('.sliding-left');
                expect(card).toBeInTheDocument();
            });
        });

        it('triggers animation when right nav clicked', async() => {
            const { container } = renderDeck();

            await waitForDeckToLoad(container);

            const rightNav = container.querySelector('.right-nav');
            if (!rightNav) throw new Error('Right nav not found');
            fireEvent.click(rightNav);

            await waitFor(() => {
                const card = container.querySelector('.sliding-right');
                expect(card).toBeInTheDocument();
            });
        });
    });

    describe('keyboard navigation', () => {
        it('triggers left animation on ArrowLeft key', async() => {
            const { container } = renderDeck();

            await waitForDeckToLoad(container);

            fireEvent.keyDown(document, { key: 'ArrowLeft' });

            await waitFor(() => {
                const card = container.querySelector('.sliding-left');
                expect(card).toBeInTheDocument();
            });
        });

        it('triggers right animation on ArrowRight key', async() => {
            const { container } = renderDeck();

            await waitForDeckToLoad(container);

            fireEvent.keyDown(document, { key: 'ArrowRight' });

            await waitFor(() => {
                const card = container.querySelector('.sliding-right');
                expect(card).toBeInTheDocument();
            });
        });

        it('ignores keyboard input during animation', async() => {
            const { container } = renderDeck();

            await waitForDeckToLoad(container);

            // Trigger first animation
            fireEvent.keyDown(document, { key: 'ArrowRight' });

            await waitFor(() => {
                expect(container.querySelector('.sliding-right')).toBeInTheDocument();
            });

            // Try to trigger another animation while first is running
            fireEvent.keyDown(document, { key: 'ArrowLeft' });

            // Should still be right animation, not left
            expect(container.querySelector('.sliding-right')).toBeInTheDocument();
            expect(container.querySelector('.sliding-left')).not.toBeInTheDocument();
        });

        it('flips card when ArrowDown key pressed', async() => {
            const { container } = renderDeck();

            await waitForDeckToLoad(container);

            // Card should not be flipped initially
            expect(container.querySelector('.card.topCard.flipped')).not.toBeInTheDocument();

            fireEvent.keyDown(document, { key: 'ArrowDown' });

            // Card should now be flipped
            expect(container.querySelector('.card.topCard.flipped')).toBeInTheDocument();
        });

        it('unflips card when ArrowUp key pressed', async() => {
            const { container } = renderDeck();

            await waitForDeckToLoad(container);

            // First flip the card
            fireEvent.keyDown(document, { key: 'ArrowDown' });
            expect(container.querySelector('.card.topCard.flipped')).toBeInTheDocument();

            // Then unflip with ArrowUp
            fireEvent.keyDown(document, { key: 'ArrowUp' });
            expect(container.querySelector('.card.topCard.flipped')).not.toBeInTheDocument();
        });

        it('does not flip when already flipped and ArrowDown pressed', async() => {
            const { container } = renderDeck();

            await waitForDeckToLoad(container);

            // Flip the card
            fireEvent.keyDown(document, { key: 'ArrowDown' });
            expect(container.querySelector('.card.topCard.flipped')).toBeInTheDocument();

            // Press ArrowDown again - should still be flipped (no change)
            fireEvent.keyDown(document, { key: 'ArrowDown' });
            expect(container.querySelector('.card.topCard.flipped')).toBeInTheDocument();
        });

        it('does not unflip when already unflipped and ArrowUp pressed', async() => {
            const { container } = renderDeck();

            await waitForDeckToLoad(container);

            // Card should not be flipped initially
            expect(container.querySelector('.card.topCard.flipped')).not.toBeInTheDocument();

            // Press ArrowUp - should still not be flipped (no change)
            fireEvent.keyDown(document, { key: 'ArrowUp' });
            expect(container.querySelector('.card.topCard.flipped')).not.toBeInTheDocument();
        });
    });

    describe('card click interaction', () => {
        it('toggles card flip state when card is clicked', async() => {
            const { container } = renderDeck();

            await waitForDeckToLoad(container);

            const card = container.querySelector('.card.topCard');
            if (!card) throw new Error('Card not found');

            // Card should not be flipped initially
            expect(container.querySelector('.card.topCard.flipped')).not.toBeInTheDocument();

            // Click to flip
            fireEvent.click(card);
            expect(container.querySelector('.card.topCard.flipped')).toBeInTheDocument();

            // Click again to unflip
            fireEvent.click(card);
            expect(container.querySelector('.card.topCard.flipped')).not.toBeInTheDocument();
        });
    });

    describe('card progression', () => {
        it('advances to next card after animation ends', async() => {
            const { container } = renderDeck();

            await waitForDeckToLoad(container);

            // Click right to trigger animation
            const rightNav = container.querySelector('.right-nav');
            if (!rightNav) throw new Error('Right nav not found');
            fireEvent.click(rightNav);

            await waitFor(() => {
                expect(container.querySelector('.sliding-right')).toBeInTheDocument();
            });

            // Simulate animation end
            const animatedCard = container.querySelector('.sliding-right');
            if (!animatedCard) throw new Error('Animated card not found');
            fireEvent.animationEnd(animatedCard);

            await waitFor(() => {
                // After advancing, the second card (Adiós) should be the top card
                const topCard = container.querySelector('.card.topCard .card-front .main-card-content');
                expect(topCard).toHaveTextContent('Adiós');
            });
        });

        it('increments correct count when user knew card', async() => {
            const { container } = renderDeck();

            await waitForDeckToLoad(container);

            // Click right (knew)
            const rightNav = container.querySelector('.right-nav');
            if (!rightNav) throw new Error('Right nav not found');
            fireEvent.click(rightNav);

            await waitFor(() => {
                expect(container.querySelector('.sliding-right')).toBeInTheDocument();
            });

            // Simulate animation end
            const animatedCard = container.querySelector('.sliding-right');
            if (!animatedCard) throw new Error('Animated card not found');
            fireEvent.animationEnd(animatedCard);

            await waitFor(() => {
                expect(screen.getByText(/2 \/ 3/)).toBeInTheDocument();
                const statusElement = screen.getByText(/2 \/ 3/).closest('.deck-status');
                expect(statusElement).toHaveTextContent('1');
            });
        });

        it('does not increment correct count when user did not know card', async() => {
            const { container } = renderDeck();

            await waitForDeckToLoad(container);

            // Click left (didn't know)
            const leftNav = container.querySelector('.left-nav');
            if (!leftNav) throw new Error('Left nav not found');
            fireEvent.click(leftNav);

            await waitFor(() => {
                expect(container.querySelector('.sliding-left')).toBeInTheDocument();
            });

            // Simulate animation end
            const animatedCard = container.querySelector('.sliding-left');
            if (!animatedCard) throw new Error('Animated card not found');
            fireEvent.animationEnd(animatedCard);

            await waitFor(() => {
                expect(screen.getByText(/2 \/ 3/)).toBeInTheDocument();
                const statusElement = screen.getByText(/2 \/ 3/).closest('.deck-status');
                // Correct count should still be 0
                const correctSpan = statusElement?.querySelector('span');
                expect(correctSpan).toHaveTextContent('0');
            });
        });

        it('navigates to results when deck is complete', async() => {
            vi.spyOn(globalThis, 'fetch').mockResolvedValue({
                ok: true,
                json: () => Promise.resolve(createMockDeck({
                    cards: [ { front: { text: 'Only Card' }, back: { text: 'Answer' } } ],
                })),
            } as Response);

            const { container } = renderDeck();

            await waitForDeckToLoad(container);

            // Click right
            const rightNav = container.querySelector('.right-nav');
            if (!rightNav) throw new Error('Right nav not found');
            fireEvent.click(rightNav);

            await waitFor(() => {
                expect(container.querySelector('.sliding-right')).toBeInTheDocument();
            });

            // Simulate animation end
            const animatedCard = container.querySelector('.sliding-right');
            if (!animatedCard) throw new Error('Animated card not found');
            fireEvent.animationEnd(animatedCard);

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith(
                    '/results/test-deck-123',
                    {
                        state: {
                            correctCount: 1,
                            elapsedSeconds: expect.any(Number) as number,
                            totalCards: 1,
                            deckName: 'Spanish Vocabulary',
                        },
                    },
                );
            });
        });
    });

    describe('config from search params', () => {
        it('shuffles cards when randomize is true', async() => {
            mockSearchParams = new URLSearchParams('randomize=true');
            const mockRandom = vi.spyOn(Math, 'random').mockReturnValue(0.1);

            renderDeck();

            await waitFor(() => {
                expect(globalThis.fetch).toHaveBeenCalled();
            });

            // Math.random should have been called for shuffling
            expect(mockRandom).toHaveBeenCalled();
        });

        it('does not shuffle when randomize is false', async() => {
            mockSearchParams = new URLSearchParams('randomize=false');
            const mockRandom = vi.spyOn(Math, 'random');

            const { container } = renderDeck();

            await waitForDeckToLoad(container);

            // Math.random should not have been called
            expect(mockRandom).not.toHaveBeenCalled();
        });
    });

    describe('back link', () => {
        it('shows back link when deck not found', async() => {
            vi.spyOn(globalThis, 'fetch').mockResolvedValue({
                ok: true,
                json: () => Promise.resolve(createMockDeck({ cards: [] })),
            } as Response);

            renderDeck();

            await waitFor(() => {
                expect(screen.getByText('Back to deck list')).toBeInTheDocument();
            });
        });
    });
});
