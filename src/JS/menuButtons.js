const all = document.getElementById("all");
const completed = document.getElementById("completed");
const today = document.getElementById("today");
const tasks = document.getElementById("tasks");
const theTask = document.getElementById("theTask");
const listOfTasks = document.querySelector(".listOfTasks");
const myTask = document.querySelector(".myTask");

async function displayAllTasks() {
    try {
        // Clear the task list before displaying
        tasks.innerHTML = "";

        // Open the database
        const db = await openDB();
        // Create a read-only transaction for "tasks"
        const transaction = db.transaction("tasks", "readonly");
        const store = transaction.objectStore("tasks");

        // Open a cursor to iterate over each record
        const cursorRequest = store.openCursor();

        cursorRequest.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                // The key of each record is the task name
                const taskName = cursor.key;

                // Create a button for the task
                const taskItem = document.createElement("button");
                taskItem.id = cursor.key;
                taskItem.innerHTML = taskName;

                // Hover effect (mouseover/mouseout) on the button
                taskItem.addEventListener("mouseover", function () {
                    this.innerHTML = "See task";
                });
                taskItem.addEventListener("mouseout", function () {
                    this.innerHTML = taskName;
                });

                // When clicking the task button
                taskItem.addEventListener("click", function () {
                    listOfTasks.style.display = "none";
                    myTask.style.display = "flex";

                    // Get the id of the selected task
                    const currentTaskId = this.id;

                    openDB().then((db) => {
                        const transaction = db.transaction("tasks", "readonly");
                        const store = transaction.objectStore("tasks");
                        const request = store.get(currentTaskId);

                        request.onsuccess = (event) => {
                            const taskData = event.target.result;
                            if (taskData) {
                                theTask.innerHTML = ""; // Clear previous content

                                // Task title and content
                                const title = document.createElement("h2");
                                title.textContent = taskData.name || currentTaskId;
                                const content = document.createElement("p");
                                content.textContent = taskData.content || "No content available.";

                                // Container for the buttons
                                const buttonContainer = document.createElement("div");
                                buttonContainer.className = "buttonTheTask";

                                // Icon for the "Complete" button
                                const checkIcon = document.createElement('i');
                                checkIcon.classList.add('fas', 'fa-check-double');
                                checkIcon.style.color = 'white';

                                // Complete button
                                const completeButton = document.createElement("button");
                                completeButton.id = "completeTask";
                                completeButton.textContent = "Complete";

                                // Hover on the complete button
                                completeButton.addEventListener("mouseover", function () {
                                    this.style.backgroundColor = "green";
                                    this.textContent = "";
                                    this.style.display = "flex";
                                    this.style.justifyContent = "center";
                                    this.style.alignItems = "center";
                                    this.appendChild(checkIcon);
                                    checkIcon.style.display = "flex";
                                });
                                completeButton.addEventListener("mouseout", function () {
                                    this.style.backgroundColor = "rgb(8, 25, 32)";
                                    this.textContent = "Complete";
                                    checkIcon.style.display = "none";
                                });

                                // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                                // When clicking "Complete":
                                completeButton.addEventListener("click", function () {
                                    // 1) Set the global variable to true
                                    complete = true;
                                    console.log("Global variable 'complete' is now:", complete);

                                    // 2) Update the task in the DB to 'complete = true'
                                    openDB().then((db) => {
                                        // Read/Write transaction
                                        const updateTx = db.transaction("tasks", "readwrite");
                                        const updateStore = updateTx.objectStore("tasks");

                                        // Retrieve the same task
                                        const getRequest = updateStore.get(currentTaskId);

                                        getRequest.onsuccess = (e) => {
                                            const updatedTask = e.target.result;
                                            if (updatedTask) {
                                                // Set complete = true in the object
                                                updatedTask.complete = true;

                                                // Save the change
                                                const putRequest = updateStore.put(updatedTask);
                                                putRequest.onsuccess = () => {
                                                    console.log("Task updated to 'complete = true' in the DB.");
                                                };
                                                putRequest.onerror = (err) => {
                                                    console.error("Error updating task:", err.target.error);
                                                };
                                            }
                                        };

                                        getRequest.onerror = (err) => {
                                            console.error("Error retrieving task for update:", err.target.error);
                                        };
                                    });
                                });
                                // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

                                // Delete button
                                const deleteButton = document.createElement("button");
                                deleteButton.id = "deleteTask";
                                deleteButton.textContent = "Delete";
                                // Store the task id in a data attribute
                                deleteButton.dataset.taskId = currentTaskId;

                                // Hover on the delete button
                                deleteButton.addEventListener("mouseover", function () {
                                    this.style.backgroundColor = "red";
                                });
                                deleteButton.addEventListener("mouseout", function () {
                                    this.style.backgroundColor = "rgb(8, 25, 32)";
                                });

                                // Add the buttons to the container
                                buttonContainer.appendChild(completeButton);
                                buttonContainer.appendChild(deleteButton);

                                // Append title, content, and button container to the view
                                theTask.appendChild(title);
                                theTask.appendChild(content);
                                theTask.appendChild(buttonContainer);
                            } else {
                                theTask.innerHTML = "<p>Error: Task not found in the database.</p>";
                            }
                        };

                        request.onerror = (event) => {
                            console.error("Error fetching task:", event.target.error);
                        };
                    });
                });

                // Add the task button to the DOM list
                tasks.appendChild(taskItem);

                // Move to the next record
                cursor.continue();
            } else {
                console.log("No more records.");
            }
        };

        cursorRequest.onerror = (event) => {
            console.error("Error opening cursor:", event.target.error);
        };
    } catch (error) {
        console.error("Error reading objects:", error);
    }
}

