import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, act } from '@testing-library/react';
import { CardData } from '../api';
import { Card } from './Card';

const createMockCard = (overrides?: Partial<CardData>): CardData => ({
    front: { text: 'Front Text' },
    back: { text: 'Back Text' },
    ...overrides,
});

describe('Card', () => {
    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    describe('basic rendering', () => {
        it('renders front text', () => {
            const { container } = render(<Card card={createMockCard()} flipped={false} isTopCard={true} />);

            const frontContent = container.querySelector('.card-front .main-card-content');
            expect(frontContent).toHaveTextContent('Front Text');
        });

        it('renders back text', () => {
            render(<Card card={createMockCard()} flipped={false} isTopCard={true} />);

            expect(screen.getByText('Back Text')).toBeInTheDocument();
        });

        it('renders front text as hint on back side', () => {
            const { container } = render(<Card card={createMockCard()} flipped={false} isTopCard={true} />);

            const hint = container.querySelector('.card-back .hint');
            expect(hint).toHaveTextContent('Front Text');
        });

        it('renders deck name when provided', () => {
            render(<Card card={createMockCard()} flipped={false} isTopCard={true} deckName="Test Deck" />);

            // Deck name appears on both front and back
            expect(screen.getAllByText('Test Deck')).toHaveLength(2);
        });

        it('does not render deck name when not provided', () => {
            const { container } = render(<Card card={createMockCard()} flipped={false} isTopCard={true} />);

            expect(container.querySelector('.deck-name')).not.toBeInTheDocument();
        });

        it('renders icon when provided', () => {
            const { container } = render(
                <Card card={createMockCard()} flipped={false} isTopCard={true} icon={{ name: 'star', color: 'gold' }} />,
            );

            // Icon appears on both front and back
            const icons = container.querySelectorAll('.card-icon');
            expect(icons).toHaveLength(2);
        });

        it('normalizes icon name without fa- prefix', () => {
            const { container } = render(
                <Card card={createMockCard()} flipped={false} isTopCard={true} icon={{ name: 'star', color: 'gold' }} />,
            );

            const icon = container.querySelector('.card-icon');
            expect(icon).toHaveClass('fa-solid', 'fa-star');
        });

        it('keeps icon name with fa- prefix', () => {
            const { container } = render(
                <Card card={createMockCard()} flipped={false} isTopCard={true} icon={{ name: 'fa-heart', color: 'red' }} />,
            );

            const icon = container.querySelector('.card-icon');
            expect(icon).toHaveClass('fa-solid', 'fa-heart');
        });

        it('does not render icon when not provided', () => {
            const { container } = render(<Card card={createMockCard()} flipped={false} isTopCard={true} />);

            expect(container.querySelector('.card-icon')).not.toBeInTheDocument();
        });
    });

    describe('context content', () => {
        it('renders front context1 when provided', () => {
            const card = createMockCard({
                front: { text: 'Front', context1: 'Context 1 text' },
            });
            const { container } = render(<Card card={card} flipped={false} isTopCard={true} />);

            const context = container.querySelector('.card-front .context-1');
            expect(context).toHaveStyle({ display: 'block' });
            expect(context?.innerHTML).toContain('Context 1 text');
        });

        it('renders front context2 when provided', () => {
            const card = createMockCard({
                front: { text: 'Front', context2: 'Context 2 text' },
            });
            const { container } = render(<Card card={card} flipped={false} isTopCard={true} />);

            const context = container.querySelector('.card-front .context-2');
            expect(context).toHaveStyle({ display: 'block' });
            expect(context?.innerHTML).toContain('Context 2 text');
        });

        it('hides front context1 when not provided', () => {
            const { container } = render(<Card card={createMockCard()} flipped={false} isTopCard={true} />);

            const context = container.querySelector('.card-front .context-1');
            expect(context).toHaveStyle({ display: 'none' });
        });

        it('renders back context1 when provided', () => {
            const card = createMockCard({
                back: { text: 'Back', context1: 'Back context 1' },
            });
            const { container } = render(<Card card={card} flipped={false} isTopCard={true} />);

            const context = container.querySelector('.card-back .context-1');
            expect(context).toHaveStyle({ display: 'block' });
            expect(context?.innerHTML).toContain('Back context 1');
        });

        it('renders back context2 when provided', () => {
            const card = createMockCard({
                back: { text: 'Back', context2: 'Back context 2' },
            });
            const { container } = render(<Card card={card} flipped={false} isTopCard={true} />);

            const context = container.querySelector('.card-back .context-2');
            expect(context).toHaveStyle({ display: 'block' });
            expect(context?.innerHTML).toContain('Back context 2');
        });

        it('renders markdown in context fields', () => {
            const card = createMockCard({
                front: { text: 'Front', context1: '**bold text**' },
            });
            const { container } = render(<Card card={card} flipped={false} isTopCard={true} />);

            const context = container.querySelector('.card-front .context-1');
            expect(context?.innerHTML).toContain('<strong>bold text</strong>');
        });
    });

    describe('CSS classes', () => {
        it('has card class by default', () => {
            const { container } = render(<Card card={createMockCard()} flipped={false} isTopCard={false} />);

            expect(container.querySelector('.card')).toBeInTheDocument();
        });

        it('has topCard class when isTopCard is true', () => {
            const { container } = render(<Card card={createMockCard()} flipped={false} isTopCard={true} />);

            expect(container.querySelector('.card.topCard')).toBeInTheDocument();
        });

        it('does not have topCard class when isTopCard is false', () => {
            const { container } = render(<Card card={createMockCard()} flipped={false} isTopCard={false} />);

            expect(container.querySelector('.card.topCard')).not.toBeInTheDocument();
        });

        it('has flipped class when flipped is true', () => {
            const { container } = render(<Card card={createMockCard()} flipped={true} isTopCard={true} />);

            expect(container.querySelector('.card.flipped')).toBeInTheDocument();
        });

        it('does not have flipped class when flipped is false', () => {
            const { container } = render(<Card card={createMockCard()} flipped={false} isTopCard={true} />);

            expect(container.querySelector('.card.flipped')).not.toBeInTheDocument();
        });

        it('has sliding-right class when animation is right', () => {
            const { container } = render(<Card card={createMockCard()} flipped={false} isTopCard={true} animation="right" />);

            expect(container.querySelector('.card.sliding-right')).toBeInTheDocument();
        });

        it('has sliding-left class when animation is left', () => {
            const { container } = render(<Card card={createMockCard()} flipped={false} isTopCard={true} animation="left" />);

            expect(container.querySelector('.card.sliding-left')).toBeInTheDocument();
        });

        it('does not have animation class when animation is undefined', () => {
            const { container } = render(<Card card={createMockCard()} flipped={false} isTopCard={true} />);

            expect(container.querySelector('.card.sliding-right')).not.toBeInTheDocument();
            expect(container.querySelector('.card.sliding-left')).not.toBeInTheDocument();
        });
    });

    describe('draggable behavior', () => {
        it('is draggable when isTopCard is true', () => {
            const { container } = render(<Card card={createMockCard()} flipped={false} isTopCard={true} />);

            const card = container.querySelector('.card');
            expect(card).toHaveAttribute('draggable', 'true');
        });

        it('is not draggable when isTopCard is false', () => {
            const { container } = render(<Card card={createMockCard()} flipped={false} isTopCard={false} />);

            const card = container.querySelector('.card');
            expect(card).toHaveAttribute('draggable', 'false');
        });
    });

    describe('click handling', () => {
        it('calls toggleVisibleSide when clicked', () => {
            const toggleVisibleSide = vi.fn();
            const { container } = render(
                <Card card={createMockCard()} flipped={false} isTopCard={true} toggleVisibleSide={toggleVisibleSide} />,
            );

            const card = container.querySelector('.card');
            if (!card) throw new Error('Card not found');
            fireEvent.click(card);

            expect(toggleVisibleSide).toHaveBeenCalledTimes(1);
        });

        it('does not throw when toggleVisibleSide is not provided', () => {
            const { container } = render(<Card card={createMockCard()} flipped={false} isTopCard={true} />);

            const card = container.querySelector('.card');
            if (!card) throw new Error('Card not found');

            expect(() => fireEvent.click(card)).not.toThrowError();
        });
    });

    describe('drag handling', () => {
        it('hides card when drag starts on top card', () => {
            const { container } = render(<Card card={createMockCard()} flipped={false} isTopCard={true} />);

            const card = container.querySelector('.card');
            if (!card) throw new Error('Card not found');

            fireEvent.dragStart(card, { screenX: 100 });

            expect(card).toHaveStyle({ visibility: 'hidden' });
        });

        it('does not hide card when drag starts on non-top card', () => {
            const { container } = render(<Card card={createMockCard()} flipped={false} isTopCard={false} />);

            const card = container.querySelector('.card');
            if (!card) throw new Error('Card not found');

            fireEvent.dragStart(card, { screenX: 100 });

            expect(card).toHaveStyle({ visibility: 'visible' });
        });

        it('calls userKnewCard(true) when dragged right more than 100px', () => {
            const userKnewCard = vi.fn();
            const { container } = render(
                <Card card={createMockCard()} flipped={false} isTopCard={true} userKnewCard={userKnewCard} />,
            );

            const card = container.querySelector('.card');
            if (!card) throw new Error('Card not found');

            // Create drag events with screenX - jsdom doesn't have DragEvent so we use Event
            act(() => {
                const dragStartEvent = new Event('dragstart', { bubbles: true });
                Object.defineProperty(dragStartEvent, 'screenX', { value: 100, writable: false });
                card.dispatchEvent(dragStartEvent);
            });

            act(() => {
                const dragEndEvent = new Event('dragend', { bubbles: true });
                Object.defineProperty(dragEndEvent, 'screenX', { value: 250, writable: false }); // delta = 150 > 100
                card.dispatchEvent(dragEndEvent);
            });

            expect(userKnewCard).toHaveBeenCalledWith(true);
        });

        it('calls userKnewCard(false) when dragged left more than 100px', () => {
            const userKnewCard = vi.fn();
            const { container } = render(
                <Card card={createMockCard()} flipped={false} isTopCard={true} userKnewCard={userKnewCard} />,
            );

            const card = container.querySelector('.card');
            if (!card) throw new Error('Card not found');

            // Create drag events with screenX - jsdom doesn't have DragEvent so we use Event
            act(() => {
                const dragStartEvent = new Event('dragstart', { bubbles: true });
                Object.defineProperty(dragStartEvent, 'screenX', { value: 200, writable: false });
                card.dispatchEvent(dragStartEvent);
            });

            act(() => {
                const dragEndEvent = new Event('dragend', { bubbles: true });
                Object.defineProperty(dragEndEvent, 'screenX', { value: 50, writable: false }); // delta = -150 < -100
                card.dispatchEvent(dragEndEvent);
            });

            expect(userKnewCard).toHaveBeenCalledWith(false);
        });

        it('does not call userKnewCard when drag is small', () => {
            const userKnewCard = vi.fn();
            const { container } = render(
                <Card card={createMockCard()} flipped={false} isTopCard={true} userKnewCard={userKnewCard} />,
            );

            const card = container.querySelector('.card');
            if (!card) throw new Error('Card not found');

            fireEvent.dragStart(card, { screenX: 100 });
            fireEvent.dragEnd(card, { screenX: 150 }); // delta = 50, not enough

            expect(userKnewCard).not.toHaveBeenCalled();
        });

        it('does not call userKnewCard when drag ends on non-top card', () => {
            const userKnewCard = vi.fn();
            const { container } = render(
                <Card card={createMockCard()} flipped={false} isTopCard={false} userKnewCard={userKnewCard} />,
            );

            const card = container.querySelector('.card');
            if (!card) throw new Error('Card not found');

            fireEvent.dragStart(card, { screenX: 100 });
            fireEvent.dragEnd(card, { screenX: 250 });

            expect(userKnewCard).not.toHaveBeenCalled();
        });

        it('restores visibility after drag ends', () => {
            const { container } = render(<Card card={createMockCard()} flipped={false} isTopCard={true} />);

            const card = container.querySelector('.card');
            if (!card) throw new Error('Card not found');

            fireEvent.dragStart(card, { screenX: 100 });
            expect(card).toHaveStyle({ visibility: 'hidden' });

            fireEvent.dragEnd(card, { screenX: 150 });
            expect(card).toHaveStyle({ visibility: 'visible' });
        });
    });

    describe('animation end handling', () => {
        it('calls onAnimationEnd when animation ends', () => {
            const onAnimationEnd = vi.fn();
            const { container } = render(
                <Card card={createMockCard()} flipped={false} isTopCard={true} animation="right" onAnimationEnd={onAnimationEnd} />,
            );

            const card = container.querySelector('.card');
            if (!card) throw new Error('Card not found');

            fireEvent.animationEnd(card);

            expect(onAnimationEnd).toHaveBeenCalledTimes(1);
        });

        it('does not throw when onAnimationEnd is not provided', () => {
            const { container } = render(<Card card={createMockCard()} flipped={false} isTopCard={true} animation="right" />);

            const card = container.querySelector('.card');
            if (!card) throw new Error('Card not found');

            expect(() => fireEvent.animationEnd(card)).not.toThrowError();
        });
    });

    describe('visibility state', () => {
        it('starts with visible visibility', () => {
            const { container } = render(<Card card={createMockCard()} flipped={false} isTopCard={true} />);

            const card = container.querySelector('.card');
            expect(card).toHaveStyle({ visibility: 'visible' });
        });
    });
});
