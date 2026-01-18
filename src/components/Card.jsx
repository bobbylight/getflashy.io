import React, { useState } from 'react';
import { marked } from 'marked';

/**
 * A rendered card (either the current card, or the one beneath it).
 * This is a purely presentational component, controlled by its parent (Deck).
 */
const Card = ({ card, flipped, isTopCard, animation, onAnimationEnd, userKnewCard, toggleVisibleSide }) => {
    const [visibility, setVisibility] = useState('visible');
    const [dragStartX, setDragStartX] = useState(-1);

    const handleClick = (e) => {
        if (toggleVisibleSide) {
            toggleVisibleSide(e);
        }
    };

    const handleDrag = (e) => {
        if (!isTopCard) return;
        setVisibility('hidden');
        setDragStartX(e.screenX);
    };

    const handleDragEnd = (e) => {
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

    const cardStyle = {
        visibility: visibility
    };

    let context1 = side.context1;
    context1 = context1 ? marked(context1) : context1; // marked requires a string, handles null/undefined
    const context1Style = {
        display: context1 ? 'block' : 'none'
    };

    let context2 = side.context2;
    context2 = context2 ? marked(context2) : context2; // marked requires a string, handles null/undefined
    const context2Style = {
        display: context2 ? 'block' : 'none'
    };

    const frontHintStyle = {
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
                 onDrag={handleDrag}
                 onDragEnd={handleDragEnd}
                 onAnimationEnd={handleAnimationEnd}
            >

                <div className="card-top"></div>

                <div className="card-content">
                    <div className="card-content-wrapper">
                        <div className="main-card-content">
                            {side.text}
                        </div>
                        <div className="context-1" style={context1Style} dangerouslySetInnerHTML={{__html: context1}}>
                        </div>
                        <div className="context-2" style={context2Style} dangerouslySetInnerHTML={{__html: context2}}>
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
