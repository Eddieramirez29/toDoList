const buttonGoBackList = document.querySelector(".buttonGoBackList");

buttonGoBackList.addEventListener("click", function()
{
    editTaskContainer.style.display = "flex";
    listOfTasks.style.display = "none";
});