import React from 'react';
import DeckButton from './DeckButton';
import DeckFilter from './DeckFilter';

class DeckList extends React.Component {

    constructor(props) {
        super(props);
        this.state = { deckId: '', deckFilter: '' };

        // Manually bind this method to the component instance so "this" is what we expect
        this.onDeckFilterChange = this.onDeckFilterChange.bind(this);
    }

    componentDidMount() {
    }

    onDeckFilterChange(filter) {
        this.setState({ deckFilter: filter });
    }

    render() {

        var self = this;
        var filteredDecks = [];
        Object.keys(this.props.decks).forEach(function(key) {
            var deck = self.props.decks[key];
            if (deck.name.toLowerCase().indexOf(self.state.deckFilter) > -1) {
                filteredDecks.push(deck);
            }
        });

        return (
            <div className="container">
                <DeckFilter label="Filter decks:" helpText={this.state.deckId} onChange={this.onDeckFilterChange}/>
                    <div className="deck-buttons">
                    {
                        Object.keys(filteredDecks).map(function(key) {
                            return <DeckButton key={key} deck={filteredDecks[key]} onClick={self.props.onDeckClick}/>
                        })
                    }
                    </div>
            </div>
        );
    }
}

export default DeckList;
