import React from 'react';
import { DeckMetadata } from '../api';

interface DeckButtonProps {
  deck: DeckMetadata; // Now DeckMetadata has size and modified
  onClick: (deck: DeckMetadata) => void;
}

interface DeckButtonState {}

export class DeckButton extends React.Component<DeckButtonProps, DeckButtonState> {

    constructor(props: DeckButtonProps) {
        super(props);
        this.state = {};
    }

    render() {
        const { deck, onClick } = this.props;
        const date = new Date(deck.modified).toDateString();
        const icon = deck?.icon?.name ?? 'smile-o';
        const style = {
            color: deck?.icon?.color ?? 'black'
        };

        return (
            <div className="deck-button" onClick={ () => onClick(deck) }>
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

