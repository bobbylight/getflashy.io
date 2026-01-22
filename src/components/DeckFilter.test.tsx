import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeckFilter } from './DeckFilter';

describe('DeckFilter', () => {
    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    describe('rendering', () => {
        it('renders the label', () => {
            render(<DeckFilter label="Filter Decks" onChange={vi.fn()} />);

            expect(screen.getByText('Filter Decks')).toBeInTheDocument();
        });

        it('renders the input field', () => {
            render(<DeckFilter label="Filter Decks" onChange={vi.fn()} />);

            expect(screen.getByPlaceholderText('Example: State Capitals')).toBeInTheDocument();
        });

        it('renders help text when provided', () => {
            render(
                <DeckFilter
                    label="Filter Decks"
                    helpText="Enter a search term"
                    onChange={vi.fn()}
                />,
            );

            expect(screen.getByText('Enter a search term')).toBeInTheDocument();
        });

        it('renders empty help text when not provided', () => {
            const { container } = render(<DeckFilter label="Filter Decks" onChange={vi.fn()} />);

            const helpText = container.querySelector('.text-muted');
            expect(helpText).toBeInTheDocument();
            expect(helpText).toHaveTextContent('');
        });

        it('starts with empty input value', () => {
            render(<DeckFilter label="Filter Decks" onChange={vi.fn()} />);

            const input = screen.getByPlaceholderText('Example: State Capitals');
            expect(input).toHaveValue('');
        });
    });

    describe('user interaction', () => {
        it('calls onChange when user types', async() => {
            const user = userEvent.setup();
            const handleChange = vi.fn();
            render(<DeckFilter label="Filter Decks" onChange={handleChange} />);

            const input = screen.getByPlaceholderText('Example: State Capitals');
            await user.type(input, 'test');

            expect(handleChange).toHaveBeenCalledTimes(4);
            expect(handleChange).toHaveBeenLastCalledWith('test');
        });

        it('updates input value as user types', async() => {
            const user = userEvent.setup();
            render(<DeckFilter label="Filter Decks" onChange={vi.fn()} />);

            const input = screen.getByPlaceholderText('Example: State Capitals');
            await user.type(input, 'Spanish');

            expect(input).toHaveValue('Spanish');
        });

        it('calls onChange with each character typed', async() => {
            const user = userEvent.setup();
            const handleChange = vi.fn();
            render(<DeckFilter label="Filter Decks" onChange={handleChange} />);

            const input = screen.getByPlaceholderText('Example: State Capitals');
            await user.type(input, 'abc');

            expect(handleChange).toHaveBeenNthCalledWith(1, 'a');
            expect(handleChange).toHaveBeenNthCalledWith(2, 'ab');
            expect(handleChange).toHaveBeenNthCalledWith(3, 'abc');
        });

        it('handles clearing the input', async() => {
            const user = userEvent.setup();
            const handleChange = vi.fn();
            render(<DeckFilter label="Filter Decks" onChange={handleChange} />);

            const input = screen.getByPlaceholderText('Example: State Capitals');
            await user.type(input, 'test');
            await user.clear(input);

            expect(input).toHaveValue('');
            expect(handleChange).toHaveBeenLastCalledWith('');
        });
    });
});
