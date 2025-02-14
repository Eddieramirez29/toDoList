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

async function displayFoundTasks()
{
    try 
    {
        // Clear the search results container
        containerSearchResults.innerHTML = "";

        // Get the search query in lowercase
        const searchQuery = searchInput.value.toLowerCase();

        // Open the database
        const db = await openDB();
        const transaction = db.transaction("tasks", "readonly");
        const store = transaction.objectStore("tasks");

        // Open a cursor to iterate over each task
        const cursorRequest = store.openCursor();

        cursorRequest.onsuccess = (event) => 
        {
            const cursor = event.target.result;
            if (cursor)
            {
                const taskName = cursor.key;
                // Check if the task name includes the search query (case-insensitive)
                if (taskName.toLowerCase().includes(searchQuery))
                {
                    // Create a button for the task
                    const taskItem = document.createElement("button");
                    taskItem.id = taskName;
                    taskItem.innerHTML = taskName;

                    // Hover effects on the button (optional)
                    taskItem.addEventListener("mouseover", () =>
                    {
                        taskItem.innerHTML = "See task";
                    });
                    
                    taskItem.addEventListener("mouseout", () =>
                    {
                        taskItem.innerHTML = taskName;
                    });

                    // When clicking the task button
                    taskItem.addEventListener("click", function () 
                    {
                        editTaskContainer.style.display = "none";
                        listOfTasks.style.display = "none";
                        myTask.style.display = "flex";

                        // Get the id of the selected task
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
                                    completeButton.addEventListener("mouseover", function () 
                                    {
                                        this.style.backgroundColor = "green";
                                        this.textContent = "";
                                        this.style.display = "flex";
                                        this.style.justifyContent = "center";
                                        this.style.alignItems = "center";
                                        this.appendChild(checkIcon);
                                        checkIcon.style.display = "flex";
                                    });
                                    
                                    completeButton.addEventListener("mouseout", function () 
                                    {
                                        this.style.backgroundColor = "rgb(8, 25, 32)";
                                        this.textContent = "Complete";
                                        checkIcon.style.display = "none";
                                    });

                                    // When clicking "Complete":
                                    completeButton.addEventListener("click", function () 
                                    {
                                        // 1) Set the global variable to true
                                        complete = true;
                                        console.log("Global variable 'complete' is now:", complete);

                                        // 2) Update the task in the DB to 'complete = true'
                                        openDB().then((db) => 
                                        {
                                            // Read/Write transaction
                                            const updateTx = db.transaction("tasks", "readwrite");
                                            const updateStore = updateTx.objectStore("tasks");

                                            // Retrieve the same task
                                            const getRequest = updateStore.get(currentTaskId);

                                            getRequest.onsuccess = (e) => 
                                            {
                                                const updatedTask = e.target.result;
                                                if (updatedTask) 
                                                {
                                                    // Set complete = true in the object
                                                    updatedTask.complete = true;

                                                    // Save the change
                                                    const putRequest = updateStore.put(updatedTask);
                                                    putRequest.onsuccess = () => 
                                                    {
                                                        console.log("Task updated to 'complete = true' in the DB.");
                                                        setTimeout(function()
                                                        {
                                                            location.reload();
                                                        }, 1000);
                                                    };
                                                    
                                                    putRequest.onerror = (err) => 
                                                    {
                                                        console.error("Error updating task:", err.target.error);
                                                    };
                                                }
                                            };

                                            getRequest.onerror = (err) => 
                                            {
                                                console.error("Error retrieving task for update:", err.target.error);
                                            };
                                        });
                                    });

                                    // Delete button
                                    const deleteButton = document.createElement("button");
                                    deleteButton.id = "deleteTask";
                                    deleteButton.textContent = "Delete";
                                    deleteButton.dataset.taskId = currentTaskId;

                                    // Hover on the delete button
                                    deleteButton.addEventListener("mouseover", function () 
                                    {
                                        this.style.backgroundColor = "red";
                                    });
                                    
                                    deleteButton.addEventListener("mouseout", function () 
                                    {
                                        this.style.backgroundColor = "rgb(8, 25, 32)";
                                    });

                                    // Add the buttons to the container
                                    buttonContainer.appendChild(completeButton);
                                    buttonContainer.appendChild(deleteButton);

                                    // Append elements to the view
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

                    // Add the button to the search results container
                    containerSearchResults.appendChild(taskItem);
                }
                // Move to the next task
                cursor.continue();
            } 
            else 
            {
                console.log("Search completed: no more tasks to process.");
            }
        };

        cursorRequest.onerror = (event) => 
        {
            console.error("Error opening cursor:", event.target.error);
        };

    } 
    catch (error) 
    {
        console.error("Error displaying found tasks:", error);
    }
}