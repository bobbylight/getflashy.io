import React from 'react';
import { connect } from 'react-redux';
import AppNavbar from './Navbar';
import { fetchDeckMetadata } from '../actions';
import { browserHistory } from 'react-router';

class App extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            state: 'select-deck',
            deck: ''
        };
    }

    componentDidMount() {
        this.props.dispatch(fetchDeckMetadata());
    }

    render() {

        // We use URL param instead of this.props.currentDeckId so bookmarking works
        var deckId = this.props.params.deck;

        return (
            <div>

                <AppNavbar/>

                <div className="container-fluid main-content">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

App = connect()(App); // Needed to "inject" dispatch() (!!)
export default App;
