const editTaskButton = document.getElementById("editTaskButton");


editTaskButton.addEventListener("click", () =>
{
    saveText();
});

async function saveText()
{
    const text = document.getElementById("inputEditTask").value;

    // Crea un manejador de archivos utilizando showSaveFilePicker
    const fileHandle = await window.showSaveFilePicker({
        suggestedName: "archivo.txt", // Nombre sugerido para el archivo
        types: [
            {
                description: "Archivos de texto",
                accept: { "text/plain": [".txt"] }
            }
        ]
    });

    // Abre un stream para escribir en el archivo seleccionado
    const writableStream = await fileHandle.createWritable();

    // Escribe el contenido del textarea en el archivo
    await writableStream.write(text);

    // Cierra el stream para completar la escritura
    await writableStream.close();

}
