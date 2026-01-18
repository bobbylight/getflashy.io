import React from 'react';
import { FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';

class DeckFilter extends React.Component {

    constructor(props) {
        super(props);
        this.state = { filter: '' };

        // Manually bind this method to the component instance so "this" is what we expect
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    handleFilterChange(e) {
        var filter = e.target.value;
        this.setState({ filter: filter });
        if (this.props.onChange) {
            this.props.onChange(filter);
        }
    }

    render() {
        return (
            <div>

                <FormGroup
                    controlId="formBasicText"
                >
                    <ControlLabel>{this.props.label}</ControlLabel>
                    <FormControl
                        type="text"
                        placeholder="Example: State Capitals"
                        onChange={this.handleFilterChange}
                    />
                    <FormControl.Feedback />
                    <HelpBlock>{this.props.helpText || ''}</HelpBlock>
                </FormGroup>

            </div>
        );
    }
}

export default DeckFilter;
