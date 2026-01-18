import React from 'react';
import $ from 'jquery';
import Card from './Card';
import DeckStatus from './DeckStatus';
import { Link } from 'react-router';
import ProgressBar from 'react-progress-bar-plus';
import Timer from './Timer';

// Utility function for Fisher-Yates shuffle
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * The deck of flash cards being worked through and its state.
 */
class Deck extends React.Component {

    constructor(props) {
        super(props);
        this.state = { deck: {}, curCard: 0, cardFlipped: false,
                correctCount: 0, startTime: null, animating: false };
    }

    componentWillMount() {
        // this.fetchDeckInfo = _.debounce(this.fetchDeckInfo, 500);
    }

    componentDidMount() {
        this.fetchDeckInfo(this.props.deckId);
        this.setState({ correctCount: 0, startTime: new Date() });
    }

    advance(knewCard) {

        const newCorrectCount = knewCard ? this.state.correctCount + 1 : this.state.correctCount;

        if (this.state.curCard < this.state.deck.cards.length - 1) {
            this.setState({ curCard: this.state.curCard + 1, correctCount: newCorrectCount, cardFlipped: false,
                    animating: false });
        }
        else {
            this.deckCompleted();
        }
    }

    componentWillUnmount() {
        console.log('Removing key handler...');
        $(document).off('keydown.deck');
    }

    configureDeck(deck) {

        if (this.props.config.randomize) {
            shuffleArray(deck.cards);
        }

        // TODO: Front or back
    }

    fetchDeckInfo(deckId) {
        $.ajax({
            url: '/api/decks/' + deckId,
            dataType: 'json',
            cache: false,
            success: function(data) {
                console.log('Successfully loaded deck: ' + deckId);
                this.configureDeck(data);
                this.setState({ deck: data });
            }.bind(this),
            error: function(xhr, status, err) {
                this.setState({ deckId: '', curCard: -1 });
                console.error(deckId, status, err.toString());
            }.bind(this)
        });
    }

    noSuchDeck() {
        return (
            <div className="container">
                No such deck!
                <p>
                    <Link to="/">Back to deck list</Link>
                </p>
            </div>
        );
    }

    loadingScreen() {
        return (
            <div className="container">
                Loading...
            </div>
        );
    }

    deckCompleted() {
        this.props.onDeckCompleted(this.props.deckId);
    }

    toggleCardVisibleSide(e) {
        this.setState({ cardFlipped: !this.state.cardFlipped });
        e.stopPropagation();
        e.preventDefault();
    }

    userKnewCard(knew) {
        if (!this.state.animating) {
            this.setState({animating: true});
            this.topCard.setUserKnew(knew);
        }
    }

    render() {

        if (this.state.curCard === -1) {
            return this.noSuchDeck();
        }
        if (!this.state.deck.cards) {
            return (<div></div>); // Not yet fetched
        }

        const fillHeight = { height: '100%' };
        const percent = this.state.curCard / this.state.deck.cards.length * 100;

        const nextCardStyle = {
            zIndex: -100,
            position: 'absolute',
            width: '100%'
        };

        return (
            <div style={fillHeight}>

                {

                    (() => {

                        if (this.state.deck.id) {

                            const cards = this.state.deck.cards;
                            const card = cards[this.state.curCard];
                            const nextCard = this.state.curCard < cards.length - 1 ? cards[this.state.curCard + 1] : null;

                            return (
                                <div className="deck">
                                    <ProgressBar spinner={false} percent={percent}/>
                                    <div className="deck-nav left-nav" onClick={() => { this.userKnewCard(false); }}>
                                        <i className="fa fa-chevron-left" aria-hidden="true"></i>
                                    </div>
                                    <div className="deck-card-section">
                                        <Timer startTime={this.state.startTime}></Timer>
                                        {(() => {
                                            if (nextCard) {
                                                return (
                                                    <div style={nextCardStyle}>
                                                        <Card key={nextCard.front.text} card={nextCard} flipped={false}/>
                                                    </div>
                                                );
                                            }
                                            return '';
                                        })()
                                        }
                                        <Card key={card.front.text} card={card} flipped={this.state.cardFlipped}
                                                ref={(instance) => { this.topCard = instance; }} advance={this.advance.bind(this)}
                                                toggleVisibleSide={this.toggleCardVisibleSide.bind(this)}/>

                                        <div>
                                            <DeckStatus curCard={this.state.curCard + 1} cardCount={cards.length}
                                                    correctCount={this.state.correctCount}/>
                                        </div>
                                    </div>
                                    <div className="deck-nav right-nav" onClick={() => { this.userKnewCard(true); }}>
                                        <i className="fa fa-chevron-right" aria-hidden="true" ></i>
                                    </div>
                                </div>
                            )
                        }

                        return this.loadingScreen();
                    })()
                }
            </div>
        );
    }
}

export default Deck;
