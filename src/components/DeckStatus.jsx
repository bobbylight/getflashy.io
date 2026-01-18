import React from 'react';

export class DeckStatus extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        var date = new Date().toString();

        return (
            <div className="deck-status">
                {this.props.curCard} / {this.props.cardCount} (<font color="green">{this.props.correctCount}</font>)
            </div>
        );
    }
}

export default DeckStatus;
