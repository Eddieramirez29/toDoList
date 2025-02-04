const section2 = document.getElementById("section2");
const saveTaskButton = document.getElementById("saveTaskButton");
const text = document.getElementById("inputEditTask"); // Input for the task content


saveTaskButton.addEventListener("click", () =>
{
    saveText();
    // setTimeout(function()
    // {
    //     location.reload();
    // }, 1000);
    setTimeout(function()
    {
        section2.style.display = "none";
        
    }, 1000);
    setTimeout(function()
    {
        if(text.value != "")
        {
            if (confirm("Please, add description task"))
            {
                setTimeout(function()
                {
                    location.reload();
                }, 1000);
            }
            else
            {
                console.log("El usuario hizo clic en Cancelar");
            }
        }
        else
        {
            message();
        }
    }, 1000);
});

//Function to show message ""<successfully saved

const message = ()=>
{
    const messageAfterSaving = document.createElement("p");

    messageAfterSaving.innerHTML = "Your task was successfully saved!";
    messageAfterSaving.style.fontSize = "40px";
    messageAfterSaving.style.display = "flex";
    messageAfterSaving.style.textAlign = "center";
    messageAfterSaving.style.width = "300px";
    section2.insertAdjacentElement("afterend", messageAfterSaving);
}

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
                // Use the task name as the keyPath
                db.createObjectStore("tasks", { keyPath: "taskName" });
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

    if (!taskName)
    {
        alert("Please enter a task name.");
        return;
    }

    try
    {
        const db = await openDB();
        const transaction = db.transaction("tasks", "readwrite");
        const store = transaction.objectStore("tasks");
        const time = `${selectedHour}:${selectedMinute}`;

        const task =
        {
            taskName: taskName,
            content: text.value,
            dueDate: `${saveYear}/${saveMonth}/${saveDay}`,
            dueTime: time,
            timestamp: new Date()
        };
        
        const request = store.add(task);

        request.onsuccess = () =>
        {
            console.log("Task saved with name:", taskName);
            alert("Task saved successfully.");
        };

        request.onerror = () =>
        {
            console.error("Error saving the task:", request.error);
            alert("There was an error saving the task. The task name might already exist.");
        };
    }
    catch (error)
    {
        console.error("Error:", error);
        alert("There was an error accessing the database.");
    }
}