import { useState, useEffect, useRef, useCallback } from 'react';

interface TimerProps {
  startTime: Date;
}

export const Timer = ({ startTime }: TimerProps) => {
    const [ timespanStr, setTimespanStr ] = useState<string>('0:00');
    const intervalHandleRef = useRef<number | null>(null); // Use useRef for mutable interval handle

    const createTimespanStr = useCallback((secs: number): string => {
        const minutes = Math.floor(secs / 60);
        let seconds: string | number = secs % 60;
        if (seconds < 10) {
            seconds = `0${seconds}`;
        }
        return `${minutes}:${seconds}`;
    }, []); // Memoize as it's a pure function

    useEffect(() => {
        // On rerender, clear interval in preparation for a new one
        const cleanup = () => {
            if (intervalHandleRef.current !== null) {
                window.clearInterval(intervalHandleRef.current);
                intervalHandleRef.current = null;
            }
        };

        cleanup();

        intervalHandleRef.current = window.setInterval(() => {
            const currentSeconds = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
            setTimespanStr(createTimespanStr(currentSeconds));
        }, 1000);

        // Cleanup on unmount
        return cleanup;
    }, [ startTime, createTimespanStr ]);

    return (
        <div className="timer">
            <i className="fa fa-clock-o" aria-hidden="true"></i> {timespanStr}
        </div>
    );
};
