import { Link } from 'react-router-dom';

export function App404() {
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
