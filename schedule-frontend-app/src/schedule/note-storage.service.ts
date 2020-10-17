import {Note} from "schedule-js";
import {Observable, of} from "rxjs";
import moment from "moment";
import React, {useContext} from "react";

export interface NoteStorage {
    getUserNotes(userId: string): Observable<Note[]>;
    save(userId: string, note: Note): Observable<Note>;
}

interface NoteChest {
    username: string;
    notes: PersistentNote[];
}

interface PersistentNote {
    dateTime: string;
    durationInMinutes: number;
    title: string;
    description?: string;
    color?: string;
}

export class LocalStorageNoteStorage implements NoteStorage {
    private storageKey = "pl-kijko-schedule-notes";

    getUserNotes(userId: string): Observable<Note[]> {
        const chest: NoteChest | null = this.getUserChest(userId);

        if (chest) {
            return of(chest.notes.map(it => LocalStorageNoteStorage.toNote(it)));
        } else {
            return of([]);
        }

    }

    private static toNote(persistenceNote: PersistentNote) {
        return new Note(
            moment(persistenceNote.dateTime, moment.HTML5_FMT.DATETIME_LOCAL).toDate(),
            persistenceNote.durationInMinutes,
            persistenceNote.title,
            persistenceNote.description,
            persistenceNote.color
        );
    }

    private getUserChest(userId: string): NoteChest | null {
        const allChests: NoteChest[] = this.getAllChests();

        if (allChests.length > 0) {
            const userChests = allChests.filter(it => it.username === userId);
            if (userChests.length > 0) {
                return userChests[0];
            } else {
                return null;
            }
        } else {
            return null;
        }

    }

    getAllChests(): NoteChest[] {
        const rawChests: string | null = localStorage.getItem(this.storageKey);

        if (rawChests) {
            return JSON.parse(rawChests);
        } else {
            return [];
        }
    }

    save(userId: string, note: Note): Observable<Note> {
        const chest: NoteChest | null = this.getUserChest(userId);

        if (chest) {
            chest.notes.push(LocalStorageNoteStorage.toPersistentNote(note));
            this.saveChest(chest);
        } else {
            this.saveChest({ username: userId, notes: [LocalStorageNoteStorage.toPersistentNote(note)] } as NoteChest)
        }

        return of(note);
    }

    private static toPersistentNote(note: Note): PersistentNote {
        const noteDateTime = note.date;

        return {
            dateTime: moment(noteDateTime).format(moment.HTML5_FMT.DATETIME_LOCAL),
            durationInMinutes: note.durationInMinutes,
            title: note.title,
            description: note.description,
            color: note.color
        }
    }

    private saveChest(chest: NoteChest) {
        const allChests = this.getAllChests();

        const userChests = allChests.filter(it => it.username === chest.username);
        if (userChests.length > 0) {
            userChests[0].notes = chest.notes;
        } else {
            allChests.push(chest);
        }

        this.persistChests(allChests);
    }

    private persistChests(chests: NoteChest[]) {
        localStorage.setItem(this.storageKey, JSON.stringify(chests));
    }

}

const NoteStorageContext = React.createContext<NoteStorage>(new LocalStorageNoteStorage());
export const useNoteStorage = () => useContext(NoteStorageContext);

export default NoteStorage;
