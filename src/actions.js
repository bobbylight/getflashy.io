import { browserHistory } from 'react-router';
import $ from 'jquery';

export const startingDeckMetadataFetch = () => {
    return {
        type: 'START_DECK_METADATA_FETCH'
    };
};

export const deckMetadataLoaded = (deckMetadata) => {
    return {
        type: 'DECK_METADATA_LOADED',
        deckMetadata: deckMetadata
    };
};

// Action creator function that returns a function (i.e., a thunk).  This fetches the list of decks from the server.
export const fetchDeckMetadata = () => {

    // Thunk middleware knows how to handle functions.
    // It passes the dispatch method as an argument to the function,
    // thus making it able to dispatch actions itself.
    return (dispatch) => {

        // Notification of the request for decks, for e.g. busy spinner display
        dispatch(startingDeckMetadataFetch());

        $.ajax({
            url: '/api/decks',
            dataType: 'json',
            success: function(data) {
                for (var deckId in data) {
                    data[deckId].id = deckId;
                }
                console.log('data === ' + JSON.stringify(data));
                dispatch(deckMetadataLoaded(data));
            }.bind(this),
            error: function(xhr, status, err) {
                console.error('#GET Error', status, err.toString());
            }.bind(this)
        });
    };
};

export const configureDeck = (deckId) => {
    browserHistory.push('/config/' + deckId); // TODO: This is probably very, very bad, but how do we programmatically navigate?
    return {
        type: 'CONFIGURE_DECK',
        deckId: deckId
    };
};

export const startDeck = (deckId, config) => {
    browserHistory.push('/decks/' + deckId); // TODO: This is probably very, very bad, but how do we programmatically navigate?
    return {
        type: 'START_DECK',
        deckId: deckId,
        config: config
    };
};

export const showResults = (deckId) => {
    browserHistory.push('/results/' + deckId); // TODO: This is probably very, very bad, but how do we programmatically navigate?
    return {
        type: 'SHOW_RESULTS',
        deckId: deckId
    };
};

export const goHome = () => {
    browserHistory.push('/'); // TODO: This is probably very, very bad, but how do we programmatically navigate?
    return {
        type: 'RETURN_HOME'
    };
};