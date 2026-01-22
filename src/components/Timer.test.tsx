import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, act } from '@testing-library/react';
import { Timer } from './Timer';

describe('Timer', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
        cleanup();
    });

    describe('initial render', () => {
        it('renders with 0:00 initially when startTime is now', () => {
            const now = new Date();
            vi.setSystemTime(now);

            render(<Timer startTime={now} />);

            expect(screen.getByText('0:00')).toBeInTheDocument();
        });
    });

    describe('time formatting', () => {
        it('formats seconds with leading zero when less than 10', async() => {
            const startTime = new Date('2024-01-01T00:00:00');
            vi.setSystemTime(new Date('2024-01-01T00:00:04'));

            render(<Timer startTime={startTime} />);
            await act(() => vi.advanceTimersByTime(1000));
            expect(screen.getByText('0:05')).toBeInTheDocument();
        });

        it('formats seconds without leading zero when 10 or more', async() => {
            const startTime = new Date('2024-01-01T00:00:00');
            vi.setSystemTime(new Date('2024-01-01T00:00:14'));

            render(<Timer startTime={startTime} />);
            await act(() => vi.advanceTimersByTime(1000));
            expect(screen.getByText('0:15')).toBeInTheDocument();
        });

        it('displays minutes correctly', async() => {
            const startTime = new Date('2024-01-01T00:00:00');
            vi.setSystemTime(new Date('2024-01-01T00:02:29'));

            render(<Timer startTime={startTime} />);
            await act(() => vi.advanceTimersByTime(1000));
            expect(screen.getByText('2:30')).toBeInTheDocument();
        });

        it('handles exactly 60 seconds as 1:00', async() => {
            const startTime = new Date('2024-01-01T00:00:00');
            vi.setSystemTime(new Date('2024-01-01T00:00:59'));

            render(<Timer startTime={startTime} />);
            await act(() => vi.advanceTimersByTime(1000));
            expect(screen.getByText('1:00')).toBeInTheDocument();
        });

        it('handles large time values', async() => {
            const startTime = new Date('2024-01-01T00:00:00');
            vi.setSystemTime(new Date('2024-01-01T01:30:44'));

            render(<Timer startTime={startTime} />);
            await act(() => vi.advanceTimersByTime(1000));
            expect(screen.getByText('90:45')).toBeInTheDocument();
        });
    });

    describe('time updates', () => {
        it('updates time after 1 second', () => {
            const startTime = new Date('2024-01-01T00:00:00');
            vi.setSystemTime(startTime);

            render(<Timer startTime={startTime} />);

            expect(screen.getByText('0:00')).toBeInTheDocument();
            act(() => {
                vi.advanceTimersByTime(1000);
            });
            expect(screen.getByText('0:01')).toBeInTheDocument();
        });
    });

    describe('interval cleanup', () => {
        it('clears interval on unmount', () => {
            const clearIntervalSpy = vi.spyOn(window, 'clearInterval');
            const startTime = new Date();
            vi.setSystemTime(startTime);

            const { unmount } = render(<Timer startTime={startTime} />);
            unmount();
            expect(clearIntervalSpy).toHaveBeenCalled();
        });

        it('does not update after unmount', () => {
            const startTime = new Date('2024-01-01T00:00:00');
            vi.setSystemTime(startTime);

            const { unmount } = render(<Timer startTime={startTime} />);

            unmount();
            vi.advanceTimersByTime(5000);
            expect(screen.queryByText('0:05')).not.toBeInTheDocument();
        });
    });
});
