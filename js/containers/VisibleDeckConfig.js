import { connect } from 'react-redux';
import Deck from '../components/DeckConfig';
import { startDeck } from '../actions';

const mapStateToProps = (state, ownProps) => {
    return {
        deckId: ownProps.routeParams.deckId // Don't rely on state for bookmarking
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onDeckConfigure: (deckId) => {
            dispatch(startDeck(deckId));
        }
    };
};

const VisibleDeckConfig = connect(
    mapStateToProps,
    mapDispatchToProps
)(Deck);

export default VisibleDeckConfig;
