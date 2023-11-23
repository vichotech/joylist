/* SELECTORS
================================================================*/
//const homeBtn = document.getElementById("home-btn");
//const contactsBtn = document.getElementById("contacts-btn");
//const plusBtnCont = document.getElementById("plus-btn-cont");
//const plusBtn = document.getElementById("plus-btn");

//const events = document.getElementById("events");

const homeSection = document.getElementById("events");
const settingsSection = document.getElementById("settings");

const todayEvents = document.getElementById("today-events");

const dialog = document.getElementById("dialog");
const dateModal = document.getElementById("date-modal");

const formTitle = document.querySelector('.form-title');

const daysWrapper = document.getElementById("days-wrapper");
const monthsWrapper = document.getElementById("months-wrapper");
const yearsWrapper = document.getElementById("years-wrapper");

const birthDateDisplay = document.getElementById("birthdate-display");
const birthDayDisplay = document.querySelector('.birthday-display');
const birthMonthDisplay = document.querySelector('.birthmonth-display');
const birthYearDisplay = document.querySelector('.birthyear-display');

const dateInputArray = Array.from(document.querySelectorAll('[type=datetime]'));
dateInputArray.forEach(input => {
    input.addEventListener("focus", () => {
        input.parentNode.classList.add("active");
    });
    input.addEventListener("blur", () => {
        input.parentNode.classList.remove("active");
    });
})

const nameInput = document.getElementById("name-input");
const dateInput = document.getElementById("date-input");

const createEventBtn = document.getElementById("create-event-btn");
const cancelEventBtn = document.getElementById("cancel-event-btn");
const acceptDateBtn = document.getElementById("accept-date-btn");
const cancelDateBtn = document.getElementById("cancel-date-btn");


/* VARIABLES
================================================================*/
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth(); // Devuelve el antecesor del mes actual. Ej. 2 = marzo
let currentDay = new Date().getDate();

let remainDays = 0;

let age = 0;
let turn;
let nextTurnYear;

var dialogToggled = false;
var isToggled = false;
var isLeap = false;

let birthDay;
let birthMonth;
let birthYear;

let yearScroll = 0;
let yearIndex = 0;
let monthScroll = 0;
let monthIndex = 0;
let dayScroll = 0;
let dayIndex = 0;

/* EVENTS
================================================================*/
// Load data from localStorage if exists on start
window.addEventListener("load", () => {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
        const e = JSON.parse(localStorage.getItem(key));
        const event = createNewEvent(e.name, e.month, e.day, e.year);
        if (e.month == currentMonth) {
            const thisMonthGroup = document.getElementById("this-month-events");
            thisMonthGroup.appendChild(event);
        } else {
            const eventMonthGroup = document.getElementById(`month-${e.month + 1}-events`);
            eventMonthGroup.appendChild(event);
        };
    });
});

// Toggle bottom app bar icons state
document.querySelectorAll("[data-menu]").forEach (item => {
    item.addEventListener ('click', e => {
        let dataCanvas = document.querySelector("[data-menu].active");
        if (dataCanvas) {
            dataCanvas.classList.toggle('active');
        }
        item.classList.toggle('active');
    })
})

cancelDateBtn.addEventListener("click", function(event) {
    event.preventDefault();
    toggleDateModal();
    resetDateModal();
});

acceptDateBtn.addEventListener("click", function(event) {
    event.preventDefault();
    newDate();
    toggleDateModal();
});

cancelEventBtn.addEventListener("click", () => {
    toggleEventDialog();
    resetEventDialog();
});

createEventBtn.addEventListener("click", () => {
    const event = createNewEvent(`${nameInput.value}`, parseInt(birthMonth), birthDay, birthYear);
    if (birthMonth == currentMonth) {
        const thisMonthGroup = document.getElementById("this-month-events");
        thisMonthGroup.appendChild(event);
    } else {
        const eventMonthGroup = document.getElementById(`month-${birthMonth + 1}-events`);
        eventMonthGroup.appendChild(event);
    };
    saveNewEvent(`${nameInput.value}`, parseInt(birthMonth), birthDay, birthYear);
    toggleEventDialog();
    resetEventDialog();
});

/* FUNCTIONS
================================================================*/
function toggleDateModal () {
    if(!isToggled) {
        dateModal.classList.toggle("active");
        updateDay();
        updateMonth();
        updateYear();
        isToggled = true;

        setTimeout(() => {
            isToggled = false;
        }, 200);
    }
}

