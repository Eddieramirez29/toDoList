// Independent variables to store selected hour and minutes
let selectedHour = null;
let selectedMinute = null;

// Function to initialize the dropdowns
function initDropdowns()
{
    const hourSelect = document.getElementById('hourSelect');
    const minuteSelect = document.getElementById('minuteSelect');

    // Populate the hour dropdown (0-23)
    for (let i = 0; i < 24; i++) 
    {
        const option = document.createElement('option');
        option.value = i;
        option.text = i.toString().padStart(2, '0');
        hourSelect.appendChild(option);
    }

    // Populate the minute dropdown (0-59)
    for (let i = 0; i < 60; i++) 
    {
        const option = document.createElement('option');
        option.value = i;
        option.text = i.toString().padStart(2, '0');
        minuteSelect.appendChild(option);
    }
}

// Function to update the clock with the current time
function updateClock() 
{
    const clockDiv = document.getElementById('clock');
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    clockDiv.textContent = `${hours}:${minutes}:${seconds}`;
}

// Add listeners to the dropdowns to save selected hour and minutes
function addDropdownListeners()
{
    const hourSelect = document.getElementById('hourSelect');
    const minuteSelect = document.getElementById('minuteSelect');

    hourSelect.addEventListener('change', function() 
    {
        selectedHour = parseInt(this.value, 10);
        console.log("Selected hour:", selectedHour);
    });

    minuteSelect.addEventListener('change', function() 
    {
        selectedMinute = parseInt(this.value, 10);
        console.log("Selected minutes:", selectedMinute);
    });
}

// Initialization
initDropdowns();
addDropdownListeners();
updateClock();
setInterval(updateClock, 1000);

// This code displays and hides the clock after clicking selectTimeButton and closemodalClockButton
document.getElementById("selectTime").addEventListener("click", function()
{
    document.getElementById("modalClock").style.display = "block";
});

document.getElementById("closemodalClockButton").addEventListener("click", function()
{
    document.getElementById("modalClock").style.display = "none";
});
