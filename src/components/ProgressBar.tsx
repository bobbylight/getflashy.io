interface ProgressBarProps {
    percent: number;
    color?: string;
    variant?: 'topline' | 'standard';
}

export function ProgressBar({ percent, color = 'var(--brand-color-dark)', variant = 'topline' }: ProgressBarProps) {
    const clampedPercent = Math.max(0, Math.min(100, percent));
    const containerClass = variant === 'topline' ? 'progress-bar-topline' : 'progress-bar-standard';

    return (
        <div className={containerClass}>
            <div
                className="progress-bar-fill"
                style={{ width: `${clampedPercent}%`, background: color }}
            />
        </div>
    );
}
