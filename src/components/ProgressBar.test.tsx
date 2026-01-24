import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
    afterEach(() => {
        cleanup();
    });

    describe('rendering', () => {
        it('renders the container element', () => {
            const { container } = render(<ProgressBar percent={50} />);

            expect(container.querySelector('.progress-bar-container')).toBeInTheDocument();
        });

        it('renders the fill element', () => {
            const { container } = render(<ProgressBar percent={50} />);

            expect(container.querySelector('.progress-bar-fill')).toBeInTheDocument();
        });
    });

    describe('percent handling', () => {
        it('sets width based on percent value', () => {
            const { container } = render(<ProgressBar percent={75} />);

            const fill = container.querySelector('.progress-bar-fill');
            expect(fill).toHaveStyle({ width: '75%' });
        });

        it('sets width to 0% when percent is 0', () => {
            const { container } = render(<ProgressBar percent={0} />);

            const fill = container.querySelector('.progress-bar-fill');
            expect(fill).toHaveStyle({ width: '0%' });
        });

        it('sets width to 100% when percent is 100', () => {
            const { container } = render(<ProgressBar percent={100} />);

            const fill = container.querySelector('.progress-bar-fill');
            expect(fill).toHaveStyle({ width: '100%' });
        });

        it('clamps percent to 0 when negative value provided', () => {
            const { container } = render(<ProgressBar percent={-20} />);

            const fill = container.querySelector('.progress-bar-fill');
            expect(fill).toHaveStyle({ width: '0%' });
        });

        it('clamps percent to 100 when value exceeds 100', () => {
            const { container } = render(<ProgressBar percent={150} />);

            const fill = container.querySelector('.progress-bar-fill');
            expect(fill).toHaveStyle({ width: '100%' });
        });
    });

    describe('color handling', () => {
        it('uses default brand color when no color provided', () => {
            const { container } = render(<ProgressBar percent={50} />);

            const fill = container.querySelector('.progress-bar-fill');
            expect(fill).toHaveStyle({ backgroundColor: 'var(--brand-color-dark)' });
        });

        it('uses custom color when provided', () => {
            const { container } = render(<ProgressBar percent={50} color="#22c55e" />);

            const fill = container.querySelector('.progress-bar-fill');
            expect(fill).toHaveStyle({ backgroundColor: '#22c55e' });
        });
    });
});
