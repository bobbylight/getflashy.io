import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { DeckStatus } from './DeckStatus';

describe('DeckStatus', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders current card and total card count', () => {
        render(<DeckStatus curCard={5} cardCount={20} correctCount={3} />);
        expect(screen.getByText(/5 \/ 20/)).toBeInTheDocument();
    });

    it('renders correct count', () => {
        render(<DeckStatus curCard={5} cardCount={20} correctCount={3} />);
        expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('displays zero values correctly', () => {
        render(<DeckStatus curCard={0} cardCount={0} correctCount={0} />);
        expect(screen.getByText(/0 \/ 0/)).toBeInTheDocument();
        expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('displays large values correctly', () => {
        render(<DeckStatus curCard={999} cardCount={1000} correctCount={500} />);
        expect(screen.getByText(/999 \/ 1000/)).toBeInTheDocument();
        expect(screen.getByText('500')).toBeInTheDocument();
    });

    it('updates when props change', () => {
        const { rerender } = render(<DeckStatus curCard={1} cardCount={10} correctCount={0} />);
        expect(screen.getByText(/1 \/ 10/)).toBeInTheDocument();

        rerender(<DeckStatus curCard={5} cardCount={10} correctCount={4} />);
        expect(screen.getByText(/5 \/ 10/)).toBeInTheDocument();
        expect(screen.getByText('4')).toBeInTheDocument();
    });
});
