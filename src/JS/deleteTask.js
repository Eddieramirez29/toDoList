document.addEventListener("click", async function (event)
{
    if (event.target && event.target.id === "deleteTask")
    {
        const taskId = event.target.dataset.taskId;
        if (!taskId)
        {
            console.error("Task ID not found for deletion.");
            return;
        }
        try
        {
            const db = await openDB();
            const transaction = db.transaction("tasks", "readwrite");
            const store = transaction.objectStore("tasks");

            const deleteRequest = store.delete(taskId);

            deleteRequest.onsuccess = function ()
            {
                console.log(`Task with ID "${taskId}" successfully deleted.`);
                location.reload();
            };

            deleteRequest.onerror = function (event)
            {
                console.error("Error deleting task:", event.target.error);
            };
        }
        catch (error)
        {
            console.error("Error attempting to delete task:", error);
        }
    }
})