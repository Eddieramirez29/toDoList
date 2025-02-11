const buttonGoBackList = document.querySelector(".buttonGoBackList");

buttonGoBackList.addEventListener("click", function()
{
    listOfTasks.style.display = "flex";
    myTask.style.display = "none";
});