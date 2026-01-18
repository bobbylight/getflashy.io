import { connect } from 'react-redux';
import { configureDeck } from '../actions';
import DeckList from '../components/DeckList';

const mapStateToProps = (state) => {
    return {
        decks: state.decks
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onDeckClick: (deck) => {
            dispatch(configureDeck(deck.id));
        }
    };
};

const VisibleDeckList = connect(
    mapStateToProps,
    mapDispatchToProps
)(DeckList);

export default VisibleDeckList;
