const all = document.getElementById("all");
const listOfTasks = document.querySelector(".listOfTasks");

all.addEventListener("click", function()
{
    editTaskContainer.style.display = "none";
    listOfTasks.style.display = "flex";
})