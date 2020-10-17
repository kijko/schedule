import React, {useState} from "react";
import moment from "moment";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@material-ui/core";
import {NewNote} from "../new-note-model";
import {DateTimeInput, DateTimeInputChange, DateTimeInputType} from "../../commons";

export interface AddNoteDialogInput {
    onClose(): void;

    onNewNote(note: NewNote): void;
}

type NoteDurationPossibleValues = {
    min: number;
    max: number;
    step: number;
}

export const AddNoteDialog = (props: AddNoteDialogInput) => {
    const [dateFrom, setDateFrom] = useState(moment());
    const [durationInMinutes, setDurationInMinutes] = useState(30);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const possibleNoteDurationInterval: NoteDurationPossibleValues = {min: 15, max: 120, step: 15};

    function generateDurationInMinutesOptions(): { label: string; value: number }[] {
        const firstValue = possibleNoteDurationInterval.min;
        const lastValue = possibleNoteDurationInterval.max;
        const step = possibleNoteDurationInterval.step;

        const options: { label: string; value: number }[] = [];
        let actualValue = firstValue;
        while (actualValue <= lastValue) {
            options.push({label: `${actualValue}min`, value: actualValue});
            actualValue += step;
        }

        return options;
    }

    function onNewNote() {
        props.onNewNote({
            from: dateFrom,
            durationInMinutes: durationInMinutes,
            title: title,
            description: description
        });
    }

    return (
        <Dialog open={true}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">Add new note</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <DateTimeInput type={DateTimeInputType.DATE_AND_TIME}
                                   value={dateFrom}
                                   onChange={(event: DateTimeInputChange) => setDateFrom(event.value)}/>
                    <select style={{display: "block"}}
                            value={durationInMinutes}
                            onChange={(event) => setDurationInMinutes(Number.parseInt(event.target.value))}
                    >
                        {
                            generateDurationInMinutesOptions()
                                .map(it => <option key={it.label} value={it.value}>{it.label}</option>)
                        }
                    </select>
                    <input value={title}
                           onChange={(event) => setTitle(event.target.value)}
                           style={{display: "block"}} type="text" placeholder="title"
                    />
                    <textarea value={description}
                              onChange={(event) => setDescription(event.target.value)}
                              style={{display: "block"}} placeholder="description"
                    />
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.onClose()} color="secondary">
                    Cancel
                </Button>
                <Button onClick={() => onNewNote()} color="primary">
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    )
}
