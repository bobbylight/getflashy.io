import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppNavbar } from './Navbar';

const renderNavbar = () => {
    return render(
        <MemoryRouter>
            <AppNavbar />
        </MemoryRouter>,
    );
};

describe('AppNavbar', () => {
    afterEach(() => {
        cleanup();
    });

    describe('brand', () => {
        it('renders the brand name', () => {
            renderNavbar();
            expect(screen.getByText('Flashy')).toBeInTheDocument();
        });

        it('brand links to home page', () => {
            renderNavbar();
            const brandLink = screen.getByRole('link', { name: /flashy/i });
            expect(brandLink).toHaveAttribute('href', '/');
        });
    });
});
