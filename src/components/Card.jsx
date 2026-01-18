import React from 'react';
import marked from 'marked';
import $ from 'jquery';

/**
 * A rendered card (either the current card, or the one beneath it).
 */
class Card extends React.Component {

    constructor(props) {
        super(props);
        this.state = { cardFlipped: false, visibility: 'visible', dragStartX: -1 };
    }

    componentWillMount() {
    }

    setUserKnew(knew) {

        const animClassName = knew ? 'sliding-right' : 'sliding-left';

        let $card = $('.card.topCard');
        $card.addClass(animClassName);
        this.setState({ animating: true });
        $card.one('animationend', (e) => {
            console.log('Animation ended');
            $card.removeClass(animClassName);
            this.setState({ animating: false });
            this.props.advance(knew);
        });
    }

    componentDidMount() {

        // Poor man's way of knowing we're not the "top" card
        // TODO: Detect this scenario better
        if (this.props.advance) {
            $(document).on('keyup.deck', (e) => {
                if (this.state.animating) {
                    console.log('animating, not honoring key press');
                    return;
                }
                console.log('not animating, honoring key press');
                switch (e.key) {
                    case 'ArrowRight':
                        this.setUserKnew(true);
                        e.stopPropagation();
                        e.preventDefault();
                        break;
                    case 'ArrowLeft':
                        this.setUserKnew(false);
                        e.stopPropagation();
                        e.preventDefault();
                        break;
                    case 'ArrowDown':
                        if (!this.state.cardFlipped) {
                            this.setState({cardFlipped: true});
                        }
                        e.stopPropagation();
                        e.preventDefault();
                        break;
                    case 'ArrowUp':
                        if (this.state.cardFlipped) {
                            this.setState({cardFlipped: false});
                        }
                        e.stopPropagation();
                        e.preventDefault();
                        break;
                }
            });

        }
    }

    componentWillUnmount() {
        console.log(':(:(:(:(:(');
        $(document).off('keyup.deck');
    }

    onClick(e) {
        this.props.toggleVisibleSide(e);
    }

    onDrag(e) {
        console.log('Dragging! - ' + e.screenX);
        this.setState({ visibility: 'hidden', dragStartX: e.screenX });
    }

    onDrop(e) {

        const delta = e.screenX - this.state.dragStartX;
        console.log(e.screenX, this.state.dragStartX, delta);
        if (delta > 100) {
            // Swipe to the right => knew the word
            this.props.advance(true);
        }
        else if (delta < -100) {
            // Swipe to the left => didn't know the card
            this.props.advance(false);
        }

        console.log('Dropped');
        this.setState({ visibility: 'visible', dragStartX: -1 });
    }

    render() {

        const card = this.props.card;
        console.log('flipped? - ' + this.state.cardFlipped);
        const side = this.state.cardFlipped ? card.back : card.front;

        const cardStyle = {
            visibility: this.state.visibility
        };

        let context1 = side.context1;
        context1 = context1 ? marked(context1) : context1;
        const context1Style = {
            display: context1 ? 'block' : 'none'
        };

        let context2 = side.context2;
        context2 = context2 ? marked(context2) : context2;
        const context2Style = {
            display: context2 ? 'block' : 'none'
        };

        const frontHintStyle = {
            display: this.state.cardFlipped ? 'block' : 'none'
        };

        let className = 'card';
        if (this.props.advance) {
            // TODO: Find a better way to determine the "topmost" card
            className += ' topCard';
        }

        return (
            <div className="card-wrapper">
                <div className={className} style={cardStyle} draggable="true"
                     onClick={this.onClick.bind(this)} onDrag={this.onDrag.bind(this)} onDragEnd={this.onDrop.bind(this)}>

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
                        {this.props.card.front.text}
                    </div>
                </div>
            </div>
        );
    }
}

export default Card;
