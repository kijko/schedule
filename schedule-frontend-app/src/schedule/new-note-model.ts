import {Moment} from "moment";

export interface NewNote {
    from: Moment;
    durationInMinutes: number;
    title: string;
    description: string;
}
