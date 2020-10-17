import React, {useState} from "react";
import {DatePeriod} from "./date-period";
import {AddNoteDialog} from "./add-note-dialog";
import {TimePeriod} from "./time-period";
import {NewNote} from "../new-note-model";

interface ScheduleManagementPanelInput {
    onDatePeriodChange: (dateFrom: Date, dateTo: Date) => void,
    onTimePeriodChange: (timeFrom: number, timeTo: number) => void,

    onNoteAdded(note: NewNote): void
}


export const ScheduleManagementPanel = (props: ScheduleManagementPanelInput) => {
    const [noteDialogOpened, openNoteDialog] = useState(false);

    function onNoteAdded(note: NewNote) {
        props.onNoteAdded(note);
        openNoteDialog(false);
    }

    return (
        <div className="schedule-management-panel">
            <button type="button" onClick={() => openNoteDialog(true)}>
                Add note
            </button>
            <DatePeriod onChange={props.onDatePeriodChange}/>
            <TimePeriod onChange={props.onTimePeriodChange}/>

            {noteDialogOpened &&
            <AddNoteDialog onClose={() => openNoteDialog(false)}
                           onNewNote={(note: NewNote) => onNoteAdded(note)}
            />
            }
        </div>
    );
}
