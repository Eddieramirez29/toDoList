// Global tag to display the number of completed tasks
const completedTasks = document.getElementById("completedTasks");

/**
 * Function to count how many tasks have `complete = true` in IndexedDB.
 */
async function countCompletedObjects()
{
    try
    {
        // Open the database
        const db = await openDB();
        // Create a read-only transaction
        const transaction = db.transaction("tasks", "readonly");
        const store = transaction.objectStore("tasks");

        // We cannot use store.count() directly to filter only completed tasks,
        // so we use a cursor to check each task.
        const cursorRequest = store.openCursor();
        let completedCount = 0;

        // Wrap the cursor request in a Promise
        const count = await new Promise((resolve, reject) =>
        {
            cursorRequest.onsuccess = (event) =>
            {
                const cursor = event.target.result;
                if (cursor)
                {
                    // If the task has `complete = true`, increment the counter
                    if (cursor.value.complete === true)
                    {
                        completedCount++;
                    }
                    cursor.continue();
                }
                else
                {
                    // No more records
                    resolve(completedCount);
                }
            };

            cursorRequest.onerror = (event) =>
            {
                reject(event.target.error);
            };
        });

        console.log("Number of completed tasks in 'tasks':", count);
        return count;
    }
    catch (error)
    {
        console.error("Error counting completed tasks:", error);
        return 0;
    }
}

/**
 * Function to update the DOM with the count of tasks that have `complete = true`.
 * (Renamed from 'updateCounter' to 'updateCompletedCounter')
 */
async function updateCompletedCounter()
{
    // Get the number of completed tasks
    const count = await countCompletedObjects();

    // Update the DOM element with the count
    completedTasks.innerText = count;
}

// Call the function to initialize the counter on the screen
updateCompletedCounter();