const all = document.getElementById("all");
const tasks = document.getElementById("tasks");
const listOfTasks = document.querySelector(".listOfTasks");

async function displayAllTasks()
{
    try
    {
        // Limpia la lista de tareas antes de mostrar los nuevos elementos
        tasks.innerHTML = "";

        // Abre la base de datos (se asume que openDB() ya está definida)
        const db = await openDB();
        // Crea una transacción de solo lectura para la tienda "tasks"
        const transaction = db.transaction("tasks", "readonly");
        const store = transaction.objectStore("tasks");

        // Abre un cursor para recorrer cada objeto de la tienda
        const cursorRequest = store.openCursor();

    cursorRequest.onsuccess = (event) =>
    {
        const cursor = event.target.result;
        if (cursor)
        {
            // Se asume que la clave es el nombre de la tarea.
            // Si el nombre de la tarea está en una propiedad, por ejemplo, cursor.value.nombre,
            // entonces usa: const taskName = cursor.value.nombre;
            const taskName = cursor.key;

            // Crea el elemento <li> para la tarea
            const taskItem = document.createElement("button");
            // Asigna el id del elemento (usando la clave o el valor deseado)
            taskItem.id = cursor.key;
            // Asigna el innerHTML con el nombre de la tarea
            taskItem.innerHTML = taskName;

            // Agrega el elemento a la lista en el DOM
            tasks.appendChild(taskItem);

            // Pasa al siguiente registro
            cursor.continue();
    }
    else
    {
        console.log("No hay más registros.");
    }
};

    cursorRequest.onerror = (event) =>
    {
        console.error("Error al abrir el cursor:", event.target.error);
    };

}
    catch (error)
    {
        console.error("Error leyendo objetos:", error);
    }
}

// Al hacer click en "all" se oculta el contenedor de edición, se muestra la lista de tareas
// y se llaman a los registros de la base de datos para mostrarlos en pantalla.
all.addEventListener("click", function()
{
    editTaskContainer.style.display = "none";
    listOfTasks.style.display = "flex";
    displayAllTasks();
});
