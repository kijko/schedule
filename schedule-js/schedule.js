/* global console */

export class Note {
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

        this._normalNotePopupBody = createDIV(["note-card-normal-opened-body"], this._description);
        const popupExit = createDIV(["note-card-normal-opened-exit"]);
        popupExit.onclick = () => {
            this._closeNormalNote();
        }

        this._normalNotePopupBody.appendChild(popupExit)
        hideElement(this._normalNotePopupBody);

        this._normalNote.onclick = () => {
            this._openNormalNote()
        }

        this._normalNoteState = {
            opened: false,
            closedFixedDimensions: {
                top: undefined,
                left: undefined,
                right: undefined,
                bottom: undefined,
                width: undefined,
                height: undefined
            },
            closedDimensions: {
                top: undefined,
                height: undefined
            }
        }
    }

    _openNormalNote() {
        if (this._normalNoteState.opened) {
            return;
        } else {
            this._normalNoteState.opened = true;
        }

        const startTopInPx = this._normalNote.getBoundingClientRect().top;
        const topAnimationDuration = 150;

        const startLeftInPx = this._normalNote.getBoundingClientRect().left;
        const leftAnimationDuration = 100;

        const startWidthInPx = this._normalNote.offsetWidth;
        const widthAnimationDuration = 150;

        const startHeightInPx = this._normalNote.offsetHeight;
        const heightAnimationDuration = 250;

        this._normalNoteState.closedFixedDimensions.top = startTopInPx;
        this._normalNoteState.closedFixedDimensions.left = startLeftInPx;
        this._normalNoteState.closedFixedDimensions.height = startHeightInPx;
        this._normalNoteState.closedFixedDimensions.width = startWidthInPx;

        const endTopInPx = window.outerHeight / 10;
        animate(
            this._normalNote,
            {
                duration: topAnimationDuration,
                cycleTime: 5,
                before: () => {
                    this._normalNote.style.position = "fixed";
                    this._normalNote.style.top = numberToPx(startTopInPx);
                    this._normalNote.style.left = numberToPx(startLeftInPx);
                    this._normalNote.style.width = numberToPx(startWidthInPx);
                    this._normalNote.style.cursor = "initial";
                    this._normalNote.style.height = "";
                    this._normalNote.style.zIndex = "3";
                    this._normalNote.style.borderBottom = "0";
                }
            },
            {
                styleName: "top",
                from: startTopInPx,
                to: endTopInPx
            }
        )

        const endLeftInPx = window.outerWidth / 10;
        animate(
            this._normalNote,
            {
                duration: leftAnimationDuration,
                cycleTime: 5
            },
            {
                styleName: "left",
                from: startLeftInPx,
                to: endLeftInPx
            }
        )

        const endHeightInPx = (window.outerHeight / 10) * 7;
        animate(
            this._normalNote,
            {
                duration: heightAnimationDuration,
                cycleTime: 5,
                after: () => {
                    this._normalNotePopupBody.style.top = numberToPx(endTopInPx);
                    this._normalNotePopupBody.style.right = numberToPx(endLeftInPx);
                    this._normalNotePopupBody.style.left = numberToPx(endLeftInPx + endWidthInPx);
                    this._normalNotePopupBody.style.height = numberToPx(endHeightInPx);

                    showElement(this._normalNotePopupBody);
                }
            },
            {
                styleName: "height",
                from: startHeightInPx,
                to: endHeightInPx
            }
        );

        const endWidthInPx = window.outerWidth / 5;
        animate(
            this._normalNote,
            {
                duration: widthAnimationDuration,
                cycleTime: 5,
            },
            {
                styleName: "width",
                from: startWidthInPx,
                to: endWidthInPx
            }
        )

    }

    _closeNormalNote() {
        if (this._normalNoteState.opened) {
            hideElement(this._normalNotePopupBody);

            const startTop = this._normalNote.getBoundingClientRect().top;
            const endTop = this._normalNoteState.closedFixedDimensions.top;
            animate(this._normalNote, {duration: 100, cycleTime: 5}, {styleName: "top", from: startTop, to: endTop});

            const startLeft = this._normalNote.getBoundingClientRect().left;
            const endLeft = this._normalNoteState.closedFixedDimensions.left;
            animate(this._normalNote, {duration: 150, cycleTime: 5}, {
                styleName: "left",
                from: startLeft,
                to: endLeft
            });

            const startHeight = this._normalNote.getBoundingClientRect().height;
            const endHeight = this._normalNoteState.closedFixedDimensions.height;
            animate(this._normalNote, {duration: 200, cycleTime: 5}, {
                styleName: "height",
                from: startHeight,
                to: endHeight
            });

            const startWidth = this._normalNote.getBoundingClientRect().width;
            const endWidth = this._normalNoteState.closedFixedDimensions.width;
            animate(this._normalNote, {
                duration: 300, cycleTime: 5, after: () => {
                    this._normalNote.style.position = "";
                    this._normalNote.style.zIndex = "";
                    this._normalNote.style.borderBottom = "";
                    this._normalNote.style.width = "";
                    this._normalNote.style.left = "";
                    this._normalNote.style.bottom = "";
                    this._normalNote.style.cursor = "";

                    this._normalNote.style.height = numberToPx(this._normalNoteState.closedDimensions.height);
                    this._normalNote.style.top = numberToPx(this._normalNoteState.closedDimensions.top);

                    this._normalNoteState.opened = false;
                }
            }, {styleName: "width", from: startWidth, to: endWidth});

        }
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
        onEndCSSAnimationDo(this._mobileNote, "slideOutToRight", () => {
            this._mobileNote.classList.remove("note-card-mobile-opened");
            this._mobileNote.classList.add("note-card-mobile");
            this._mobileNote.style.backgroundColor = this._color;

            showElement(this._mobileNoteTime);
            showElement(this._mobileNoteTitle);
            showElement(this._mobileNoteClickSpot);

            hideElement(this._mobilePopupElements);

            this._mobileNote.classList.remove("slide-out-to-right");
        });

        this._mobileNote.classList.add("slide-out-to-right");
    }

    _prepareTimePeriod() {
        const timeFrom = printTime(this.date.getHours(), this.date.getMinutes());

        const dateTo = new Date(this.date.getTime());
        dateTo.setMinutes(this.date.getMinutes() + this.durationInMinutes);
        const timeTo = printTime(dateTo.getHours(), dateTo.getMinutes());

        return `${timeFrom} - ${timeTo}`;
    }

    _initColor() {
        this._normalNote.style.backgroundColor = this._color;
        this._mobileNote.style.backgroundColor = this._color;
    }

    setYPosition(px) {
        this._normalNoteState.closedDimensions.top = px;
        this._normalNote.style.top = `${px}px`;
    }

    setHeight(px) {
        this._normalNoteState.closedDimensions.height = px;
        this._normalNote.style.height = `${px}px`;
    }

    addToElement(element) {
        element.appendChild(this._normalNote);
        element.appendChild(this._normalNotePopupBody);
        element.appendChild(this._mobileNote);
    }

}

