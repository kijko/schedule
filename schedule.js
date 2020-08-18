/* global console */

class Note {
    constructor(
        date,
        durationInMinutes,
        title,
        description = "",
        color = "#588093",
    ) {
        this.date = date;
        this.durationInMinutes = durationInMinutes;

        this._title = title;
        this._description = description;
        this._color = color;

        this._initNormalNote();
        this._initMobileNote();
        this._initColor();
    }

    _initNormalNote() {
        this._normalNote = createDIV(["note-card-normal"])
        this._normalNote.appendChild(createDIV(["note-time"], this._prepareTimePeriod()));
        this._normalNote.appendChild(createDIV(["note-title"], this._title));
    }

    _initMobileNote() {
        this._mobileNote = createDIV(["note-card-mobile"]);

        this._mobileNoteTime = createDIV(["note-time"], this._prepareTimePeriod());
        this._mobileNote.appendChild(this._mobileNoteTime);

        this._mobileNoteTitle = createDIV(["note-title"], this._title);
        this._mobileNote.appendChild(this._mobileNoteTitle);

        this._initMobileNotePopup()

        this._mobileNoteClickSpot = createDIV(["note-card-mobile-clickspot"]);
        this._mobileNoteClickSpot.onclick = () => {
            this._openMobileNote();
        }
        this._mobileNote.appendChild(this._mobileNoteClickSpot);
    }

    _initMobileNotePopup() {
        this._mobilePopupElements = createDIV([], "");
        hideElement(this._mobilePopupElements);

        const header = createDIV(["note-card-mobile-opened-header"], "");
        header.style.backgroundColor = this._color;

        const headerTitle = createDIV(["note-card-mobile-opened-header-title"], this._title)
        header.appendChild(headerTitle);

        const headerExitButton = createDIV(["note-card-mobile-opened-header-exit"]);
        headerExitButton.onclick = () => {
            this._closeMobileNote();
        }
        header.appendChild(headerExitButton);

        this._mobilePopupElements.appendChild(header);

        const body = createDIV(["note-card-mobile-opened-body"], this._description);
        this._mobilePopupElements.appendChild(body);

        this._mobileNote.appendChild(this._mobilePopupElements);
    }

    _openMobileNote() {
        this._mobileNote.classList.remove("note-card-mobile");
        this._mobileNote.classList.add("note-card-mobile-opened");
        this._mobileNote.style.backgroundColor = "white";

        hideElement(this._mobileNoteTime);
        hideElement(this._mobileNoteTitle);
        hideElement(this._mobileNoteClickSpot);

        showElement(this._mobilePopupElements);
    }

    _closeMobileNote() {
        this._mobileNote.classList.remove("note-card-mobile-opened");
        this._mobileNote.classList.add("note-card-mobile");
        this._mobileNote.style.backgroundColor = this._color;

        showElement(this._mobileNoteTime);
        showElement(this._mobileNoteTitle);
        showElement(this._mobileNoteClickSpot);

        hideElement(this._mobilePopupElements);
    }

    _prepareTimePeriod() {
        const timeFrom = formatTime(this.date.getHours(), this.date.getMinutes());

        const dateTo = new Date(this.date.getTime());
        dateTo.setMinutes(this.date.getMinutes() + this.durationInMinutes);
        const timeTo = formatTime(dateTo.getHours(), dateTo.getMinutes());

        return `${timeFrom} - ${timeTo}`;
    }

    _initColor() {
        this._normalNote.style.backgroundColor = this._color;
        this._mobileNote.style.backgroundColor = this._color;
    }

    setVerticalPositionInPx(px) {
        this._normalNote.style.top = `${px}px`;
    }

    setHeight(px) {
        this._normalNote.style.height = px;
    }

    addToElement(element) {
        element.appendChild(this._normalNote);
        element.appendChild(this._mobileNote);
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


// DOCUMENT UTILS
function createDIV(classes = [], innerText = "") {
    const htmlElement = document.createElement("DIV");
    classes.forEach(eachClass => htmlElement.classList.add(eachClass));
    htmlElement.innerText = innerText;

    return htmlElement;
}

function hideElement(element) {
    "use strict";
    element.style.display = "none";
}

function showElement(element) {
    "use strict";
    element.style.display = "revert";
}
