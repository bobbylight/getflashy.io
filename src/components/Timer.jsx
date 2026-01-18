import React from 'react';

class Timer extends React.Component {

    constructor(props) {
        super(props);
        this.state = { intervalHandle: 0, seconds: 0 };
    }

    componentDidMount() {
        const intervalHandle = setInterval(() => {
            const seconds = Math.floor((new Date().getTime() - this.props.startTime) / 1000);
            this.setState({ seconds: seconds, timespanStr: this.createTimespanStr(seconds) });
        }, 1000);
        this.setState({ intervalHandle: intervalHandle, timespanStr: '0:00' });
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalHandle);
    }

    createTimespanStr(secs) {
        const minutes = Math.floor(secs / 60);
        let seconds = secs % 60;
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
