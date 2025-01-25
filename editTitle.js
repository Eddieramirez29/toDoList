const editTitleButton = document.getElementById("editTitleButton");
const titleTask = document.getElementById("titleTask");
let taskName = "";
let save = false;

// First event: Save the content when save === true
editTitleButton.addEventListener("click", function ()
{
    if (save === true)
    {
        titleTask.textContent = titleTask.textContent; // Update the content
        taskName = titleTask.textContent; // Update global variable taskName
        alert("Title saved: " + titleTask.textContent);
        editTitleButton.textContent = "Edit"; // Change the button text
        titleTask.contentEditable = false; // Disable editing
        titleTask.style.width = ""; // Restore the width
        titleTask.style.height = ""; // Restore the height
        save = false;
    }
});

// Second event: Enable editing when save === false
editTitleButton.addEventListener("click", function ()
{
    if (save === false)
    {
        save = true;
        // Enable editing for the label
        titleTask.contentEditable = true;
        titleTask.textContent = titleTask.textContent; // Keep the current text
        editTitleButton.textContent = "Save"; // Change the button text
        titleTask.style.width = "150px"; // Adjust the width
        titleTask.style.height = "25px"; // Adjust the height
        titleTask.focus(); // Place the cursor in the label
    }
});

// Optional: Disable editing when losing focus
titleTask.addEventListener("blur", () =>
{
    titleTask.contentEditable = false;
});