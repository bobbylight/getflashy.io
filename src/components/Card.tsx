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
}

/**
 * A rendered card (either the current card, or the one beneath it).
 * This is a purely presentational component, controlled by its parent (Deck).
 */
const Card = ({ card, flipped, isTopCard, animation, onAnimationEnd, userKnewCard, toggleVisibleSide }: CardProps) => {
    const [visibility, setVisibility] = useState<CSSProperties['visibility']>('visible');
    const [dragStartX, setDragStartX] = useState<number>(-1);

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
        if (toggleVisibleSide) {
            toggleVisibleSide(e);
        }
    };

    const handleDrag = (e: DragEvent<HTMLDivElement>) => {
        if (!isTopCard) return;
        setVisibility('hidden');
        setDragStartX(e.screenX);
    };

    const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
        if (!isTopCard) return;
        const delta = e.screenX - dragStartX;

        if (delta > 100) {
            // Swipe to the right => knew the word
            userKnewCard?.(true);
        } else if (delta < -100) {
            // Swipe to the left => didn't know the card
            userKnewCard?.(false);
        }

        setVisibility('visible');
        setDragStartX(-1);
    };

    const handleAnimationEnd = () => {
        onAnimationEnd?.();
    }

    const side = flipped ? card.back : card.front;

    const cardStyle: CSSProperties = {
        visibility: visibility
    };

    const markedContext1 = side.context1 ? marked(side.context1) : undefined;
    const context1Style: CSSProperties = {
        display: markedContext1 ? 'block' : 'none'
    };

    const markedContext2 = side.context2 ? marked(side.context2) : undefined;
    const context2Style: CSSProperties = {
        display: markedContext2 ? 'block' : 'none'
    };

    const frontHintStyle: CSSProperties = {
        display: flipped ? 'block' : 'none'
    };

    let className = 'card';
    if (isTopCard) {
        className += ' topCard';
    }
    if (animation) {
        className += animation === 'right' ? ' sliding-right' : ' sliding-left';
    }

    return (
        <div className="card-wrapper">
            <div className={className}
                 style={cardStyle}
                 draggable={isTopCard}
                 onClick={handleClick}
                 onDragStart={handleDrag} // Changed from onDrag to onDragStart for correct behavior
                 onDragEnd={handleDragEnd}
                 onAnimationEnd={handleAnimationEnd}
            >

                <div className="card-top"></div>

                <div className="card-content">
                    <div className="card-content-wrapper">
                        <div className="main-card-content">
                            {side.text}
                        </div>
                        <div className="context-1" style={context1Style} dangerouslySetInnerHTML={{__html: markedContext1 || ''}}>
                        </div>
                        <div className="context-2" style={context2Style} dangerouslySetInnerHTML={{__html: markedContext2 || ''}}>
                        </div>
                    </div>
                </div>

                <div className="frontHint" style={frontHintStyle}>
                    {card.front.text}
                </div>
            </div>
        </div>
    );
};

export default Card;
