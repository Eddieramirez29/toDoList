// Global tag to display the number of today's tasks
const todayTasksCount = document.getElementById("todayTasks");

/**
 * Function to count how many tasks are due today in IndexedDB.
 */
async function countTodayTasks() 
{
    try 
    {
        // Get today's date in the correct format (YYYY/Month/Day)
        const today = new Date();
        const year = today.getFullYear();
        const monthName = today.toLocaleString("en-US", { month: "long" }); // Month in English
        const day = today.getDate(); // Day without leading zero

        const todayFormatted = `${year}/${monthName}/${day}`;

        // Open the database
        const db = await openDB();
        const transaction = db.transaction("tasks", "readonly");
        const store = transaction.objectStore("tasks");

        // Use a cursor to iterate over tasks
        const cursorRequest = store.openCursor();
        let todayCount = 0;

        const count = await new Promise((resolve, reject) => 
        {
            cursorRequest.onsuccess = (event) => 
            {
                const cursor = event.target.result;
                if (cursor) 
                {
                    // Check if the task's dueDate matches today
                    if (cursor.value.dueDate === todayFormatted) 
                    {
                        todayCount++;
                    }
                    cursor.continue();
                } 
                else 
                {
                    resolve(todayCount);
                }
            };

            cursorRequest.onerror = (event) => 
            {
                reject(event.target.error);
            };
        });

        console.log(`Today's tasks count (${todayFormatted}):`, count);
        return count;
    } 
    catch (error) 
    {
        console.error("Error counting today's tasks:", error);
        return 0;
    }
}

/**
 * Function to update the DOM with the count of today's tasks.
 */
async function updateTodayCounter() 
{
    try 
    {
        // Get the count of today's tasks
        const count = await countTodayTasks();

        // Ensure the target element exists before updating it
        if (todayTasksCount) 
        {
            todayTasksCount.innerText = count;
        } 
        else 
        {
            console.error("Element 'todayTasks' not found in the DOM.");
        }
    } 
    catch (error) 
    {
        console.error("Error updating today's task counter:", error);
    }
}

// Call the function to initialize the counter on the screen
updateTodayCounter();