const back = document.getElementById("back");
const go = document.getElementById("go");

const currentDate = new Date();
 // Get the current month (Note: Months are zero-indexed, so add 1)
let month = currentDate.getMonth() + 1;
 // Get the current year
let year = currentDate.getFullYear();
let today;


go.addEventListener("click", function()
{
    month = month + 1;
    if(month === 13)
    {
        month = 1;
        year = year + 1;
    }
    getCurrentDate();
    drawNumbersOnCalendar();
})

back.addEventListener("click", function()
{
    month = month - 1;
    if(month === 0)
    {
        month = 12;
        year = year - 1;
    }
    getCurrentDate();
    drawNumbersOnCalendar();
})
// Function to create an object mapping day numbers to their DOM elements (e.g., day1, day2...day35)
const createDayButtonsObject = () =>
{
    const dayButtons = {};
    for (let i = 1; i <= 42; i++)
    {
        // Map each day element to a key (e.g., dayButtons.day1 = document.getElementById("day-1"))
        dayButtons[`day${i}`] = document.getElementById(`day-${i}`);
    }
    return dayButtons;
};
    
    // Function to populate the calendar grid with dates and highlight the current day
    const drawNumbersOnCalendar = () =>
    {
        // Initialize DOM references for calendar buttons
        const dayButtons = createDayButtonsObject();
        // const currentDate = new Date();
        
        // Calculate first and last day of the current month
        const firstDayOfMonth = new Date(year, month - 1, 1);
        const lastDayOfMonth = new Date(year, month - 1 + 1, 0);
        
        // Determine the grid position of the first day (Monday = 1, Sunday = 7)
        let startDay = firstDayOfMonth.getDay() + 1; // +1 shifts getDay() (0=Sunday) to 1=Monday
        let endDay = lastDayOfMonth.getDate();       // Total days in the month
        
    
        let dayCounter = 1; // Tracks the actual day number of the month
    
        // Iterate through all 35 grid cells (5 weeks)
        for (let number = 1; number <= 42; number++)
        {
            // Populate cells only for valid days of the month
            if (number >= startDay && dayCounter <= endDay)
            {
                dayButtons[`day${number}`].textContent = String(dayCounter);
                dayButtons[`day${number}`].style.pointerEvents = 'auto'; // Enable interactions
                dayCounter++;
            }
            // Clear cells outside the current month
            else
            {
                dayButtons[`day${number}`].textContent = "";
                dayButtons[`day${number}`].style.pointerEvents = 'none'; // Disable interactions
            }
        }

        colorNumber(startDay, dayButtons);

    };

const colorNumber = (startDay, dayButtons) =>
{
     // Get the current month (Note: Months are zero-indexed, so add 1)
    const currentMonth = currentDate.getMonth() + 1;
 // Get the current year
    const currentYear = currentDate.getFullYear();

    const currentDayGrid = startDay + currentDate.getDate() - 1; // Grid position of today's date
    // Highlight the current day's cell (executed once after the loop)
    if (dayButtons[`day${currentDayGrid}`] && currentMonth === month && currentYear === year)
    {
        dayButtons[`day${currentDayGrid}`].style.backgroundColor = "#ff8599";
        today = currentDayGrid;
    }
    else
    {
        dayButtons[`day${today}`].style.backgroundColor = "#F0F8FF";
    }
}

// Function to get the current date and display it in the format "Month Year"
const getCurrentDate = () =>
    {
        // Get the HTML element where the date will be displayed
        const date = document.getElementById("date");
        const currentDayOfWeek = document.getElementById("currentDay");
        
        // Create a new Date object representing the current date
        const currentDate = new Date();

        //Get the current day of week(1(Monday)--> 7(Sunday))
        const day = currentDate.getDay();
        const dayName = convertDayNumberToNameDay(day);
        currentDayOfWeek.innerText = dayName;
    

    
        // Convert the month number to its corresponding name
        const monthName = convertMonthNumberToNameMonth(month);
    
        // Display the month and year in the designated HTML element
        date.textContent = String(monthName + " " + year);
    }
    
// Converts a day number (1-7) to its corresponding name (Monday-Sunday)
const convertDayNumberToNameDay = (day) =>
{
    const daysOfWeek =
    [
        "Monday", "Tuesday", "Wednesday",
        "Thursday", "Friday", "Saturday", "Sunday"
    ];
    return (day >= 1 && day <= 7)
        ? daysOfWeek[day - 1]
        : "Invalid day number";
};
    


    // Function to convert a month number to its corresponding month name
const convertMonthNumberToNameMonth = (month) =>
{
    const months =
    [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return months[month - 1] || "Invalid month";
}
    
// Call the function to display the current date
getCurrentDate();
drawNumbersOnCalendar();

document.getElementById("selectDateButton").addEventListener("click", function()
{
    document.getElementById("modal").style.display = "block";
});

document.getElementById("closeModalButton").addEventListener("click", function()
{
    document.getElementById("modal").style.display = "none";
});