// When clicking on "all", hide the edit container, show the task list,
// and display the database records
all.addEventListener("click", function () {
    editTaskContainer.style.display = "none";
    listOfTasks.style.display = "flex";
    displayAllTasks();
});

async function displayCompletedTasks() {
    try {
        // Clear the task list before displaying
        tasks.innerHTML = "";

        // Open the database (assuming you already have the openDB() function)
        const db = await openDB();
        // Create a read-only transaction on the "tasks" store
        const transaction = db.transaction("tasks", "readonly");
        const store = transaction.objectStore("tasks");

        // Open a cursor to iterate over each record in the store
        const cursorRequest = store.openCursor();

        cursorRequest.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                // Get the task data
                const taskData = cursor.value;
                // The key of the task (assuming it's the name)
                const taskName = cursor.key;

                // Display the task only if taskData.complete is true
                if (taskData.complete === true) {
                    // Create the task button
                    const taskItem = document.createElement("button");
                    taskItem.id = taskName;
                    taskItem.innerHTML = taskName;

                    // Hover effect for the button
                    taskItem.addEventListener("mouseover", function () {
                        this.innerHTML = "See task";
                    });
                    taskItem.addEventListener("mouseout", function () {
                        this.innerHTML = taskName;
                    });

                    // When clicking on the task
                    taskItem.addEventListener("click", function () {
                        listOfTasks.style.display = "none";
                        myTask.style.display = "flex";

                        // Store the selected task id
                        const currentTaskId = this.id;

                        openDB().then((db) => {
                            const transaction = db.transaction("tasks", "readonly");
                            const store = transaction.objectStore("tasks");
                            const request = store.get(currentTaskId);

                            request.onsuccess = (event) => {
                                const taskData = event.target.result;
                                if (taskData) {
                                    theTask.innerHTML = ""; // Clear previous content

                                    // Create elements for title and content
                                    const title = document.createElement("h2");
                                    title.textContent = taskData.name || currentTaskId;
                                    console.log(taskData.complete);

                                    const content = document.createElement("p");
                                    content.textContent = taskData.content || "No content available.";

                                    // Container for the buttons
                                    const buttonContainer = document.createElement("div");
                                    buttonContainer.className = "buttonTheTask";

                                    // Icon for the complete button
                                    const checkIcon = document.createElement('i');
                                    checkIcon.classList.add('fas', 'fa-check-double');
                                    checkIcon.style.color = 'white';

                                    // Delete task button
                                    const deleteButton = document.createElement("button");
                                    deleteButton.id = "deleteTask";
                                    deleteButton.textContent = "Delete";
                                    // Assign the task id in a data attribute
                                    deleteButton.dataset.taskId = currentTaskId;

                                    // Hover on the delete button
                                    deleteButton.addEventListener("mouseover", function () {
                                        this.style.backgroundColor = "red";
                                    });
                                    deleteButton.addEventListener("mouseout", function () {
                                        this.style.backgroundColor = "rgb(8, 25, 32)";
                                    });

                                    // Add buttons to the container
                                    buttonContainer.appendChild(deleteButton);

                                    // Append title, content, and button container to the DOM
                                    theTask.appendChild(title);
                                    theTask.appendChild(content);
                                    theTask.appendChild(buttonContainer);
                                } else {
                                    theTask.innerHTML = "<p>Error: Task not found in the database.</p>";
                                }
                            };

                            request.onerror = (event) => {
                                console.error("Error fetching task:", event.target.error);
                            };
                        });
                    });

                    // Add the task button to the DOM list
                    tasks.appendChild(taskItem);
                }

                // Move to the next record
                cursor.continue();
            } else {
                console.log("No more records.");
            }
        };

        cursorRequest.onerror = (event) => {
            console.error("Error opening cursor:", event.target.error);
        };
    } catch (error) {
        console.error("Error reading objects:", error);
    }
}

completed.addEventListener("click", function () {
    editTaskContainer.style.display = "none";
    listOfTasks.style.display = "flex";
    displayCompletedTasks();
});



