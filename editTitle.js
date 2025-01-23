const editTitleButton = document.getElementById("editTitleButton");
const titleTask = document.getElementById("titleTask");

editTitleButton.addEventListener("click", () =>
{
    // Activa la edición del label
    titleTask.contentEditable = true;
    titleTask.textContent = "";//Delete inner text
    titleTask.style.width = "150px";
    titleTask.style.height = "25px";
    titleTask.focus(); // Coloca el cursor en el label

    // Opcional: Desactiva la edición al perder el foco
    titleTask.addEventListener("blur", () =>
    {
        titleTask.contentEditable = false;
    });
});