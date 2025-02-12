const all = document.getElementById("all");
const tasks = document.getElementById("tasks");
const theTask = document.getElementById("theTask");
const listOfTasks = document.querySelector(".listOfTasks");
const myTask = document.querySelector(".myTask");

async function displayAllTasks()
{
    try
    {
        // Clear the task list before displaying new elements
        tasks.innerHTML = "";

        // Open the database (assuming openDB() is already defined)
        const db = await openDB();
        // Create a read-only transaction for the "tasks" object store
        const transaction = db.transaction("tasks", "readonly");
        const store = transaction.objectStore("tasks");

        // Open a cursor to iterate over each object in the store
        const cursorRequest = store.openCursor();

        cursorRequest.onsuccess = (event) =>
        {
            const cursor = event.target.result;
            if (cursor)
            {
                // Assuming the key is the task name
                const taskName = cursor.key;

                // Create the task button
                const taskItem = document.createElement("button");
                // Assign the id (using the key)
                taskItem.id = cursor.key;
                // Assign the text with the task name
                taskItem.innerHTML = taskName;

                // On mouseover, the text changes to "See task"
                taskItem.addEventListener("mouseover", function()
                {
                    this.innerHTML = "See task";
                });
                // On mouseout, the original name is restored
                taskItem.addEventListener("mouseout", function()
                {
                    this.innerHTML = taskName;
                });

                taskItem.addEventListener("click", function()
                {
                    listOfTasks.style.display = "none";
                    myTask.style.display = "flex";

                    // Store the id of the selected task
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

                                // Create elements for the task title and content
                                const title = document.createElement("h2");
                                title.textContent = taskData.name || currentTaskId;
                                const content = document.createElement("p");
                                content.textContent = taskData.content || "No content available.";

                                // Create a container for the buttons
                                const buttonContainer = document.createElement("div");
                                buttonContainer.className = "buttonTheTask";

                                // Button to complete the task (not modified here)
                                const completeButton = document.createElement("button");
                                completeButton.id = "completeTask";
                                completeButton.textContent = "Complete";

                                // Button to delete the task
                                const deleteButton = document.createElement("button");
                                deleteButton.id = "deleteTask";
                                deleteButton.textContent = "Delete";
                                // Assign the task id to the data attribute of the delete button
                                deleteButton.dataset.taskId = currentTaskId;

                                // Add buttons to the container
                                buttonContainer.appendChild(completeButton);
                                buttonContainer.appendChild(deleteButton);

                                // Add title, content, and buttons to the task view
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
                // Add the task button to the list in the DOM
                tasks.appendChild(taskItem);

                // Move to the next record
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
