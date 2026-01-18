import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';
import App from './components/App';
import App404 from './components/App404';
import VisibleDeck from './containers/VisibleDeck';
import VisibleDeckConfig from './containers/VisibleDeckConfig';
import VisibleDeckList from './containers/VisibleDeckList';
import VisibleResults from './containers/VisibleResults';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import thunkMiddleware from 'redux-thunk'; // Allow action creators to return functions for async operations
import createLogger from 'redux-logger'; // Log actions

// First bootstrap, then the bootstrap theme to apply
// import 'bootstrap/dist/css/bootstrap.css'
import 'bootswatch/flatly/bootstrap.css';

import 'font-awesome/css/font-awesome.css';
import './css/app.css';
import 'react-progress-bar-plus/lib/progress-bar.css';

const loggerMiddleware = createLogger();
const store = createStore(rootReducer,
    applyMiddleware(
        thunkMiddleware, // Let us dispatch functions
        loggerMiddleware // Logs actions
    )
);

ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={VisibleDeckList} />
                <Route path="/config/:deckId" component={VisibleDeckConfig} />
                <Route path="/decks/:deckId"  component={VisibleDeck} />
                <Route path="/results/:deckId"  component={VisibleResults} />
                <Route path='*' component={App404} />
            </Route>
        </Router>
    </Provider>,
    document.getElementById('app-content')
);
