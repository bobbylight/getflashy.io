import React from 'react';
import { Link } from 'react-router';

class App404 extends React.Component {

    constructor(props) {

        super(props);

        this.state = {};
    }

    render() {

        return (
            <div>
                <div className="container">
                    Not sure what you're looking for!
                    <p>
                        <Link to="/">Back to deck list</Link>
                    </p>
                </div>
            </div>
        );
    }
}

export default App404;