class Day {
    constructor(date, name, dayHourFrom, dayHourTo) {
        this.date = date;
        this.dayHourFrom = dayHourFrom;
        this.dayHourTo = dayHourTo;
        this._halfHourCellHeight = 30;

        this._initDay(name);
    }

    _initDay(name) {
        this._element = createDIV(["day"]);

        const dayHeaderContainer = createDIV(["day-header"])
        dayHeaderContainer.appendChild(createSPAN([], name));

        this._element.appendChild(dayHeaderContainer);

        this._initDayColumn();
    }

    _initDayColumn() {
        this._dayNotes = createDIV(["day-notes"]);

        this.dayLengthInHours = this.dayHourTo - this.dayHourFrom + 1;

        numberRange(1, this.dayLengthInHours * 2)
            .forEach(_ => this._dayNotes.appendChild(createDIV(["day-notes-half-hour"])));

        this._element.appendChild(this._dayNotes);
    }

    getElement() {
        return this._element;
    }

    addNote(note) {
        const startScheduleHourInMinutes = this.dayHourFrom * 60;
        const startNoteHourInMinutes = note.date.getHours() * 60 + note.date.getMinutes();

        if (startNoteHourInMinutes >= startScheduleHourInMinutes) {
            const oneMinuteHeightInPx = (this._halfHourCellHeight / 30).toFixed(2);
            const yPosition = oneMinuteHeightInPx * (startNoteHourInMinutes - startScheduleHourInMinutes);

            note.setYPosition(yPosition);

            const endNoteHourInMinutes = startNoteHourInMinutes + note.durationInMinutes;
            const endScheduleHourInMinutes = this.dayHourTo * 60;
            if (endNoteHourInMinutes <= endScheduleHourInMinutes) {
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
    constructor(container, firstDayDate, dayHourFrom, dayHourTo) {
        this._container = container;

        const dates = generate7DaysDatesAhead(firstDayDate);

        this._days = dates.map(dayData => new Day(dayData.date, dayData.name, dayHourFrom, dayHourTo));
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

export class Schedule {

    constructor(containerElement, scheduleDate, hourFrom, hourTo, notes) {
        this._initializeBasicContainers(containerElement);
        this._initializeTimeColumn(hourFrom, hourTo);
        this._initializeDays(scheduleDate, hourFrom, hourTo);

        notes.forEach(it => this._week.addNote(it));
    }

    _initializeBasicContainers(container) {
        this._scheduleElement = createDIV(["schedule"]);

        this._timeColumnElement = createDIV(["time-column"]);
        this._timeColumnElement.appendChild(createDIV(["empty-time-row"]));
        this._scheduleElement.appendChild(this._timeColumnElement);

        this._daysContainer = createDIV(["days"]);
        this._scheduleElement.appendChild(this._daysContainer);

        container.appendChild(this._scheduleElement);
    }

    _initializeTimeColumn(hourFrom, hourTo) {
        for (let hour of numberRange(hourFrom, hourTo)) {
            this._timeColumnElement.appendChild(createDIV(["time-row"], `${hour}:00`));
        }
    }

    _initializeDays(scheduleDate, hourFrom, hourTo) {
        this._week = new Week(this._daysContainer, scheduleDate, hourFrom, hourTo);
    }

    addNote(note) {
        this._week.addNote(note);
    }

}

// DATE UTILS
function getDayNameFromDate(date) {
    return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][date.getDay()];
}

function generate7DaysDatesAhead(firstDayDate) {
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

function printTime(hours, minutes) { // HH:mm
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

function numberToPx(num) {
    return `${num}px`;
}

// DOCUMENT UTILS
function createDIV(classes = [], innerText = "") {
    const htmlElement = document.createElement("DIV");
    classes.forEach(eachClass => htmlElement.classList.add(eachClass));
    htmlElement.innerText = innerText;

    return htmlElement;
}

function createSPAN(classes = [], innerText = "") {
    const htmlElement = document.createElement("SPAN");
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

// ANIMATION UTILS
function onEndCSSAnimationDo(element, animationName, behaviour) {
    "use strict";
    element.addEventListener("animationend", (event) => {
        if (event.animationName === animationName) {
            behaviour();
        }
    })
}

function animate(element, properties, details) {
    if (properties.before) {
        properties.before();
    }

    const applyFunc = (value) => {
        if (details.styleName) {
            element.style[details.styleName] = numberToPx(value);
        } else {
            details.customFun(element, value);
        }
    };

    applyFunc(details.from);

    let start = Date.now();

    const diff = details.to - details.from;
    const diffPerOneFrame = diff / properties.duration;
    const diffPerOneCycle = diffPerOneFrame * properties.cycleTime;

    let nextValue = details.from;
    let timer = setInterval(() => {
        const timePassed = Date.now() - start;

        if (timePassed < properties.duration) {
            nextValue = nextValue + diffPerOneCycle;
            applyFunc(nextValue);
        } else {
            applyFunc(details.to);

            if (properties.after) {
                properties.after();
            }

            clearInterval(timer);
        }

    }, properties.cycleTime)
}

