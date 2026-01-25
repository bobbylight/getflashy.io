import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Results } from './Results';

const mockNavigate = vi.fn();
let mockLocationState: unknown = null;

vi.mock(import('react-router-dom'), async() => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useLocation: () => ({ state: mockLocationState }),
    } as unknown as typeof actual;
});

const createValidState = (overrides?: Partial<{
    correctCount: number;
    totalCards: number;
    elapsedSeconds: number;
    deckName: string;
}>) => ({
    correctCount: 8,
    totalCards: 10,
    elapsedSeconds: 125,
    deckName: 'Spanish Vocabulary',
    ...overrides,
});

const renderResults = () => {
    return render(
        <MemoryRouter>
            <Results />
        </MemoryRouter>,
    );
};

describe('Results', () => {
    beforeEach(() => {
        mockLocationState = createValidState();
        vi.useFakeTimers();
    });

    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
        vi.useRealTimers();
        mockLocationState = null;
    });

    describe('rendering with valid state', () => {
        it('renders the header', () => {
            renderResults();

            expect(screen.getByText('All Done!')).toBeInTheDocument();
        });

        it('renders the deck name', () => {
            mockLocationState = createValidState({ deckName: 'French Vocabulary' });
            renderResults();

            expect(screen.getByText('French Vocabulary')).toBeInTheDocument();
        });

        it('renders the score', () => {
            mockLocationState = createValidState({ correctCount: 7, totalCards: 12 });
            renderResults();

            expect(screen.getByText('7')).toBeInTheDocument();
            expect(screen.getByText('12')).toBeInTheDocument();
            expect(screen.getByText(/correct!/)).toBeInTheDocument();
        });

        it('renders the elapsed time formatted as mm:ss', () => {
            mockLocationState = createValidState({ elapsedSeconds: 185 });
            renderResults();

            expect(screen.getByText('3:05')).toBeInTheDocument();
        });

        it('renders time with leading zero for seconds under 10', () => {
            mockLocationState = createValidState({ elapsedSeconds: 65 });
            renderResults();

            expect(screen.getByText('1:05')).toBeInTheDocument();
        });

        it('renders the progress bar', () => {
            const { container } = renderResults();

            expect(container.querySelector('.progress-bar-standard')).toBeInTheDocument();
        });

        it('renders an encouraging phrase', () => {
            const { container } = renderResults();

            const phraseElement = container.querySelector('.results-phrase');
            expect(phraseElement).toBeInTheDocument();
            expect(phraseElement?.textContent).not.toBe('');
        });

        it('renders the start another deck button', () => {
            renderResults();

            expect(screen.getByText('Start another deck')).toBeInTheDocument();
        });
    });

    describe('progress bar animation', () => {
        it('starts at 0 percent', () => {
            renderResults();

            expect(screen.getByText('0%')).toBeInTheDocument();
        });

        it('animates to actual percent after delay', async() => {
            vi.useRealTimers();
            mockLocationState = createValidState({ correctCount: 8, totalCards: 10 });
            renderResults();

            // Initially 0%
            expect(screen.getByText('0%')).toBeInTheDocument();

            // Wait for the animation delay and state update
            await waitFor(() => {
                expect(screen.getByText('80%')).toBeInTheDocument();
            });
        });
    });

    describe('progress bar color', () => {
        it('uses success color for 80% or higher', async() => {
            mockLocationState = createValidState({ correctCount: 8, totalCards: 10 });
            const { container } = renderResults();

            await vi.advanceTimersByTimeAsync(150);

            const fill = container.querySelector('.progress-bar-fill');
            expect(fill).toHaveStyle({ background: 'var(--bs-success)' });
        });

        it('uses warning color for 50-79%', async() => {
            mockLocationState = createValidState({ correctCount: 6, totalCards: 10 });
            const { container } = renderResults();

            await vi.advanceTimersByTimeAsync(150);

            const fill = container.querySelector('.progress-bar-fill');
            expect(fill).toHaveStyle({ background: 'var(--bs-warning)' });
        });

        it('uses danger color for below 50%', async() => {
            mockLocationState = createValidState({ correctCount: 3, totalCards: 10 });
            const { container } = renderResults();

            await vi.advanceTimersByTimeAsync(150);

            const fill = container.querySelector('.progress-bar-fill');
            expect(fill).toHaveStyle({ background: 'var(--bs-danger)' });
        });
    });

    describe('navigation', () => {
        it('navigates to home when start another deck is clicked', async() => {
            vi.useRealTimers();
            const user = userEvent.setup();
            renderResults();

            await user.click(screen.getByText('Start another deck'));

            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });

    describe('invalid state handling', () => {
        it('redirects to home when state is null', async() => {
            mockLocationState = null;
            renderResults();

            await vi.advanceTimersByTimeAsync(0);

            expect(mockNavigate).toHaveBeenCalledWith('/');
        });

        it('redirects to home when state is missing correctCount', async() => {
            mockLocationState = { totalCards: 10, elapsedSeconds: 100, deckName: 'Test' };
            renderResults();

            await vi.advanceTimersByTimeAsync(0);

            expect(mockNavigate).toHaveBeenCalledWith('/');
        });

        it('redirects to home when state is missing totalCards', async() => {
            mockLocationState = { correctCount: 5, elapsedSeconds: 100, deckName: 'Test' };
            renderResults();

            await vi.advanceTimersByTimeAsync(0);

            expect(mockNavigate).toHaveBeenCalledWith('/');
        });

        it('redirects to home when totalCards is 0', async() => {
            mockLocationState = createValidState({ totalCards: 0 });
            renderResults();

            await vi.advanceTimersByTimeAsync(0);

            expect(mockNavigate).toHaveBeenCalledWith('/');
        });

        it('renders null when state is invalid', () => {
            mockLocationState = null;
            const { container } = renderResults();

            expect(container.querySelector('.app-form')).not.toBeInTheDocument();
        });
    });

    describe('encouraging phrases', () => {
        it('displays one of the predefined phrases', () => {
            const { container } = renderResults();

            const phraseElement = container.querySelector('.results-phrase');

            const possiblePhrases = [
                "You're on fire!",
                "Knowledge is power!",
                "Keep up the great work!",
                "Your brain thanks you!",
                "Practice makes perfect!",
                "You're getting smarter every day!",
                "Impressive dedication!",
                "Way to exercise that brain!",
                "Learning looks good on you!",
                "You crushed it!",
            ];

            const phraseText = phraseElement?.textContent ?? '';
            expect(possiblePhrases).toContain(phraseText);
        });
    });
});
