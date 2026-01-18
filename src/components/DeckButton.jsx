import React from 'react';

export class DeckButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        const deck = this.props.deck;
        const date = new Date(deck.modified).toDateString();
        const icon = deck && deck.icon ? deck.icon.name : 'smile-o';
        const style = {
            color: deck && deck.icon && deck.icon.color ? deck.icon.color : 'black'
        };

        return (
            <div className="deck-button" onClick={ () => this.props.onClick(deck) }>
                <div className="deck-details">
                    <div>
                        <div className="deck-icon"><i className={'fa fa-' + icon} style={style} aria-hidden="true"></i></div>
                        <div className="deck-title">{deck.name}</div>
                        <div>{deck.size} cards</div>
                        <div>Uploaded {date}</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default DeckButton;

