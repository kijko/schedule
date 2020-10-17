export declare class Schedule {
    constructor(container: HTMLElement, dateFrom: Date, hourFrom: number, hourTo: number, notes: Note[]);
    addNote(note: Note);
}

export declare class Note {
    date: Date;
    durationInMinutes: number;
    title: string;
    description: string;
    color: string;

    constructor(dateTime: Date, durationInMinutes: number, title: string, description?: string, color?: string);
}
