// Get the DOM element where the total number of tasks will be displayed
const todayAllTasks = document.getElementById("todayAllTasks");

// Function to count the number of objects (tasks) in the IndexedDB 'tasks' table
async function countObjects()
{
    try {
        // Open the database using the openDB() function defined in saveTasks.js
        const db = await openDB();

        // Create a read-only transaction for the 'tasks' object store
        const transaction = db.transaction("tasks", "readonly");

        // Access the 'tasks' object store
        const store = transaction.objectStore("tasks");

        // Create a request to count the number of objects in the 'tasks' store
        const countRequest = store.count();

        // Wrap the count request in a Promise to handle success or error
        const count = await new Promise((resolve, reject) =>
        {
            countRequest.onsuccess = () => resolve(countRequest.result); // Resolve with the count result
            countRequest.onerror = () => reject(countRequest.error); // Reject if there's an error
        });

        // Log the count of objects to the console for debugging
        console.log("Number of objects in the 'tasks' table:", count);

        // Return the count of objects
        return count;
    }
    catch (error)
    {
        // Log any errors that occur during the counting process
        console.error("Error while counting objects:", error);

        // Return 0 if an error occurs
        return 0;
    }
}

// Function to update the DOM with the current count of tasks
async function updateCounter()
{
    // Get the count of tasks by calling the countObjects function
    const count = await countObjects();

    // Update the DOM element with the count of tasks
    todayAllTasks.innerText = count;
}

// Call the updateCounter function to initialize the counter
updateCounter();