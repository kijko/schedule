import React, {ChangeEvent, useEffect, useState} from "react";

interface TimePeriodInput {
    onChange(from: number, to: number): void
}
export const TimePeriod = (props: TimePeriodInput) => {
    const [from, setFrom] = useState(8);
    const [to, setTo] = useState(16);

    useEffect(() => {
        props.onChange(from, to);
    }, [from, to])

    function handleFromChange(event: ChangeEvent<HTMLInputElement>) {
        if (event.target.value) {
            setFrom(parseInt(event.target.value));
        }
    }

    function handleToChange(event: ChangeEvent<HTMLInputElement>) {
        if (event.target.value) {
            setTo(parseInt(event.target.value));
        }
    }

    return (
        <div>
            <input type="number" value={from} onChange={(event) => handleFromChange(event)}/>
            <input type="number" value={to} onChange={(event) => handleToChange(event)}/>
        </div>
    );
};


