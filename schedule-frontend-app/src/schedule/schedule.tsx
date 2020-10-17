import React, {useLayoutEffect, useState} from "react";

import "./schedule.css";
import "schedule-js/schedule.css";
import {Note, Schedule as ScheduleJS} from "schedule-js";
import NoteStorage, {useNoteStorage} from "./note-storage.service";
import {Subscription} from "rxjs";
import {ScheduleManagementPanel} from "./schedule-management-panel/schedule-management-panel";
import {Authorization, useAuthService} from "../commons";
import {NewNote} from "./new-note-model";

export const Schedule = () => {
    const noteStorage: NoteStorage = useNoteStorage();

    const [dateFrom, setDateFrom] = useState(new Date());
    const [hourFrom, setHourFrom] = useState(8);
    const [hourTo, setHourTo] = useState(16);
    const [notes, setNotes] = useState([] as Note[]);

    const authService = useAuthService();
    const subs = [] as Subscription[];
    useLayoutEffect(() => {
        subs.push(
            authService.getAuthorization().subscribe((auth: Authorization) => {
                subs.push(
                    noteStorage.getUserNotes(auth.username)
                        .subscribe(notes => setNotes(notes))
                );
            })
        )

        return () => subs.forEach(sub => sub.unsubscribe());
    }, [])

    const scheduleContainerId = "schedule-container";
    useLayoutEffect(() => {
        const scheduleRootElement = document.getElementById(scheduleContainerId);
        if (scheduleRootElement) {
            scheduleRootElement.innerHTML = "";
            new ScheduleJS(scheduleRootElement, dateFrom, hourFrom, hourTo, notes);

        } else throw new Error("specified root element not exists");
    });

    function addNote(newNote: NewNote) {
        const note = new Note(newNote.from.toDate(), newNote.durationInMinutes, newNote.title, newNote.description);

        subs.push(
            authService.getAuthorization().subscribe((auth: Authorization) => {
                subs.push(
                    noteStorage.save(auth.username, note)
                        .subscribe(savedNote => setNotes([...notes, savedNote]))
                )
            })
        )
    }

    return (
        <div>
            <ScheduleManagementPanel
                onDatePeriodChange={(from, _) => setDateFrom(from)}
                onTimePeriodChange={(from, to) => {
                    setHourFrom(from);
                    setHourTo(to);
                }}
                onNoteAdded={(note: NewNote) => addNote(note)}
            />
            <div id={scheduleContainerId}/>
        </div>
    );
}



