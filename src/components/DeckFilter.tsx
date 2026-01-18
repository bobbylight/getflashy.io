import React, { useState, ChangeEvent } from 'react';
import { Form } from 'react-bootstrap';

interface DeckFilterProps {
  label: string;
  helpText?: string;
  onChange: (filter: string) => void;
}

function DeckFilter({ label, helpText, onChange }: DeckFilterProps) {
    const [filter, setFilter] = useState<string>('');

    const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
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
                    value={filter}
                />
                <Form.Control.Feedback />
                <Form.Text className="text-muted">{helpText || ''}</Form.Text>
            </Form.Group>
        </div>
    );
}

export default DeckFilter;
