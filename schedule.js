/* global console */

class Note {
    constructor(title, date, durationInMinutes, color = "#588093") {
        this.date = date;
        this.durationInMinutes = durationInMinutes;

        this._title = title;
        this._color = color;

        this._initVerticallyNote();
        this._initStaticNote();
    }


    _initVerticallyNote() {
        this._verticallyNote = document.createElement("DIV");
        this._verticallyNote.classList.add("note-card-vertically");

        const verticallyNoteTime = document.createElement("DIV");
        verticallyNoteTime.classList.add("note-time");
        verticallyNoteTime.innerText = this._prepareTimePeriod();
        this._verticallyNote.appendChild(verticallyNoteTime);

        const verticallyNoteTitle = document.createElement("DIV");
        verticallyNoteTitle.classList.add("note-title");
        verticallyNoteTitle.innerText = this._title;
        this._verticallyNote.appendChild(verticallyNoteTitle);

        this._verticallyNote.style.backgroundColor = this._color;
    }

    _initStaticNote() {
        this._staticNote = document.createElement("DIV");
        this._staticNote.classList.add("note-card-static");

        this._staticNoteTime = document.createElement("DIV");
        this._staticNoteTime.classList.add("note-time");
        this._staticNoteTime.innerText = this._prepareTimePeriod();
        this._staticNote.appendChild(this._staticNoteTime);

        this._staticNoteTitle = document.createElement("DIV");
        this._staticNoteTitle.classList.add("note-title");
        this._staticNoteTitle.innerText = this._title;
        this._staticNote.appendChild(this._staticNoteTitle);

        this._initStaticNotePopup()

        this._staticNote.style.backgroundColor = this._color;
    }

    _initStaticNotePopup() {
        this._popupElements = document.createElement("DIV");

        const staticNotePopupHeader = document.createElement("DIV");
        staticNotePopupHeader.classList.add("note-card-static-opened-header")
        staticNotePopupHeader.style.backgroundColor = this._color;

        const staticNotePopupHeaderExitButton = document.createElement("DIV");
        staticNotePopupHeaderExitButton.classList.add("note-card-static-opened-header-exit")
        staticNotePopupHeaderExitButton.onclick = () => { this._closeStaticNote() }
        staticNotePopupHeader.appendChild(staticNotePopupHeaderExitButton)

        this._popupElements.appendChild(staticNotePopupHeader);

        const staticNotePopupBody = document.createElement("DIV");
        staticNotePopupBody.classList.add("note-card-static-opened-body")
        this._popupElements.appendChild(staticNotePopupBody)
        this._popupElements.style.display = "none"

        this._staticNote.appendChild(this._popupElements)

        // clickspot
        this._staticNoteClickSpot = document.createElement("DIV");
        this._staticNoteClickSpot.classList.add("note-card-static-clickspot")
        this._staticNote.appendChild(this._staticNoteClickSpot);

        this._staticNoteClickSpot.onclick = () => {
            this._openStaticNote()
        }

        this._staticNote.appendChild(this._staticNoteClickSpot)
        //clickspot
    }

    _openStaticNote() {
        this._staticNote.classList.remove("note-card-static");
        this._staticNote.classList.add("note-card-static-opened");
        this._staticNote.style.backgroundColor = "white";

        // hide title and time
        this._staticNoteTime.style.display = "none"
        this._staticNoteTitle.style.display = "none"

        //show popup things
        this._popupElements.style.display = "block"

        this._staticNoteClickSpot.style.display = "none";
    }

    _closeStaticNote() {
        this._staticNote.classList.remove("note-card-static-opened");
        this._staticNote.classList.add("note-card-static");
        this._staticNote.style.backgroundColor = this._color;

        this._staticNoteTime.style.display = "block"
        this._staticNoteTitle.style.display = "block"

        this._popupElements.style.display = "none"

        this._staticNoteClickSpot.style.display = "block"
    }

    _prepareTimePeriod() {
        const timeFrom = formatTime(this.date.getHours(), this.date.getMinutes());

        const dateTo = new Date(this.date.getTime());
        dateTo.setMinutes(this.date.getMinutes() + this.durationInMinutes);
        const timeTo = formatTime(dateTo.getHours(), dateTo.getMinutes());

        return `${timeFrom} - ${timeTo}`;
    }

    setVerticalPositionInPx(px) {
        this._verticallyNote.style.top = `${px}px`;
    }

    setHeight(px) {
        this._verticallyNote.style.height = px;
    }

    addToElement(element) {
        element.appendChild(this._verticallyNote);
        element.appendChild(this._staticNote);
    }

}

