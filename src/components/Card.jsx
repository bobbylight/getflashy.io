import React, { useState, useEffect, useRef, useImperativeHandle } from 'react'; // Added hooks
import marked from 'marked';

/**
 * A rendered card (either the current card, or the one beneath it).
 */
// Card needs to be wrapped with forwardRef to receive the ref from Deck.jsx
const Card = React.forwardRef(({ card, flipped, advance, toggleVisibleSide }, ref) => {
    // Local state, replacing this.state
    const [cardFlippedState, setCardFlippedState] = useState(false); // Using a different name to avoid confusion with prop 'flipped'
    const [visibility, setVisibility] = useState('visible');
    const [dragStartX, setDragStartX] = useState(-1);
    const [animating, setAnimating] = useState(false);
    const cardRef = useRef(null); // Internal ref to the div.card element

    // Use passed 'flipped' prop, but also allow local state to manage 'cardFlippedState'
    const isFlipped = cardFlippedState || flipped; // Combine local and prop flipped state

    // Expose setUserKnew method to parent (Deck.jsx)
    useImperativeHandle(ref, () => ({
        setUserKnew: (knew) => {
            const animClassName = knew ? 'sliding-right' : 'sliding-left';
            const currentCardElement = cardRef.current; // Get the actual DOM element

            if (currentCardElement) {
                currentCardElement.classList.add(animClassName);
                setAnimating(true);

                // Native event listener for animationend with { once: true }
                const handleAnimationEnd = () => {
                    console.log('Animation ended');
                    currentCardElement.classList.remove(animClassName);
                    setAnimating(false);
                    if (advance) {
                        advance(knew);
                    }
                };
                currentCardElement.addEventListener('animationend', handleAnimationEnd, { once: true });
            } else {
                // Fallback if cardRef.current is null (e.g., component unmounted)
                console.warn("Card element not available for animation. Proceeding without animation.");
                if (advance) {
                    advance(knew);
                }
            }
        },
    }));

    // Reintroduce keydown handler for flipping the card (ArrowUp/ArrowDown)
    useEffect(() => {
        if (!advance) { // Only attach keydown listener if this is the top card (indicated by advance prop)
            return;
        }

        const handleKeyDown = (e) => {
            if (animating) {
                console.log('animating, not honoring key press');
                return;
            }
            // console.log('not animating, honoring key press'); // Temporarily disabled console.log due to verbosity
            switch (e.key) {
                case 'ArrowDown':
                    if (!isFlipped) {
                        setCardFlippedState(true);
                    }
                    e.stopPropagation();
                    e.preventDefault();
                    break;
                case 'ArrowUp':
                    if (isFlipped) {
                        setCardFlippedState(false);
                    }
                    e.stopPropagation();
                    e.preventDefault();
                    break;
                default:
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [animating, isFlipped, advance]); // Dependencies for useEffect


    // onClick now directly calls prop
    const handleClick = (e) => {
        if (toggleVisibleSide) {
            toggleVisibleSide(e);
        }
    };

    // onDrag logic
    const handleDrag = (e) => {
        setVisibility('hidden');
        setDragStartX(e.screenX);
    };

    // onDrop logic
    const handleDragEnd = (e) => {
        const delta = e.screenX - dragStartX;

        if (delta > 100) {
            // Swipe to the right => knew the word
            if (advance) {
                advance(true);
            }
        } else if (delta < -100) {
            // Swipe to the left => didn't know the card
            if (advance) {
                advance(false);
            }
        }

        setVisibility('visible');
        setDragStartX(-1);
    };


    const side = isFlipped ? card.back : card.front;

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
        display: isFlipped ? 'block' : 'none'
    };

    let className = 'card';
    if (advance) { // advance prop indicates this is the top card
        className += ' topCard';
    }

    return (
        <div className="card-wrapper">
            <div ref={cardRef} className={className} style={cardStyle} draggable="true"
                 onClick={handleClick} onDrag={handleDrag} onDragEnd={handleDragEnd}>

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
});

export default Card;
