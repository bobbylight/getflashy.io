import React from 'react';

interface TimerProps {
  startTime: Date | null;
}

interface TimerState {
  intervalHandle: number;
  seconds: number;
  timespanStr: string;
}

class Timer extends React.Component<TimerProps, TimerState> {

    constructor(props: TimerProps) {
        super(props);
        this.state = { intervalHandle: 0, seconds: 0, timespanStr: '0:00' };
    }

    componentDidMount() {
        if (this.props.startTime) {
            const intervalHandle = window.setInterval(() => { // Use window.setInterval for clarity and global scope
                const seconds = Math.floor((new Date().getTime() - this.props.startTime!.getTime()) / 1000);
                this.setState({ seconds: seconds, timespanStr: this.createTimespanStr(seconds) });
            }, 1000);
            this.setState({ intervalHandle: intervalHandle });
        }
    }

    componentWillUnmount() {
        window.clearInterval(this.state.intervalHandle);
    }

    createTimespanStr(secs: number): string {
        const minutes = Math.floor(secs / 60);
        let seconds: string | number = secs % 60;
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        return minutes + ':' + seconds;
    }

    render() {
        return (
            <div className="timer">
                <i className="fa fa-clock-o" aria-hidden="true"></i> {this.state.timespanStr}
            </div>
        );
    }
}

export default Timer;