async function todayTasks() {
    try {
        // Limpiamos la lista de tareas antes de mostrar
        tasks.innerHTML = "";

        // Abrimos la base de datos
        const db = await openDB();
        // Creamos una transacción de solo lectura para "tasks"
        const transaction = db.transaction("tasks", "readonly");
        const store = transaction.objectStore("tasks");

        // Abrimos un cursor para iterar sobre cada registro
        const cursorRequest = store.openCursor();

        // ----------------------------------------
        // Construimos la fecha de hoy con el formato "YYYY/NombreDelMes/Día"
        const now = new Date();
        const yearNow = now.getFullYear();
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const monthNow = monthNames[now.getMonth()];
        const dayNow = now.getDate(); // 1-31
        const todayString = `${yearNow}/${monthNow}/${dayNow}`;
        // ----------------------------------------

        cursorRequest.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                const taskData = cursor.value;
                const taskName = cursor.key;

                // Solo mostramos la tarea si la fecha coincide con hoy
                if (taskData.dueDate === todayString) {
                    // Crear el botón de la tarea
                    const taskItem = document.createElement("button");
                    taskItem.id = taskName;
                    taskItem.innerHTML = taskName;

                    // Efecto hover (mouseover/mouseout)
                    taskItem.addEventListener("mouseover", function () {
                        this.innerHTML = "See task";
                    });
                    taskItem.addEventListener("mouseout", function () {
                        this.innerHTML = taskName;
                    });

                    // Al hacer clic en la tarea
                    taskItem.addEventListener("click", function () {
                        listOfTasks.style.display = "none";
                        myTask.style.display = "flex";

                        // Guardamos el id de la tarea seleccionada
                        const currentTaskId = this.id;

                        openDB().then((db) => {
                            const transaction = db.transaction("tasks", "readonly");
                            const store = transaction.objectStore("tasks");
                            const request = store.get(currentTaskId);

                            request.onsuccess = (event) => {
                                const taskData = event.target.result;
                                if (taskData) {
                                    theTask.innerHTML = ""; // Limpiamos contenido previo

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

                                    // Hover en el botón "Complete"
                                    completeButton.addEventListener("mouseover", function () {
                                        this.style.backgroundColor = "green";
                                        this.textContent = "";
                                        this.style.display = "flex";
                                        this.style.justifyContent = "center";
                                        this.style.alignItems = "center";
                                        this.appendChild(checkIcon);
                                        checkIcon.style.display = "flex";
                                    });
                                    completeButton.addEventListener("mouseout", function () {
                                        this.style.backgroundColor = "rgb(8, 25, 32)";
                                        this.textContent = "Complete";
                                        checkIcon.style.display = "none";
                                    });

                                    // Evento al hacer clic en "Complete"
                                    completeButton.addEventListener("click", function () {
                                        // Variable global complete = true
                                        complete = true;
                                        console.log("Global variable 'complete' is now:", complete);

                                        // Actualizamos la tarea en la BD a 'complete = true'
                                        openDB().then((db) => {
                                            const updateTx = db.transaction("tasks", "readwrite");
                                            const updateStore = updateTx.objectStore("tasks");
                                            const getRequest = updateStore.get(currentTaskId);

                                            getRequest.onsuccess = (e) => {
                                                const updatedTask = e.target.result;
                                                if (updatedTask) {
                                                    updatedTask.complete = true;
                                                    const putRequest = updateStore.put(updatedTask);
                                                    putRequest.onsuccess = () => {
                                                        console.log("Task updated to 'complete = true' in the DB.");
                                                    };
                                                    putRequest.onerror = (err) => {
                                                        console.error("Error updating task:", err.target.error);
                                                    };
                                                }
                                            };
                                            getRequest.onerror = (err) => {
                                                console.error("Error retrieving task for update:", err.target.error);
                                            };
                                        });
                                    });

                                    // Botón "Delete"
                                    const deleteButton = document.createElement("button");
                                    deleteButton.id = "deleteTask";
                                    deleteButton.textContent = "Delete";
                                    deleteButton.dataset.taskId = currentTaskId;

                                    // Hover en el botón "Delete"
                                    deleteButton.addEventListener("mouseover", function () {
                                        this.style.backgroundColor = "red";
                                    });
                                    deleteButton.addEventListener("mouseout", function () {
                                        this.style.backgroundColor = "rgb(8, 25, 32)";
                                    });

                                    // Añadimos los botones al contenedor
                                    buttonContainer.appendChild(completeButton);
                                    buttonContainer.appendChild(deleteButton);

                                    // Añadimos título, contenido y contenedor de botones al DOM
                                    theTask.appendChild(title);
                                    theTask.appendChild(content);
                                    theTask.appendChild(buttonContainer);
                                } else {
                                    theTask.innerHTML = "<p>Error: Task not found in the database.</p>";
                                }
                            };

                            request.onerror = (event) => {
                                console.error("Error fetching task:", event.target.error);
                            };
                        });
                    });

                    // Agregamos el botón de la tarea al DOM
                    tasks.appendChild(taskItem);
                }
                // Continuamos con el siguiente registro
                cursor.continue();
            } else {
                console.log("No more records.");
            }
        };

        cursorRequest.onerror = (event) => {
            console.error("Error opening cursor:", event.target.error);
        };
    } catch (error) {
        console.error("Error reading objects:", error);
    }
}



today.addEventListener("click", function ()
{
    editTaskContainer.style.display = "none";
    listOfTasks.style.display = "flex";
    todayTasks();
});
