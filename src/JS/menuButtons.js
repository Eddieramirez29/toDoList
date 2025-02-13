const all = document.getElementById("all");
const completed = document.getElementById("completed");
const tasks = document.getElementById("tasks");
const theTask = document.getElementById("theTask");
const listOfTasks = document.querySelector(".listOfTasks");
const myTask = document.querySelector(".myTask");

async function displayAllTasks()
{
    try 
    {
        // Limpiar la lista de tareas antes de mostrar
        tasks.innerHTML = "";

        // Abrimos la base de datos
        const db = await openDB();
        // Creamos una transacción de solo lectura para "tasks"
        const transaction = db.transaction("tasks", "readonly");
        const store = transaction.objectStore("tasks");

        // Abrimos un cursor para iterar sobre cada objeto
        const cursorRequest = store.openCursor();

        cursorRequest.onsuccess = (event) => 
        {
            const cursor = event.target.result;
            if (cursor) 
            {
                // La key de cada objeto es el nombre de la tarea
                const taskName = cursor.key;

                // Creamos un botón para la tarea
                const taskItem = document.createElement("button");
                taskItem.id = cursor.key;
                taskItem.innerHTML = taskName;

                // Efecto de hover (mouseover/mouseout) en el botón
                taskItem.addEventListener("mouseover", function() 
                {
                    this.innerHTML = "See task";
                });
                taskItem.addEventListener("mouseout", function() 
                {
                    this.innerHTML = taskName;
                });

                // Al hacer clic en el botón de la tarea
                taskItem.addEventListener("click", function() 
                {
                    listOfTasks.style.display = "none";
                    myTask.style.display = "flex";

                    // Obtenemos el id de la tarea seleccionada
                    const currentTaskId = this.id;

                    openDB().then((db) => 
                    {
                        const transaction = db.transaction("tasks", "readonly");
                        const store = transaction.objectStore("tasks");
                        const request = store.get(currentTaskId);

                        request.onsuccess = (event) => 
                        {
                            const taskData = event.target.result;
                            if (taskData) 
                            {
                                theTask.innerHTML = ""; // Limpiar contenido previo

                                // Título y contenido de la tarea
                                const title = document.createElement("h2");
                                title.textContent = taskData.name || currentTaskId;
                                const content = document.createElement("p");
                                content.textContent = taskData.content || "No content available.";

                                // Contenedor para los botones
                                const buttonContainer = document.createElement("div");
                                buttonContainer.className = "buttonTheTask";

                                // Ícono para el botón "Complete"
                                const checkIcon = document.createElement('i');
                                checkIcon.classList.add('fas', 'fa-check-double');
                                checkIcon.style.color = 'white';

                                // Botón "Complete"
                                const completeButton = document.createElement("button");
                                completeButton.id = "completeTask";
                                completeButton.textContent = "Complete";

                                // Hover en el botón de completar
                                completeButton.addEventListener("mouseover", function() 
                                {
                                    this.style.backgroundColor = "green";
                                    this.textContent = "";
                                    this.style.display = "flex";
                                    this.style.justifyContent = "center";
                                    this.style.alignItems = "center";
                                    this.appendChild(checkIcon);
                                    checkIcon.style.display = "flex";
                                });
                                completeButton.addEventListener("mouseout", function() 
                                {
                                    this.style.backgroundColor = "rgb(8, 25, 32)";
                                    this.textContent = "Complete";
                                    checkIcon.style.display = "none";
                                });

                                // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                                // Al hacer clic en "Complete":
                                completeButton.addEventListener("click", function() 
                                {
                                    // 1) Cambiamos la variable global a true
                                    complete = true;
                                    console.log("Variable global 'complete' ahora es:", complete);

                                    // 2) Actualizamos la tarea en la BD a 'complete = true'
                                    openDB().then((db) => 
                                    {
                                        // Transacción en modo lectura/escritura
                                        const updateTx = db.transaction("tasks", "readwrite");
                                        const updateStore = updateTx.objectStore("tasks");

                                        // Obtenemos la misma tarea
                                        const getRequest = updateStore.get(currentTaskId);

                                        getRequest.onsuccess = (e) => 
                                        {
                                            const updatedTask = e.target.result;
                                            if (updatedTask) 
                                            {
                                                // Asignamos complete = true en el objeto
                                                updatedTask.complete = true;

                                                // Guardamos el cambio
                                                const putRequest = updateStore.put(updatedTask);
                                                putRequest.onsuccess = () => 
                                                {
                                                    console.log("La tarea se actualizó a 'complete = true' en la BD.");
                                                };
                                                putRequest.onerror = (err) => 
                                                {
                                                    console.error("Error al actualizar la tarea:", err.target.error);
                                                };
                                            }
                                        };

                                        getRequest.onerror = (err) => 
                                        {
                                            console.error("Error al obtener la tarea para actualizar:", err.target.error);
                                        };
                                    });
                                });
                                // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

                                // Botón "Delete"
                                const deleteButton = document.createElement("button");
                                deleteButton.id = "deleteTask";
                                deleteButton.textContent = "Delete";
                                // Guardamos el id de la tarea en un data attribute
                                deleteButton.dataset.taskId = currentTaskId;

                                // Hover en el botón de eliminar
                                deleteButton.addEventListener("mouseover", function() 
                                {
                                    this.style.backgroundColor = "red";
                                });
                                deleteButton.addEventListener("mouseout", function() 
                                {
                                    this.style.backgroundColor = "rgb(8, 25, 32)";
                                });

                                // Agregamos los botones al contenedor
                                buttonContainer.appendChild(completeButton);
                                buttonContainer.appendChild(deleteButton);

                                // Agregamos título, contenido y contenedor de botones a la vista
                                theTask.appendChild(title);
                                theTask.appendChild(content);
                                theTask.appendChild(buttonContainer);
                            } 
                            else 
                            {
                                theTask.innerHTML = "<p>Error: Task not found in the database.</p>";
                            }
                        };

                        request.onerror = (event) => 
                        {
                            console.error("Error fetching task:", event.target.error);
                        };
                    });
                });

                // Agregamos el botón de la tarea a la lista en el DOM
                tasks.appendChild(taskItem);

                // Pasamos al siguiente registro
                cursor.continue();
            } 
            else 
            {
                console.log("No more records.");
            }
        };

        cursorRequest.onerror = (event) => 
        {
            console.error("Error opening cursor:", event.target.error);
        };
    } 
    catch (error) 
    {
        console.error("Error reading objects:", error);
    }
}

