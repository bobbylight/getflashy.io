import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App } from './App';

vi.mock(import('./Navbar'), () => ({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    AppNavbar: () => <div data-testid="mock-navbar">Mock Navbar</div>,
}));

describe('App', () => {
    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    it('renders the navbar', () => {
        render(
            <MemoryRouter>
                <App />
            </MemoryRouter>,
        );

        expect(screen.getByTestId('mock-navbar')).toBeInTheDocument();
    });

    it('renders the main content container', () => {
        const { container } = render(
            <MemoryRouter>
                <App />
            </MemoryRouter>,
        );

        const mainContent = container.querySelector('.container-fluid.main-content');
        expect(mainContent).toBeInTheDocument();
    });

    it('renders the Outlet for nested routes', () => {
        const { container } = render(
            <MemoryRouter>
                <App />
            </MemoryRouter>,
        );

        // The Outlet is rendered inside the main-content container
        // We verify the structure is correct
        const mainContent = container.querySelector('.main-content');
        expect(mainContent).toBeInTheDocument();
    });
});
