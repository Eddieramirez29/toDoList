const searchButton = document.getElementById("searchButton");
const searchInput = document.getElementById("searchInput");
const containerSearchResults = document.querySelector(".containerSearchResults");
const container = document.querySelector(".container");


searchButton.addEventListener("click", () =>
{
    containerSearchResults.style.display = "flex";
    container.style.display = "none";
    displayFoundTasks();
});

async function displayFoundTasks() {
    try {
        // Limpia el contenedor de resultados de búsqueda
        containerSearchResults.innerHTML = "";

        // Obtiene el término de búsqueda en minúsculas
        const searchQuery = searchInput.value.toLowerCase();

        // Abre la base de datos
        const db = await openDB();
        const transaction = db.transaction("tasks", "readonly");
        const store = transaction.objectStore("tasks");

        // Abre un cursor para iterar sobre cada tarea
        const cursorRequest = store.openCursor();

        cursorRequest.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                const taskName = cursor.key;
                // Comprueba si el nombre de la tarea incluye el término de búsqueda (sin importar mayúsculas/minúsculas)
                if (taskName.toLowerCase().includes(searchQuery)) {
                    // Crea un botón para la tarea
                    const taskItem = document.createElement("button");
                    taskItem.id = taskName;
                    taskItem.innerHTML = taskName;

                    // Efectos de hover sobre el botón (opcional)
                    taskItem.addEventListener("mouseover", () =>
                    {
                        taskItem.innerHTML = "See task";
                    });
                    taskItem.addEventListener("mouseout", () =>
                    {
                        taskItem.innerHTML = taskName;
                    });

                    // Agrega el botón al contenedor de resultados de búsqueda
                    containerSearchResults.appendChild(taskItem);
                }
                // Continúa con la siguiente tarea
                cursor.continue();
            } else {
                console.log("Búsqueda completada: no hay más tareas que procesar.");
            }
        };

        cursorRequest.onerror = (event) => {
            console.error("Error al abrir el cursor:", event.target.error);
        };

    } catch (error) {
        console.error("Error al mostrar las tareas encontradas:", error);
    }
}