function resetDateModal() {
    setTimeout(() => {
        daysWrapper.scrollTo({
            top: 0,
            behavior: 'instant'
        });
        monthsWrapper.scrollTo({
            top: 0,
            behavior: 'instant'
        });
        yearsWrapper.scrollTo({
            top: 0,
            behavior: 'instant'
        });
    }, 200);
}

function toggleEventDialog() {
    if(!dialogToggled) {
        resetDateModal();
        dialog.classList.toggle("active");
        dialogToggled = true;

        setTimeout(() => {
            dialogToggled = false;
        }, 200);
    }
}

function resetEventDialog() {
    setTimeout(() => {
        nameInput.value = "";
        dateInput.value = "";
    }, 200);
}

/* YEARS
================================================================*/
const yearsFragment = document.createDocumentFragment();
for(y = currentYear - 130; y <= currentYear; y++) {
    const option = document.createElement('div');
    option.setAttribute("class", "option");
    option.classList.add("year-opt");
    if ((y % 4 == 0) && (y % 100 != 0 || y % 400 == 0)) {
        option.classList.add('leap-year');
    } else {
        option.classList.add('norm-year');
    } 
    option.setAttribute("value", y);
    option.textContent = y;
    yearsFragment.appendChild(option);
};

yearsWrapper.appendChild(yearsFragment);

const normYears = document.getElementsByClassName("norm-year");
const allNormYears = [].slice.call(normYears); // Array de ELEMENTOS <div class="norm-year">

/* MONTHS
================================================================*/
const monthsArray = [
    {
        name: {es: "enero", en: "January", de: "Januar"},
        abr: {es: "ene", en: "Jan", de: "Jan"},
        max_days: 31
    },

    {
        name: {es: "febrero", en: "February", de: "Februar"},
        abr: {es: "feb", en: "Feb", de: "Feb"},
        max_days: 29
    },

    {
        name: {es: "marzo", en: "March", de: "März"},
        abr: {es: "mar", en: "Mar", de: "Mär"},
        max_days: 31
    },

    {
        name: {es: "abril", en: "April", de: "April"},
        abr: {es: "abr", en: "Apr", de: "Apr"},
        max_days: 30
    },

    {
        name: {es: "mayo", en: "May", de: "Mai"},
        abr: {es: "may", en: "May", de: "Mai"},
        max_days: 31
    },

    {
        name: {es: "junio", en: "June", de: "Juni"},
        abr: {es: "jun", en: "Jun", de: "Jun"},
        max_days: 30
    },

    {
        name: {es: "julio", en: "July", de: "Juli"},
        abr: {es: "jul", en: "Jul", de: "Jul"},
        max_days: 31
    },

    {
        name: {es: "agosto", en: "August", de: "August"},
        abr: {es: "ago", en: "Aug", de: "Aug"},
        max_days: 31
    },

    {
        name: {es: "septiembre", en: "September", de: "September"},
        abr: {es: "sep", en: "Sep", de: "Sep"},
        max_days: 30
    },

    {
        name: {es: "octubre", en: "October", de: "Oktober"},
        abr: {es: "oct", en: "Oct", de: "Okt"},
        max_days: 31
    },

    {
        name: {es: "noviembre", en: "November", de: "November"},
        abr: {es: "nov", en: "Nov", de: "Nov"},
        max_days: 30
    },

    {
        name: {es: "diciembre", en: "December", de: "Dezember"},
        abr: {es: "dic", en: "Dec", de: "Dez"},
        max_days: 31
    }
]; // Array de meses (objetos)

const monthsFragment = document.createDocumentFragment();
for (m = 0; m < monthsArray.length; m++) {
    const option = document.createElement('div');
    option.setAttribute("class", "option");
    option.classList.add("month-opt");
    option.classList.add(`${monthsArray[m].max_days}-days`);
    option.setAttribute("value", m);
    option.textContent = `${monthsArray[m].abr.es}.`;
    monthsFragment.appendChild(option);
};

monthsWrapper.appendChild(monthsFragment);

/* DAYS
================================================================*/
const daysFragment = document.createDocumentFragment();
for(d = 1; d <= 31; d++) {
    const option = document.createElement('div');
    option.setAttribute("class", "option");
    option.classList.add("day-opt");
    option.setAttribute("value", d);
    option.textContent = d;
    daysFragment.appendChild(option);
};

