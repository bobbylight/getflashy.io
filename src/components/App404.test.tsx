import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App404 } from './App404';

describe('App404', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders the not found message', () => {
        render(
            <MemoryRouter>
                <App404 />
            </MemoryRouter>,
        );

        expect(screen.getByText("Not sure what you're looking for!")).toBeInTheDocument();
    });

    it('renders a link back to deck list', () => {
        render(
            <MemoryRouter>
                <App404 />
            </MemoryRouter>,
        );

        const link = screen.getByRole('link', { name: 'Back to deck list' });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/');
    });

    it('has the container class', () => {
        const { container } = render(
            <MemoryRouter>
                <App404 />
            </MemoryRouter>,
        );

        expect(container.querySelector('.container')).toBeInTheDocument();
    });
});