// When clicking on "all", hide the edit container, show the task list,
// and display the database records
all.addEventListener("click", function()
{
    editTaskContainer.style.display = "none";
    listOfTasks.style.display = "flex";
    displayAllTasks();
});

async function displayCompletedTasks()
{
    try
    {
        // Limpiamos la lista de tareas antes de mostrar
        tasks.innerHTML = "";

        // Abrimos la base de datos (asumiendo que ya tienes la función openDB())
        const db = await openDB();
        // Creamos una transacción de solo lectura en el store "tasks"
        const transaction = db.transaction("tasks", "readonly");
        const store = transaction.objectStore("tasks");

        // Abrimos un cursor para iterar sobre cada objeto en el store
        const cursorRequest = store.openCursor();

        cursorRequest.onsuccess = (event) =>
        {
            const cursor = event.target.result;
            if (cursor)
            {
                // Obtenemos los datos de la tarea
                const taskData = cursor.value;
                // La key de la tarea (asumiendo que es el nombre)
                const taskName = cursor.key;

                // Mostramos la tarea sólo si taskData.complete es true
                if (taskData.complete === true)
                {
                    // Crear el botón de la tarea
                    const taskItem = document.createElement("button");
                    taskItem.id = taskName;
                    taskItem.innerHTML = taskName;

                    // Efecto hover para el botón
                    taskItem.addEventListener("mouseover", function()
                    {
                        this.innerHTML = "See task";
                    });
                    taskItem.addEventListener("mouseout", function()
                    {
                        this.innerHTML = taskName;
                    });

                    // Al hacer click en la tarea
                    taskItem.addEventListener("click", function()
                    {
                        listOfTasks.style.display = "none";
                        myTask.style.display = "flex";

                        // Guardamos el id de la tarea seleccionada
                        const currentTaskId = this.id;

                        openDB().then((db) =>
                        {
                            const transaction = db.transaction("tasks", "readonly");
                            const store = transaction.objectStore("tasks");
                            const request = store.get(currentTaskId);

                            request.onsuccess = (event) =>
                            {
                                const taskData = event.target.result;
                                if (taskData)
                                {
                                    theTask.innerHTML = ""; // Limpiamos contenido previo

                                    // Crear elementos para el título y contenido
                                    const title = document.createElement("h2");
                                    title.textContent = taskData.name || currentTaskId;
                                    console.log(taskData.complete);

                                    const content = document.createElement("p");
                                    content.textContent = taskData.content || "No content available.";

                                    // Contenedor para los botones
                                    const buttonContainer = document.createElement("div");
                                    buttonContainer.className = "buttonTheTask";

                                    // Icono para el botón de completar
                                    const checkIcon = document.createElement('i');
                                    checkIcon.classList.add('fas', 'fa-check-double');
                                    checkIcon.style.color = 'white';

                                    // // Botón para completar la tarea
                                    // const completeButton = document.createElement("button");
                                    // completeButton.id = "completeTask";
                                    // completeButton.textContent = "Complete";

                                    // completeButton.addEventListener("mouseover", function()
                                    // {
                                    //     this.style.backgroundColor = "green";
                                    //     this.textContent = "";
                                    //     this.style.display = "flex";
                                    //     this.style.justifyContent = "center";
                                    //     this.style.alignItems = "center";
                                    //     this.appendChild(checkIcon);
                                    //     checkIcon.style.display = "flex";
                                    // });
                                    // completeButton.addEventListener("mouseout", function()
                                    // {
                                    //     this.style.backgroundColor = "rgb(8, 25, 32)";
                                    //     this.textContent = "Complete";
                                    //     checkIcon.style.display = "none";
                                    // });

                                    // Botón para eliminar la tarea
                                    const deleteButton = document.createElement("button");
                                    deleteButton.id = "deleteTask";
                                    deleteButton.textContent = "Delete";
                                    // Asignamos el id de la tarea en un data attribute
                                    deleteButton.dataset.taskId = currentTaskId;

                                    // Hover en el botón de eliminar
                                    deleteButton.addEventListener("mouseover", function()
                                    {
                                        this.style.backgroundColor = "red";
                                    });
                                    deleteButton.addEventListener("mouseout", function()
                                    {
                                        this.style.backgroundColor = "rgb(8, 25, 32)";
                                    });

                                    // Agregamos botones al contenedor
                                    // buttonContainer.appendChild(completeButton);
                                    buttonContainer.appendChild(deleteButton);

                                    // Agregamos título, contenido y contenedor de botones al DOM
                                    theTask.appendChild(title);
                                    theTask.appendChild(content);
                                    theTask.appendChild(buttonContainer);
                                }
                                else
                                {
                                    theTask.innerHTML = "<p>Error: Task not found in the database.</p>";
                                }
                            };

                            request.onerror = (event) =>
                            {
                                console.error("Error fetching task:", event.target.error);
                            };
                        });
                    });

                    // Agregamos el botón de la tarea a la lista en el DOM
                    tasks.appendChild(taskItem);
                }

                // Avanzamos al siguiente registro
                cursor.continue();
            }
            else
            {
                console.log("No more records.");
            }
        };

        cursorRequest.onerror = (event) =>
        {
            console.error("Error opening cursor:", event.target.error);
        };
    }
    catch (error)
    {
        console.error("Error reading objects:", error);
    }
}


completed.addEventListener("click", function()
{
    editTaskContainer.style.display = "none";
    listOfTasks.style.display = "flex";
    displayCompletedTasks();
});


