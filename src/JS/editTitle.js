const titleTask = document.getElementById("titleTask");
let taskName = "";
let saveTitle = false;
let saveTitleFlag = false;

// First event: Save the content when saveTitle === true
editTitleButton.addEventListener("click", function ()
{
    if (saveTitle === true)
    {
        titleTask.textContent = titleTask.textContent; // Update the content
        taskName = titleTask.textContent; // Update global variable taskName
        // alert("Title saved: " + titleTask.textContent);
        titleTask.contentEditable = false; // Disable editing
        titleTask.style.width = ""; // Restore the width
        titleTask.style.height = ""; // Restore the height
        saveTitleFlag = true;
        editTitleButton.textContent = "Saved!"; // Change the button text
        alert("Title of the tas has been saved!!!");
    }
});

editTitleButton.addEventListener("click", function ()
{
    if (saveTitle === false)
    {
        // Enable editing for the label
        titleTask.contentEditable = true;
        titleTask.textContent = titleTask.textContent; // Keep the current text
        editTitleButton.textContent = "Save"; // Change the button text
        titleTask.style.width = "150px"; // Adjust the width
        titleTask.style.height = "25px"; // Adjust the height
        titleTask.focus(); // Place the cursor in the label
        saveTitle = true;
    }
});

// Optional: Disable editing when losing focus
titleTask.addEventListener("blur", () =>
{
    titleTask.contentEditable = false;
});