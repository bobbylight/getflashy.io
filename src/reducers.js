import { combineReducers } from 'redux';

const currentDeck/*Reducer*/ = (state = null, action) => {
    switch (action.type) {
        case 'CONFIGURE_DECK':
        case 'START_DECK':
            return action.deckId;
        default:
            return state;
    }
};

const decks/*Reducer*/ = (state = {}, action) => {

    switch (action.type) {
        case 'DECK_METADATA_LOADED':
            return action.deckMetadata;
        default:
            return state;
    }
};

const deckMetadata/*Reducer*/ = (state = {}, action) => {
    return state;
};

const config/*Reducer*/ = (state = { randomize: false, showSide: 'front' }, action) => {
    switch (action.type) {
        case 'START_DECK':
            return action.config;
        default:
            return state;
    }
};

export default combineReducers({
    currentDeck,
    config,
    decks,
    deckMetadata
});
