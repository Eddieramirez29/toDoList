// Calendar navigation elements
const back = document.getElementById("back");
const go = document.getElementById("go");

// Global variables for external use
let saveDay;
let saveMonth;
let saveYear;
let saveDate = false; // Indicates whether a date has been saved

// Variable to store the selected date (if any)
// Structure: { day: number, month: number, year: number }
let selectedDate = null;

// Global variable to store the grid position of the first day of the month
let startDayGlobal;

// System current date and variables for the displayed month and year
const currentDate = new Date();
let month = currentDate.getMonth() + 1; // JavaScript months are 0-11
let year = currentDate.getFullYear();

// Function to create an object mapping each calendar cell (day-1 ... day-42) to its DOM element
const createDayButtonsObject = () => {
  const dayButtons = {};
  for (let i = 1; i <= 42; i++) {
    dayButtons[`day${i}`] = document.getElementById(`day-${i}`);
  }
  return dayButtons;
};

// Function to draw the calendar and apply the appropriate colors
const drawNumbersOnCalendar = () => {
  const dayButtons = createDayButtonsObject();

  // Calculate the first and last day of the month
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const lastDayOfMonth = new Date(year, month, 0);
  // Adjust so that, for example, if getDay() returns 0 (Sunday), it starts at position 1 (or as required)
  let startDay = firstDayOfMonth.getDay() + 1;
  let endDay = lastDayOfMonth.getDate();
  let dayCounter = 1;

  // Loop through the 42 cells of the grid
  for (let number = 1; number <= 42; number++) {
    if (number >= startDay && dayCounter <= endDay) {
      dayButtons[`day${number}`].textContent = String(dayCounter);
      dayButtons[`day${number}`].style.pointerEvents = "auto";
      // Reset the background color to its default value
      dayButtons[`day${number}`].style.backgroundColor = "#F0F8FF";
      dayCounter++;
    } else {
      dayButtons[`day${number}`].textContent = "";
      dayButtons[`day${number}`].style.pointerEvents = "none";
      dayButtons[`day${number}`].style.backgroundColor = "#F0F8FF";
    }
  }
  startDayGlobal = startDay;

  // -------------------------------------------
  // 1. Color the current day (if the displayed month/year match the current date)
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();
  if (month === currentMonth && year === currentYear) {
    // Calculate the grid position of the current day
    const currentDayGrid = startDay + today.getDate() - 1;
    /*  
      If the current day has been selected, it will be shown in yellow;
      otherwise, it is painted in pink (#ff8599)
    */
    if (
      !(
        selectedDate &&
        selectedDate.day === today.getDate() &&
        selectedDate.month === month &&
        selectedDate.year === year
      )
    ) {
      dayButtons[`day${currentDayGrid}`].style.backgroundColor = "#ff8599";
    }
  }

  // -------------------------------------------
  // 2. Color the selected day (if it corresponds to the displayed month and year)
  if (selectedDate && selectedDate.month === month && selectedDate.year === year) {
    const selectedDayGrid = startDay + (selectedDate.day - 1);
    dayButtons[`day${selectedDayGrid}`].style.backgroundColor = "Yellow";
  }
};

// Function to display the current month, year, and day of the week
const getCurrentDate = () => {
  const dateElement = document.getElementById("date");
  const currentDayOfWeek = document.getElementById("currentDay");

  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const dayName = convertDayNumberToNameDay(day);
  currentDayOfWeek.innerText = dayName;

  const monthName = convertMonthNumberToNameMonth(month);
  dateElement.textContent = `${monthName} ${year}`;

  // Update external variables for month and year
  saveMonth = monthName;
  saveYear = year;
};

// Function to convert a day number (0-6) to its corresponding name
const convertDayNumberToNameDay = (day) => {
  // Using JavaScript convention: 0 = Sunday, 6 = Saturday
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return daysOfWeek[day] || "Invalid day";
};

// Function to convert a month number to its corresponding name
const convertMonthNumberToNameMonth = (month) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[month - 1] || "Invalid month";
};

// Function to set up event listeners for each calendar cell (day)
const selectDate = () => {
  const buttons = createDayButtonsObject();
  for (let i = 1; i <= 42; i++) {
    buttons[`day${i}`].addEventListener("click", function () {
      // Only act if the cell has a valid day number
      if (buttons[`day${i}`].textContent !== "") {
        const clickedDay = parseInt(buttons[`day${i}`].textContent);
        // Save the selection along with the currently displayed month and year
        selectedDate = {
          day: clickedDay,
          month: month,
          year: year,
        };

        // Update external variable saveDay (format with leading zero if needed)
        saveDay = clickedDay;
        if (saveDay < 10) {
          saveDay = "0" + saveDay;
        }

        drawNumbersOnCalendar();
      }
    });
  }
};

// Event listeners to change the month
go.addEventListener("click", function () {
  month = month + 1;
  if (month === 13) {
    month = 1;
    year = year + 1;
  }
  // If the saved selection does not correspond to the new month, it will not be displayed
  getCurrentDate();
  drawNumbersOnCalendar();
});

back.addEventListener("click", function () {
  month = month - 1;
  if (month === 0) {
    month = 12;
    year = year - 1;
  }
  getCurrentDate();
  drawNumbersOnCalendar();
});

// Initialize the calendar
getCurrentDate();
drawNumbersOnCalendar();
selectDate();

// Event listeners to show/hide the calendar modal
document.getElementById("selectDateButton").addEventListener("click", function () {
  document.getElementById("modalCalendar").style.display = "block";
});

document.getElementById("closemodalCalendarButton").addEventListener("click", function () {
  document.getElementById("modalCalendar").style.display = "none";
  // Set saveDate to false when closing the modal without saving
  saveDate = false;
});

document.getElementById("saveDatemodalCalendarButton").addEventListener("click", function () {
  document.getElementById("modalCalendar").style.display = "none";
  // Set saveDate to true when saving the selected date
  saveDate = true;
});
