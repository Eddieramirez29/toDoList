/*Show editTaskContainer button */
const addNewTask = document.getElementById("addNewTask");
const editTaskContainer = document.querySelector(".editTaskContainer");

/*Show editTaskContainer */

addNewTask.addEventListener("click", function()
{
    editTaskContainer.style.display = "flex";
})