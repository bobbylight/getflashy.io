import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import { render, screen, cleanup, waitFor, renderHook } from '@testing-library/react';
import { Decks } from '../api';
import { DecksProvider, useDecks } from './DecksContext';

const mockDecks: Decks = {
    deck1: {
        id: 'deck1',
        name: 'Spanish Vocabulary',
        size: 50,
        modified: '2026-01-01T00:00:00Z',
    },
    deck2: {
        id: 'deck2',
        name: 'French Vocabulary',
        size: 30,
        modified: '2026-01-01T00:00:00Z',
    },
};

describe('DecksContext', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockDecks),
        } as Response);
    });

    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
        vi.restoreAllMocks();
    });

    describe('DecksProvider', () => {
        it('fetches decks from API on mount', async() => {
            render(
                <DecksProvider>
                    <div>Child</div>
                </DecksProvider>,
            );

            await waitFor(() => {
                expect(globalThis.fetch).toHaveBeenCalledWith('/decks/metadata.json');
            });
        });

        it('provides decks after successful fetch', async() => {
            const TestComponent = () => {
                const { decks } = useDecks();
                return <div data-testid="decks">{Object.keys(decks).join(',')}</div>;
            };

            render(
                <DecksProvider>
                    <TestComponent />
                </DecksProvider>,
            );

            await waitFor(() => {
                expect(screen.getByTestId('decks')).toHaveTextContent('deck1,deck2');
            });
        });

        it('shows loading state initially', () => {
            const TestComponent = () => {
                const { isLoading } = useDecks();
                return <div data-testid="loading">{isLoading ? 'loading' : 'loaded'}</div>;
            };

            render(
                <DecksProvider>
                    <TestComponent />
                </DecksProvider>,
            );

            expect(screen.getByTestId('loading')).toHaveTextContent('loading');
        });

        it('sets loading to false after fetch completes', async() => {
            const TestComponent = () => {
                const { isLoading } = useDecks();
                return <div data-testid="loading">{isLoading ? 'loading' : 'loaded'}</div>;
            };

            render(
                <DecksProvider>
                    <TestComponent />
                </DecksProvider>,
            );

            await waitFor(() => {
                expect(screen.getByTestId('loading')).toHaveTextContent('loaded');
            });
        });

        it('sets error when fetch fails with Error', async() => {
            vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'));

            const TestComponent = () => {
                const { error } = useDecks();
                return <div data-testid="error">{error ?? 'no error'}</div>;
            };

            render(
                <DecksProvider>
                    <TestComponent />
                </DecksProvider>,
            );

            await waitFor(() => {
                expect(screen.getByTestId('error')).toHaveTextContent('Network error');
            });
        });

        it('sets error when fetch fails with non-Error value', async() => {
            vi.spyOn(globalThis, 'fetch').mockRejectedValue('string error');

            const TestComponent = () => {
                const { error } = useDecks();
                return <div data-testid="error">{error ?? 'no error'}</div>;
            };

            render(
                <DecksProvider>
                    <TestComponent />
                </DecksProvider>,
            );

            await waitFor(() => {
                expect(screen.getByTestId('error')).toHaveTextContent('Unknown error occurred loading decks');
            });
        });

        it('sets error when response is not ok', async() => {
            vi.spyOn(globalThis, 'fetch').mockResolvedValue({
                ok: false,
            } as Response);

            const TestComponent = () => {
                const { error } = useDecks();
                return <div data-testid="error">{error ?? 'no error'}</div>;
            };

            render(
                <DecksProvider>
                    <TestComponent />
                </DecksProvider>,
            );

            await waitFor(() => {
                expect(screen.getByTestId('error')).toHaveTextContent('Failed to fetch decks');
            });
        });

        it('sets loading to false even when fetch fails', async() => {
            vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'));

            const TestComponent = () => {
                const { isLoading } = useDecks();
                return <div data-testid="loading">{isLoading ? 'loading' : 'loaded'}</div>;
            };

            render(
                <DecksProvider>
                    <TestComponent />
                </DecksProvider>,
            );

            await waitFor(() => {
                expect(screen.getByTestId('loading')).toHaveTextContent('loaded');
            });
        });

        it('renders children', () => {
            render(
                <DecksProvider>
                    <div data-testid="child">Child Content</div>
                </DecksProvider>,
            );

            expect(screen.getByTestId('child')).toHaveTextContent('Child Content');
        });
    });

    describe('useDecks', () => {
        it('throws error when used outside of DecksProvider', () => {
            // Suppress console.error for this test since we expect an error
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            expect(() => {
                renderHook(() => useDecks());
            }).toThrowError('useDecks must be used within a DecksProvider');

            consoleSpy.mockRestore();
        });

        it('returns context value when used inside DecksProvider', async() => {
            const { result } = renderHook(() => useDecks(), {
                wrapper: ({ children }) => <DecksProvider>{children}</DecksProvider>,
            });

            // Initially loading
            expect(result.current.isLoading).toBe(true);
            expect(result.current.error).toBe(null);

            // Wait for fetch to complete
            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.decks).toEqual(mockDecks);
        });
    });
});
