import React, {ChangeEvent} from "react";
import moment, {Moment} from "moment";

export type DateTimeInputProperties = {
    type: "DATE" | "DATE_AND_TIME";
    value: Moment,
    onChange(event: DateTimeInputChange): void
    [propertyName: string]: any
}

export enum DateTimeInputType { DATE = "DATE", DATE_AND_TIME = "DATE_AND_TIME" }

export type DateTimeInputChange = {
    value: Moment;
}

export const DateTimeInput = (props: DateTimeInputProperties) => {
    const {value, type, onChange, ...rest} = props;

    const getInputType = () => {
        if (type === DateTimeInputType.DATE) {
            return "date";
        } else if (type === DateTimeInputType.DATE_AND_TIME) {
            return "datetime-local";
        } else {
            throw new Error("Incorrect input type.")
        }
    }

    const formatValue = () => {
        switch (type) {
            case DateTimeInputType.DATE:

                return formatForDateInput(value);
            case DateTimeInputType.DATE_AND_TIME:

                return formatForDateTimeInput(value);
            default:
                throw new Error("Unknown input type.")
        }
    }

    const parseValue = (value: string) => {
        switch (type) {
            case DateTimeInputType.DATE:

                return moment(value, moment.HTML5_FMT.DATE);
            case DateTimeInputType.DATE_AND_TIME:

                return moment(value, moment.HTML5_FMT.DATETIME_LOCAL);
            default:

                throw new Error("Unknown input type.")
        }
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
        props.onChange({value: parseValue(event.target.value)})

    return (
        <input type={getInputType()}
               value={formatValue()}
               {...rest}
               onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange(event)}/>
    )
};

function formatForDateInput(date: Moment): string {
    return date.format(moment.HTML5_FMT.DATE);
}

function formatForDateTimeInput(date: Moment): string {
    return date.format(moment.HTML5_FMT.DATETIME_LOCAL);
}

// TODO func
// TODO CSS IN JS
// TODO react testing library
// TODO COMMIT AND GET NODE BACKEND ON TOPIC
// export class DateTimeInput extends Component<DateTimeInputProperties, DateTimeInputState> {
//     constructor(props: DateTimeInputProperties) {
//         super(props);
//     }
//
//     private formatValue(value: Moment): string {
//         switch (this.props.type) {
//             case DateTimeInputType.DATE:
//
//                 return DateTimeInput.formatForDateInput(value);
//             case DateTimeInputType.DATE_AND_TIME:
//
//                 return DateTimeInput.formatForDateTimeInput(value);
//             default:
//
//                 throw new Error("Unknown input type.")
//         }
//     }
//
//     private parseValue(value: string): Moment {
//         switch (this.props.type) {
//             case DateTimeInputType.DATE:
//
//                 return moment(value, moment.HTML5_FMT.DATE);
//             case DateTimeInputType.DATE_AND_TIME:
//
//                 return moment(value, moment.HTML5_FMT.DATETIME_LOCAL);
//             default:
//
//                 throw new Error("Unknown input type.")
//         }
//     }
//
//     private static formatForDateInput(date: Moment): string {
//         return date.format(moment.HTML5_FMT.DATE);
//     }
//
//     private static formatForDateTimeInput(date: Moment): string {
//         return date.format(moment.HTML5_FMT.DATETIME_LOCAL);
//     }
//
//     render() {
//         const {value, type, onChange, ...rest} = this.props;
//
//         return (
//             <input type={this.getInputType(type)}
//                    value={this.formatValue(value)}
//                    {...rest}
//                    onChange={(event: ChangeEvent<HTMLInputElement>) => this.handleChange(event)}/>
//         )
//     }
//
//     private getInputType(type: "DATE" | "DATE_AND_TIME"): string {
//         if (this.props.type === DateTimeInputType.DATE) {
//             return "date";
//         } else if (this.props.type === DateTimeInputType.DATE_AND_TIME) {
//             return "datetime-local";
//         } else {
//             throw new Error("Incorrect input type.")
//         }
//     }
//
//     private handleChange(event: ChangeEvent<HTMLInputElement>) {
//         const newRawValue = event.target.value;
//
//         this.props.onChange({value: this.parseValue(newRawValue)})
//     }
// }