daysWrapper.appendChild(daysFragment);

/* DETECT DATE
================================================================*/
const days = document.getElementsByClassName("day-opt");
const months = document.getElementsByClassName("month-opt");
const years = document.getElementsByClassName("year-opt");

// Detect #yearsWrapper scroll
const allYears = [].slice.call(years);
yearsWrapper.addEventListener('scroll', () => {
    yearScroll = yearsWrapper.scrollTop;
    yearIndex = yearScroll / 40;
    if(yearScroll % 40 == 0) {
        updateYear();
    }
});

// Detect #monthsWrapper scroll
const allMonths = [].slice.call(months);
monthsWrapper.addEventListener('scroll', () => {
    monthScroll = monthsWrapper.scrollTop;
    monthIndex = monthScroll / 40;
    if(monthScroll % 40 == 0) {
        updateMonth();
    }
});

// Detect #daysWrapper scroll
const allDays = [].slice.call(days);
daysWrapper.addEventListener('scroll', () => {
    dayScroll = daysWrapper.scrollTop;
    dayIndex = dayScroll / 40;
    if(dayScroll % 40 == 0) {
        updateDay();
    }
});

/* UPDATE DATE
================================================================*/
function updateDay() {
    birthDay = parseInt(allDays[dayIndex].innerHTML);
    birthDayDisplay.innerText = birthDay;
}

function updateMonth() {
    birthMonth = monthIndex;
    birthMonthDisplay.innerText = monthsArray[monthIndex].name.es;
}

function updateYear() {
    birthYear = parseInt(allYears[yearIndex].innerHTML);
    birthYearDisplay.innerText = birthYear;
}

/* DYNAMIC
================================================================*/
// Update birthday in #date-input
function newDate() {
    dateInput.value = `${birthDay}/${parseInt(birthMonth) + 1}/${birthYear}`;
}

/* function setMonths() {
    const twentynine = document.querySelector('.days-29');
    const thirty = document.getElementsByClassName("days-30");
    const thirtyArray = [].slice.call(thirty);
    const allMonths = [].slice.call(months); // Array de ELEMENTOS <option class="month-opt">

    if(birthDay == "31") {
        twentynine.setAttribute("hidden", "");
        thirtyArray.forEach(thirty => {
            thirty.setAttribute("hidden", "");
        });

        if (birthMonth == 1 || birthMonth == 3 || birthMonth == 5 || birthMonth == 8 || birthMonth == 10) {
            monthSelect.value = "0";
        }     
    } else if (birthDay == "30") {
        twentynine.setAttribute("hidden", "");
        thirtyArray.forEach(thirty => {
            thirty.removeAttribute("hidden");
        });

        if (birthMonth == 1) {
            monthSelect.value = "0";
        }
    } else {
        allMonths.forEach(item => {
            item.removeAttribute("hidden");
        });
    }
}

function evalLeap() {
    let y = yearSelect.value
    if ((y % 4 == 0) && (y % 100 != 0 || y % 400 == 0)) {
        isLeap = true;
    }
}

function setYears() {
    if(daySelect.value == "29" && monthSelect.value == "1") {
        if (!isLeap) {
            yearSelect.value = "0";
        }
        allNormYears.forEach(normYear => {
            normYear.setAttribute("hidden", "");
        });
    } else {
        allNormYears.forEach(normYear => {
            normYear.removeAttribute("hidden");
        });
    }
} */

function calcAge(year, month, day) {
    if (year == currentYear) {
        age = 0;
        nextTurnYear = currentYear + 1;
        turn = age + 1;
    } else {
        if (month < currentMonth) {
            age = currentYear - year;
            nextTurnYear = currentYear + 1;
            turn = age + 1;
        } else if (month == currentMonth) {
            if (day < currentDay) {
                age = currentYear - year;
                nextTurnYear = currentYear + 1;
                turn = age + 1;
            } else if (day == currentDay) {
                age = currentYear - year;
                nextTurnYear = currentYear;
                turn = age;
            } else {
                age = currentYear - year - 1;
                nextTurnYear = currentYear;
                turn = age + 1;
            }
        } else {
            age = currentYear - year - 1;
            nextTurnYear = currentYear;
            turn = age + 1;
        }
    }
}

