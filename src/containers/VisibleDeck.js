import { connect } from 'react-redux';
import Deck from '../components/Deck';
import { showResults } from '../actions';

const mapStateToProps = (state, ownProps) => {
    return {
        deckId: ownProps.params.deckId, // Don't use redux state for bookmarking purposes
        config: state.config
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onDeckCompleted: (deckId) => {
            dispatch(showResults(deckId));
        }
    };
};

const VisibleDeck = connect(
    mapStateToProps,
    mapDispatchToProps
)(Deck);

export default VisibleDeck;
