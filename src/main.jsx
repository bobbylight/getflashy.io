import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from './components/App';
import App404 from './components/App404';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DeckList from './components/DeckList';
import DeckConfig from './components/DeckConfig';
import Deck from './components/Deck';
import Results from './components/Results';

import currentDeckReducer from './slices/currentDeckSlice';
import configReducer from './slices/configSlice';
import decksReducer from './slices/decksSlice';

import 'bootswatch/dist/flatly/bootstrap.css';

import 'font-awesome/css/font-awesome.css';
import './css/app.css';


const store = configureStore({
    reducer: {
        currentDeck: currentDeckReducer,
        config: configReducer,
        decks: decksReducer,
    },
    // configureStore automatically includes Redux Thunk and sets up the Redux DevTools Extension.
    // middleware can be customized if needed, but for now, the default is fine.
});

createRoot(document.getElementById('app-content')).render(
    <Provider store={store}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route index element={<DeckList />} />
                    <Route path="/config/:deckId" element={<DeckConfig />} />
                    <Route path="/decks/:deckId" element={<Deck />} />
                    <Route path="/results/:deckId" element={<Results />} />
                    <Route path='*' element={<App404 />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </Provider>
);
