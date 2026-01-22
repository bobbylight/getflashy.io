import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { DeckConfig } from './DeckConfig';

const mockNavigate = vi.fn();
let mockDeckId: string | undefined = 'test-deck-123';

vi.mock(import('react-router-dom'), async() => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => ({ deckId: mockDeckId }),
    } as unknown as typeof actual;
});

const renderDeckConfig = () => {
    return render(
        <MemoryRouter>
            <DeckConfig />
        </MemoryRouter>,
    );
};

describe('DeckConfig', () => {
    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
        mockDeckId = 'test-deck-123';
    });

    describe('rendering', () => {
        it('renders the header', () => {
            renderDeckConfig();

            expect(screen.getByText('Get Ready!')).toBeInTheDocument();
            expect(screen.getByText("Configure how you'd like to study this deck")).toBeInTheDocument();
        });

        it('renders show side buttons', () => {
            renderDeckConfig();

            expect(screen.getByText('Front side')).toBeInTheDocument();
            expect(screen.getByText('Back side')).toBeInTheDocument();
        });

        it('renders show details buttons', () => {
            renderDeckConfig();

            expect(screen.getByText('Always')).toBeInTheDocument();
            expect(screen.getByText('Never')).toBeInTheDocument();
            expect(screen.getByText('Before flip')).toBeInTheDocument();
        });

        it('renders randomize checkbox', () => {
            renderDeckConfig();

            expect(screen.getByLabelText('Shuffle card order')).toBeInTheDocument();
        });

        it('renders start studying button', () => {
            renderDeckConfig();

            expect(screen.getByText('Start Studying')).toBeInTheDocument();
        });
    });

    describe('default state', () => {
        it('has front side selected by default', () => {
            renderDeckConfig();

            const frontButton = screen.getByText('Front side');
            const backButton = screen.getByText('Back side');

            expect(frontButton).toHaveClass('btn-primary');
            expect(backButton).toHaveClass('btn-secondary');
        });

        it('has always selected for show details by default', () => {
            renderDeckConfig();

            const alwaysButton = screen.getByText('Always');
            const neverButton = screen.getByText('Never');
            const beforeFlipButton = screen.getByText('Before flip');

            expect(alwaysButton).toHaveClass('btn-primary');
            expect(neverButton).toHaveClass('btn-secondary');
            expect(beforeFlipButton).toHaveClass('btn-secondary');
        });

        it('has randomize checked by default', () => {
            renderDeckConfig();

            const checkbox = screen.getByLabelText('Shuffle card order');
            expect(checkbox).toBeChecked();
        });
    });

    describe('show side selection', () => {
        it('selects back side when clicked', async() => {
            const user = userEvent.setup();
            renderDeckConfig();

            const backButton = screen.getByText('Back side');
            await user.click(backButton);

            expect(backButton).toHaveClass('btn-primary');
            expect(screen.getByText('Front side')).toHaveClass('btn-secondary');
        });

        it('selects front side when clicked after selecting back', async() => {
            const user = userEvent.setup();
            renderDeckConfig();

            await user.click(screen.getByText('Back side'));
            await user.click(screen.getByText('Front side'));

            expect(screen.getByText('Front side')).toHaveClass('btn-primary');
            expect(screen.getByText('Back side')).toHaveClass('btn-secondary');
        });
    });

    describe('show details selection', () => {
        it('selects never when clicked', async() => {
            const user = userEvent.setup();
            renderDeckConfig();

            await user.click(screen.getByText('Never'));

            expect(screen.getByText('Never')).toHaveClass('btn-primary');
            expect(screen.getByText('Always')).toHaveClass('btn-secondary');
            expect(screen.getByText('Before flip')).toHaveClass('btn-secondary');
        });

        it('selects before flip when clicked', async() => {
            const user = userEvent.setup();
            renderDeckConfig();

            await user.click(screen.getByText('Before flip'));

            expect(screen.getByText('Before flip')).toHaveClass('btn-primary');
            expect(screen.getByText('Always')).toHaveClass('btn-secondary');
            expect(screen.getByText('Never')).toHaveClass('btn-secondary');
        });
    });

    describe('randomize toggle', () => {
        it('unchecks when clicked', async() => {
            const user = userEvent.setup();
            renderDeckConfig();

            const checkbox = screen.getByLabelText('Shuffle card order');
            await user.click(checkbox);

            expect(checkbox).not.toBeChecked();
        });

        it('checks again when clicked twice', async() => {
            const user = userEvent.setup();
            renderDeckConfig();

            const checkbox = screen.getByLabelText('Shuffle card order');
            await user.click(checkbox);
            await user.click(checkbox);

            expect(checkbox).toBeChecked();
        });
    });

    describe('navigation', () => {
        it('navigates with minimal query params when using defaults', async() => {
            const user = userEvent.setup();
            renderDeckConfig();

            await user.click(screen.getByText('Start Studying'));

            expect(mockNavigate).toHaveBeenCalledWith('/decks/test-deck-123?');
        });

        it('includes showSide param when back is selected', async() => {
            const user = userEvent.setup();
            renderDeckConfig();

            await user.click(screen.getByText('Back side'));
            await user.click(screen.getByText('Start Studying'));

            expect(mockNavigate).toHaveBeenCalledWith(
                expect.stringContaining('showSide=back'),
            );
        });

        it('includes randomize param when unchecked', async() => {
            const user = userEvent.setup();
            renderDeckConfig();

            await user.click(screen.getByLabelText('Shuffle card order'));
            await user.click(screen.getByText('Start Studying'));

            expect(mockNavigate).toHaveBeenCalledWith(
                expect.stringContaining('randomize=false'),
            );
        });

        it('includes showDetails param when never is selected', async() => {
            const user = userEvent.setup();
            renderDeckConfig();

            await user.click(screen.getByText('Never'));
            await user.click(screen.getByText('Start Studying'));

            expect(mockNavigate).toHaveBeenCalledWith(
                expect.stringContaining('showDetails=never'),
            );
        });

        it('includes showDetails param when beforeFlipping is selected', async() => {
            const user = userEvent.setup();
            renderDeckConfig();

            await user.click(screen.getByText('Before flip'));
            await user.click(screen.getByText('Start Studying'));

            expect(mockNavigate).toHaveBeenCalledWith(
                expect.stringContaining('showDetails=beforeFlipping'),
            );
        });

        it('includes multiple params when multiple options changed', async() => {
            const user = userEvent.setup();
            renderDeckConfig();

            await user.click(screen.getByText('Back side'));
            await user.click(screen.getByText('Never'));
            await user.click(screen.getByLabelText('Shuffle card order'));
            await user.click(screen.getByText('Start Studying'));

            const navigateCall = mockNavigate.mock.calls[0]?.[0] as string;
            expect(navigateCall).toContain('showSide=back');
            expect(navigateCall).toContain('showDetails=never');
            expect(navigateCall).toContain('randomize=false');
        });
    });

    describe('missing deckId', () => {
        it('navigates to home when deckId is missing', async() => {
            mockDeckId = undefined;
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            const user = userEvent.setup();
            renderDeckConfig();

            await user.click(screen.getByText('Start Studying'));

            expect(consoleSpy).toHaveBeenCalledWith('Deck ID is missing!');
            expect(mockNavigate).toHaveBeenCalledWith('/');
            consoleSpy.mockRestore();
        });
    });
});
