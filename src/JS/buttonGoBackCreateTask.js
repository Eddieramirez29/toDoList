const buttonGoBackCreateTask = document.querySelector(".buttonGoBackCreateTask");

buttonGoBackCreateTask.addEventListener("click", function()
{
    editTaskContainer.style.display = "flex";
    listOfTasks.style.display = "none";
});