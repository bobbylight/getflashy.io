import React, { useState } from 'react';
import { Form } from 'react-bootstrap'; // Only Form component is needed now

function DeckFilter({ label, helpText, onChange }) {
    const [filter, setFilter] = useState('');

    const handleFilterChange = (e) => {
        const newFilter = e.target.value;
        setFilter(newFilter);
        if (onChange) {
            onChange(newFilter);
        }
    };

    return (
        <div>
            <Form.Group controlId="formBasicText">
                <Form.Label>{label}</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Example: State Capitals"
                    onChange={handleFilterChange}
                    value={filter} // Add value prop for controlled component
                />
                <Form.Control.Feedback />
                <Form.Text className="text-muted">{helpText || ''}</Form.Text>
            </Form.Group>
        </div>
    );
}

export default DeckFilter;
