import { useState, MouseEvent, DragEvent, CSSProperties } from 'react';
import { marked } from 'marked';
import { CardData } from '../api';

interface CardProps {
  card: CardData;
  flipped: boolean;
  isTopCard: boolean;
  animation?: 'right' | 'left';
  onAnimationEnd?: () => void;
  userKnewCard?: (knew: boolean) => void;
  toggleVisibleSide?: (event: MouseEvent<HTMLDivElement>) => void;
  icon?: { name: string; color: string };
  deckName?: string;
}

/**
 * A rendered card (either the current card, or the one beneath it).
 * This is a purely presentational component, controlled by its parent (Deck).
 */
export const Card = ({ card, flipped, isTopCard, animation, onAnimationEnd, userKnewCard, toggleVisibleSide, icon, deckName }: CardProps) => {
    const [ visibility, setVisibility ] = useState<CSSProperties['visibility']>('visible');
    const [ dragStartX, setDragStartX ] = useState<number>(-1);

    // Normalize icon name to Font Awesome 7 format (fa-solid fa-{name})
    const iconClass = icon ? `fa-solid ${icon.name.startsWith('fa-') ? icon.name : `fa-${icon.name}`}` : undefined;

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
        if (toggleVisibleSide) {
            toggleVisibleSide(e);
        }
    };

    const handleDrag = (e: DragEvent<HTMLDivElement>) => {
        if (!isTopCard) return;
        // Only capture the starting position on the first onDrag event.
        // onDragStart was too problematic, so this is an alternative approach.
        if (dragStartX === -1) {
            setVisibility('hidden');
            setDragStartX(e.screenX);
        }
    };

    const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
        if (!isTopCard) return;
        const delta = e.screenX - dragStartX;

        if (delta > 100) {
            // Swipe to the right => knew the word
            userKnewCard?.(true);
        }
        else if (delta < -100) {
            // Swipe to the left => didn't know the card
            userKnewCard?.(false);
        }

        setVisibility('visible');
        setDragStartX(-1);
    };

    const handleAnimationEnd = () => {
        onAnimationEnd?.();
    };

    const cardStyle: CSSProperties = {
        visibility: visibility,
    };

    // Front side content
    const frontContext1 = card.front.context1 ? marked(card.front.context1) : undefined;
    const frontContext2 = card.front.context2 ? marked(card.front.context2) : undefined;

    // Back side content
    const backContext1 = card.back.context1 ? marked(card.back.context1) : undefined;
    const backContext2 = card.back.context2 ? marked(card.back.context2) : undefined;

    let className = 'card';
    if (isTopCard) {
        className += ' topCard';
    }
    if (flipped) {
        className += ' flipped';
    }

    let wrapperClassName = 'card-wrapper';
    if (animation) {
        wrapperClassName += animation === 'right' ? ' sliding-right' : ' sliding-left';
    }

    return (
        <div className={wrapperClassName} onAnimationEnd={handleAnimationEnd}>
            <div className={className}
                style={cardStyle}
                draggable={isTopCard}
                onClick={handleClick}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
            >
                {/* Front face */}
                <div className="card-face card-front">
                    <div className="card-top">
                        {iconClass && <i className={`${iconClass} card-icon`} aria-hidden="true"></i>}
                        {deckName && <span className="deck-name">{deckName}</span>}
                    </div>
                    <div className="card-content">
                        <div className="card-content-wrapper">
                            <div className="main-card-content">
                                {card.front.text}
                            </div>
                            {/* eslint-disable-next-line @typescript-eslint/naming-convention */}
                            <div className="context-1" style={{ display: frontContext1 ? 'block' : 'none' }} dangerouslySetInnerHTML={{ __html: frontContext1 ?? '' }}>
                            </div>
                            {/* eslint-disable-next-line @typescript-eslint/naming-convention */}
                            <div className="context-2" style={{ display: frontContext2 ? 'block' : 'none' }} dangerouslySetInnerHTML={{ __html: frontContext2 ?? '' }}>
                            </div>
                        </div>
                    </div>
                    <div className="hint"></div>
                </div>

                {/* Back face */}
                <div className="card-face card-back">
                    <div className="card-top">
                        {iconClass && <i className={`${iconClass} card-icon`} aria-hidden="true"></i>}
                        {deckName && <span className="deck-name">{deckName}</span>}
                    </div>
                    <div className="card-content">
                        <div className="card-content-wrapper">
                            <div className="main-card-content">
                                {card.back.text}
                            </div>
                            {/* eslint-disable-next-line @typescript-eslint/naming-convention */}
                            <div className="context-1" style={{ display: backContext1 ? 'block' : 'none' }} dangerouslySetInnerHTML={{ __html: backContext1 ?? '' }}>
                            </div>
                            {/* eslint-disable-next-line @typescript-eslint/naming-convention */}
                            <div className="context-2" style={{ display: backContext2 ? 'block' : 'none' }} dangerouslySetInnerHTML={{ __html: backContext2 ?? '' }}>
                            </div>
                        </div>
                    </div>
                    <div className="hint">
                        {card.front.text}
                    </div>
                </div>
            </div>
        </div>
    );
};