class Day {
    constructor(date, name, dayHourFrom, dayHourTo) {
        this.date = date;
        this.dayHourFrom = dayHourFrom;
        this.dayHourTo = dayHourTo;
        this._halfHourCellHeight = 30;

        this._element = document.createElement("DIV");
        this._element.classList.add("day");

        const dayHeaderContainer = document.createElement("DIV");
        dayHeaderContainer.classList.add("day-header");

        const dayHeader = document.createElement("SPAN");
        dayHeader.innerText = name;

        this._dayNotes = document.createElement("DIV");
        this._dayNotes.classList.add("day-notes");

        this.dayLengthInHours = dayHourTo - dayHourFrom + 1;
        numberRange(1, this.dayLengthInHours * 2).forEach(_ => {
            const halfHourElement = document.createElement("DIV");
            halfHourElement.classList.add("day-notes-half-hour");
            this._dayNotes.appendChild(halfHourElement);
        });

        dayHeaderContainer.appendChild(dayHeader);

        this._element.appendChild(dayHeaderContainer);
        this._element.appendChild(this._dayNotes);
    }

    getElement() {
        return this._element;
    }

    addNote(note) {
        const minuteOfDayFrom = this.dayHourFrom * 60;
        const minuteOfDayNoteFrom = note.date.getHours() * 60 + note.date.getMinutes();

        if (minuteOfDayNoteFrom >= minuteOfDayFrom) {
            const oneMinuteHeightInPx = (this._halfHourCellHeight / 30).toFixed(2);
            const verticalPosition = oneMinuteHeightInPx * (minuteOfDayNoteFrom - minuteOfDayFrom);

            note.setVerticalPositionInPx(verticalPosition);


            if (minuteOfDayNoteFrom + note.durationInMinutes <= this.dayHourTo * 60) {
                const noteHeightInPx = oneMinuteHeightInPx * note.durationInMinutes;
                note.setHeight(noteHeightInPx);

                note.addToElement(this._dayNotes);
            } else {
                console.error("Invalid note time to - note duration time is to long");
            }


        } else {
            console.error("Invalid note time from - note starts to early");
        }


    }
}

class Week {
    constructor(firstDayDate, dayHourFrom, dayHourTo) {
        this._container = document.querySelector(".days");

        const daysData = next7Days(firstDayDate);

        this._days = daysData.map(dayData => new Day(dayData.date, dayData.name, dayHourFrom, dayHourTo));
        this._days.forEach(day => this._container.appendChild(day.getElement()));
    }

    addNote(note) {
        const dayToAddNote = this._days
            .filter(it => dateEqualsIgnoreTime(it.date, note.date));

        if (dayToAddNote.length > 0) {
            dayToAddNote[0].addNote(note);
        }
    }
}

class Schedule {

    constructor(containerElement, scheduleDate, hourFrom, hourTo, notes) {
        this._initializeBasicContainers(containerElement);
        this._initializeTimeColumn(hourFrom, hourTo);
        this._initializeDays(scheduleDate, hourFrom, hourTo);

        notes.forEach(it => this._week.addNote(it));
    }

    _initializeBasicContainers(container) {
        const scheduleElement = document.createElement("DIV");
        scheduleElement.classList.add("schedule");

        const timeColumnElement = document.createElement("DIV");
        timeColumnElement.classList.add("time-column");
        const emptyTimeRowElement = document.createElement("DIV");
        emptyTimeRowElement.classList.add("empty-time-row");
        timeColumnElement.appendChild(emptyTimeRowElement);
        scheduleElement.appendChild(timeColumnElement);

        const daysElement = document.createElement("DIV");
        daysElement.classList.add("days");
        scheduleElement.appendChild(daysElement);

        container.appendChild(scheduleElement);
    }

    _initializeDays(scheduleDate, hourFrom, hourTo) {
        this._week = new Week(scheduleDate, hourFrom, hourTo);
    }


    _initializeTimeColumn(hourFrom, hourTo) {
        let timeColumn = document.querySelector(".time-column");

        for (let hour of numberRange(hourFrom, hourTo)) {
            const timeRow = document.createElement("DIV");
            timeRow.innerText = `${hour}:00`;
            timeRow.classList.add("time-row");
            timeColumn.appendChild(timeRow);
        }


    }

    addNote(note) {
        this._week.addNote(note);
    }

}

// DATE UTILS
function getDayNameFromDate(date) {
    return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][date.getDay()];
}

function next7Days(firstDayDate) {
    return numberRange(0, 6)
        .map(it => {
            if (it === 0) {
                return {date: firstDayDate, name: getDayNameFromDate(firstDayDate)};
            } else {
                let nextDate = new Date(firstDayDate);
                let dayIndex = firstDayDate.getDate() + it;
                nextDate.setDate(dayIndex);

                return {date: nextDate, name: getDayNameFromDate(nextDate)};
            }
        });
}

function dateEqualsIgnoreTime(date1, date2) {
    "use strict";
    return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate() &&
        date1.getDay() === date2.getDay();
}

function formatTime(hours, minutes) { // HH:mm
    "use strict";

    return `${hours <= 9 ? `0${hours}` : hours}:${minutes <= 9 ? `0${minutes}` : minutes}`;
}

// NUMBER UTILS
function numberRange(from, to) {
    const biggerRange = [...Array(to + 1).keys()];
    const resultRange = [];

    for (let num of biggerRange) {
        if (num >= from) {
            resultRange.push(num);
        }
    }

    return resultRange;
}



