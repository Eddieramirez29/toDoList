const editTaskButton = document.getElementById("editTaskButton");

editTaskButton.addEventListener("click", () =>
{
    saveText();
});

// Open or create the IndexedDB (noSQL) database
function openDB()
{
    return new Promise((resolve, reject) =>
    {
        // Creates a DB called "TaskDB"
        const request = indexedDB.open("TasksDB", 1);

        request.onupgradeneeded = (event) =>
        {
            const db = event.target.result;
            // Create a "table"
            if (!db.objectStoreNames.contains("tasks"))
            {
                // keyPath
                db.createObjectStore("tasks", { keyPath: "id", autoIncrement: true });
            }
        };

        request.onsuccess = (event) =>
        {
            resolve(event.target.result);
        };

        request.onerror = (event) =>
        {
            reject("Error opening the database: " + event.target.errorCode);
        };
    });
}

// Save the text in IndexedDB
async function saveText()
{
    const text = document.getElementById("inputEditTask").value;

    try {
        const db = await openDB();
        const transaction = db.transaction("tasks", "readwrite");
        const store = transaction.objectStore("tasks");

        // Save the text as a new record
        const task = { content: text, timestamp: new Date() };
        const request = store.add(task);

        request.onsuccess = () =>
        {
            console.log("Task saved with ID:", request.result);
            alert("Task saved successfully.");
        };

        request.onerror = () =>
        {
            console.error("Error saving the task:", request.error);
            alert("There was an error saving the task.");
        };
    } 
    catch (error)
    {
        console.error("Error:", error);
        alert("There was an error accessing the database.");
    }
}