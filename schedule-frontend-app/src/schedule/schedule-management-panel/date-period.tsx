import React, {useEffect, useState} from "react";
import moment, {Moment} from "moment";
import {DateTimeInput, DateTimeInputChange, DateTimeInputType} from "../../commons";

export const DatePeriod = (props: DatePeriodInput) => {
    const periodLengthInDays = 7;

    const [from, setFrom] = useState(moment());
    const [to, setTo] = useState(moment().add(periodLengthInDays - 1, "days"));

    function handleDateFromChange(dateFrom: Moment) {
        const dateFromAsMoment = moment(dateFrom.toDate());
        const dateToAsMoment = moment(dateFrom.toDate()).add(periodLengthInDays - 1, "days");

        setFrom(dateFromAsMoment);
        setTo(dateToAsMoment);
    }

    useEffect(() => props.onChange(from.toDate(), to.toDate()), [from, to]);

    return (
        <div>
            <DateTimeInput type={DateTimeInputType.DATE}
                           value={from}
                           onChange={(event: DateTimeInputChange) => handleDateFromChange(event.value)}
            />

            <DateTimeInput type={DateTimeInputType.DATE}
                           value={to}
                           disabled={true}
                           onChange={() => {}}
            />
        </div>
    );
}

interface DatePeriodInput {
    onChange(from: Date, to: Date): void
}
