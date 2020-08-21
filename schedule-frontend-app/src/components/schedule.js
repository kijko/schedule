import React from "react";

import "./schedule.css";

import {Schedule as ScheduleJS} from "../../node_modules/schedule-js/schedule.js";
import "../../node_modules/schedule-js/schedule.css";
import moment from "moment";

export class Schedule extends React.Component {
    scheduleContainerId = "schedule-container";

    constructor(props) {
        super(props);
        this.state = {
            dateFrom: new Date(),
            hourFrom: 8,
            hourTo: 16,
            scheduleJSElement: null,
        };
    }

    render() {
        return (
            <div>
                <ScheduleManagementPanel
                    onDatePeriodChange={(from, _) => this.initScheduleJS(from)}
                    onTimePeriodChange={(from, to) => this.initScheduleJS(this.state.dateFrom, from, to)}
                />
                <div id={this.scheduleContainerId}/>
            </div>
        );
    }

    initScheduleJS(date = this.state.dateFrom, hourFrom = this.state.hourFrom, hourTo = this.state.hourTo) {
        document.getElementById(this.scheduleContainerId).innerHTML = "";

        this.setState({
            dateFrom: date,
            hourFrom: hourFrom,
            hourTo: hourTo,
            scheduleJSElement: new ScheduleJS(
                document.getElementById(this.scheduleContainerId),
                date,
                hourFrom,
                hourTo,
                []
            )
        });
    }

    componentDidMount() {
      this.initScheduleJS(new Date(), 8, 16);
    }
}

function ScheduleManagementPanel(props) {
    return (
        <div className="schedule-management-panel">
            <DatePeriod onChange={props.onDatePeriodChange}/>
            <TimePeriod onChange={props.onTimePeriodChange}/>
        </div>
    );
}

class TimePeriod extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            from: 8,
            to: 16
        }
    }

    render() {
        return (
          <div>
              <input type="number" value={this.state.from} onChange={(event) => {
                  if (event.target.value) {
                      this.setState({ from: parseInt(event.target.value) }, () => this.props.onChange(this.state.from, this.state.to));
                  }

              }}/>
              <input type="number" value={this.state.to} onChange={(event) => {
                  if (event.target.value) {
                      this.setState({ to: parseInt(event.target.value) }, () => this.props.onChange(this.state.from, this.state.to));
                  }
              }}/>
          </div>
        );
    }
}

class DatePeriod extends React.Component {
    periodLengthInDays = 7;
    dateFormat = "yyyy-MM-DD"

    constructor(props) {
        super(props);
        this.state = {
            from: moment(),
            to: moment().add(this.periodLengthInDays - 1, 'days')
        };
    }

    render() {
        return (
            <div>
                <input type="date"
                       value={this.state.from.format(this.dateFormat)}
                       onChange={(event) => this.handleDateFromChange(event)}
                />
                <input type="date"
                       disabled={true}
                       value={this.state.to.format(this.dateFormat)}
                />
            </div>
        );
    }

    getFromValueAsString() {
        return this.state.from.format(this.dateFormat);
    }

    getToValueAsString() {
        return this.state.to.format(this.dateFormat);
    }

    handleDateFromChange(event) {
        const dateFromAsMoment = moment(event.target.value);
        const dateToAsMoment = moment(event.target.value).add(this.periodLengthInDays - 1, "days");
        this.setState({
            from: dateFromAsMoment,
            to: dateToAsMoment
        }, () => this.props.onChange(this.state.from.toDate(), this.state.to.toDate()));
    }
}



