interface ProgressBarProps {
    percent: number;
    color?: string;
}

export function ProgressBar({ percent, color = 'var(--brand-color-dark)' }: ProgressBarProps) {
    const clampedPercent = Math.max(0, Math.min(100, percent));

    return (
        <div className="progress-bar-container">
            <div
                className="progress-bar-fill"
                style={{ width: `${clampedPercent}%`, backgroundColor: color }}
            />
        </div>
    );
}