function createNewEvent(name, month, day, year) {
    calcAge(year, month, day);

    const event = document.createElement('div');
    event.setAttribute("class", "card");
    event.classList.add('event');
    event.classList.add('flex');

    const avatar = document.createElement('div');
    const firstLetter = name.slice(0, 1);
    avatar.setAttribute("class", "avatar");
    avatar.textContent = firstLetter;

    const event_info = document.createElement('div');
    event_info.setAttribute("class", "event-info");
    event_info.classList.add('flex');

    const event_detail = document.createElement('div');
    event_detail.setAttribute("class", "event-details");
    event_detail.classList.add('flex');

    const event_name = document.createElement('h4');
    event_name.setAttribute("class", "event-name");
    event_name.textContent = name;

    const event_date = document.createElement('p');
    event_date.setAttribute("class", "event-date");
    event_date.innerHTML = `<span class="event-day">${day}</span>/<span class="event-month">${parseInt(month) + 1}</span>/<span class="event-year">${nextTurnYear}</span>`;

    const event_desc = document.createElement('p');
    event_desc.setAttribute("class", "event-desc");
    event_desc.innerHTML = `<span class="turn">${turn}</span> <span class="unit">años</span>`;

    event_detail.appendChild(event_name);
    event_detail.appendChild(event_date);
    event_info.appendChild(event_detail);
    event_info.appendChild(event_desc);
    event.appendChild(avatar);
    event.appendChild(event_info);

    return event;
};

function saveNewEvent(name, month, day, year) {
    let newEvent = { name: name, month: month, day: day, year: year }
    if (localStorage.length === 0) {
        let eventCounter = 1;
        localStorage.setItem(`event_${eventCounter}`, JSON.stringify(newEvent));
    } else {
        eventCounter = localStorage.length + 1;
        localStorage.setItem(`event_${eventCounter}`, JSON.stringify(newEvent));
    };
};

function createEmptyState(eventsCont, month) {
    if(eventsCont.innerHTML.trim() === '') {
        const emptyState = document.createElement('div');
        emptyState.classList.add("card");
        emptyState.classList.add("empty-state");
        emptyState.classList.add("flex");
        emptyState.textContent = `No hay cumples en ${month} :(`;
        eventsCont.appendChild(emptyState);
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((m) => {
            if(m.addedNodes.length > 0) {
                const emptyState = eventsCont.querySelector(".empty-state");
                if(emptyState) {
                    emptyState.remove();
                }
            }
        });
    });
    observer.observe(eventsCont, {childList: true});
}

// Display events groups (by months)
// Remainig events this year
for(m = currentMonth + 1; m < monthsArray.length; m++) {
    const eventsGroup = document.createElement('section');
    eventsGroup.classList.add("events-group");
    /* eventsGroup.classList.add("flex");
    eventsGroup.classList.add("f-d_col");
    eventsGroup.classList.add("g_1"); */
        
    const eventsGroupHeader = document.createElement('h3');
    eventsGroupHeader.setAttribute("class", "sentence-case");
    eventsGroupHeader.textContent = monthsArray[m].name.es;

    const eventsCont = document.createElement('div');
    eventsCont.setAttribute("class", "events-cont");
    eventsCont.setAttribute("id", `month-${m + 1}-events`);

    createEmptyState(eventsCont, monthsArray[m].name.es);

    homeSection.appendChild(eventsGroup);
    eventsGroup.appendChild(eventsGroupHeader);
    eventsGroup.appendChild(eventsCont);
}

// Upcoming events next year
for(m = 0; m < currentMonth; m++) {
    const eventsGroup = document.createElement('section');
    eventsGroup.classList.add("events-group");
    /* eventsGroup.classList.add("flex");
    eventsGroup.classList.add("f-d_col");
    eventsGroup.classList.add("g_1"); */
        
    const eventsGroupHeader = document.createElement('h3');
    eventsGroupHeader.setAttribute("class", "sentence-case");
    eventsGroupHeader.textContent = `${monthsArray[m].name.es} de ${currentYear + 1}`;

    const eventsCont = document.createElement('div');
    eventsCont.setAttribute("class", "events-cont");
    eventsCont.setAttribute("id", `month-${m + 1}-events`);

    createEmptyState(eventsCont, `${monthsArray[m].name.es} de ${currentYear + 1}`);

    homeSection.appendChild(eventsGroup);
    eventsGroup.appendChild(eventsGroupHeader);
    eventsGroup.appendChild(eventsCont);
}