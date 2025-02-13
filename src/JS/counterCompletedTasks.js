// Etiqueta global para mostrar el número de tareas completadas
const completedTasks = document.getElementById("completedTasks");

/**
 * Función para contar cuántas tareas tienen `complete = true` en la IndexedDB.
 */
async function countCompletedObjects() {
    try {
        // Abrir la base de datos
        const db = await openDB();
        // Crear una transacción de solo lectura
        const transaction = db.transaction("tasks", "readonly");
        const store = transaction.objectStore("tasks");

        // No podemos usar store.count() directamente para filtrar solo las completadas,
        // así que usamos un cursor para revisar cada tarea.
        const cursorRequest = store.openCursor();
        let completedCount = 0;

        // Envolvemos la solicitud del cursor en una Promise
        const count = await new Promise((resolve, reject) => {
            cursorRequest.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    // Si la tarea tiene `complete = true`, incrementamos el contador
                    if (cursor.value.complete === true) {
                        completedCount++;
                    }
                    cursor.continue();
                } else {
                    // No hay más registros
                    resolve(completedCount);
                }
            };

            cursorRequest.onerror = (event) => {
                reject(event.target.error);
            };
        });

        console.log("Número de tareas completadas en 'tasks':", count);
        return count;
    } catch (error) {
        console.error("Error al contar las tareas completadas:", error);
        return 0;
    }
}

/**
 * Función para actualizar el DOM con el conteo de tareas que tienen `complete = true`.
 * (Renombrada de 'updateCounter' a 'updateCompletedCounter')
 */
async function updateCompletedCounter() {
    // Obtenemos el número de tareas completadas
    const count = await countCompletedObjects();

    // Actualizamos el elemento del DOM con dicho conteo
    completedTasks.innerText = count;
}

// Llamamos a la función para inicializar el contador en pantalla
updateCompletedCounter();
