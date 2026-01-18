import React from 'react';

interface DeckStatusProps {
  curCard: number;
  cardCount: number;
  correctCount: number;
}

interface DeckStatusState {}

export class DeckStatus extends React.Component<DeckStatusProps, DeckStatusState> {

    constructor(props: DeckStatusProps) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="deck-status">
                {this.props.curCard} / {this.props.cardCount} (<span style={{ color: "green" }}>{this.props.correctCount}</span>)
            </div>
        );
    }
}

export default DeckStatus;
