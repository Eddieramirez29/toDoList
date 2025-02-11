const all = document.getElementById("all");
const tasks = document.getElementById("tasks");
const theTask = document.getElementById("theTask");
const listOfTasks = document.querySelector(".listOfTasks");
const myTask = document.querySelector(".myTask");


async function displayAllTasks()
{
    try {
        // Clear the task list before displaying new elements
        tasks.innerHTML = "";

        // Open the database (assuming openDB() is already defined)
        const db = await openDB();
        // Create a read-only transaction for the "tasks" store
        const transaction = db.transaction("tasks", "readonly");
        const store = transaction.objectStore("tasks");

        // Open a cursor to iterate through each object in the store
        const cursorRequest = store.openCursor();

        cursorRequest.onsuccess = (event) =>
        {
            const cursor = event.target.result;
            if (cursor)
            {
                // Assuming the key is the task name.
                // If the task name is in a property, for example, cursor.value.name,
                // then use: const taskName = cursor.value.name;
                const taskName = cursor.key;

                // Create the <li> element for the task
                const taskItem = document.createElement("button");
                // Assign the element's id (using the key or desired value)
                taskItem.id = cursor.key;
                // Assign the innerHTML with the task name
                taskItem.innerHTML = taskName;

                // When pointer is on button, button text is changed to "See task"
                taskItem.addEventListener("mouseover", function()
                {
                    this.innerHTML = "See task";
                });
                // When pointer is not on button, button text is changed to its "Task nae"
                taskItem.addEventListener("mouseout", function()
                {
                    this.innerHTML = taskName; // Restaurar texto original
                });

                taskItem.addEventListener("click", function()
                {
                    listOfTasks.style.display = "none";
                    myTask.style.display = "flex";

                    openDB().then((db) =>
                    {
                        const transaction = db.transaction("tasks", "readonly");
                        const store = transaction.objectStore("tasks");
                        const request = store.get(this.id);
                        request.onsuccess = (event) =>
                        {
                            const taskData = event.target.result;
                            if (taskData)
                            {
                                theTask.innerHTML = "";//Deletes the last task that was shown before
                                // Properties "name" and "content"
                                const title = document.createElement("h2");
                                title.textContent = taskData.name || this.id;
                                const content = document.createElement("p");
                                content.textContent = taskData.content || "No content available.";
                                theTask.appendChild(title);
                                theTask.appendChild(content);
                            }
                            else
                            {
                                theTask.innerHTML = "<p>Error: Task not found in the database.</p>";
                            }
                        };
                        request.onerror = (event) => {
                            console.error("Error fetching task:", event.target.error);
                        };
                    });
                });
                // Add the element to the list in the DOM
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
// and call the database records to display them on the screen.
all.addEventListener("click", function()
{
    editTaskContainer.style.display = "none";
    listOfTasks.style.display = "flex";
    displayAllTasks();
});
