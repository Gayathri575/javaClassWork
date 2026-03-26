const noteForm = document.getElementById("noteForm");
const messageDiv = document.getElementById("message");

noteForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const noteData = {
        title: document.getElementById("title").value,
        category: document.getElementById("category").value,
        content: document.getElementById("content").value
    };

    try {
        const response = await fetch("/api/notes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(noteData)
        });

        if(response.ok) {
            messageDiv.innerHTML = "<p style='color:green;'>Note added successfully!</p>";
            noteForm.reset();
        } else {
            messageDiv.innerHTML = "<p style='color:red;'>Failed to add note.</p>";
        }
    } catch (err) {
        console.error(err);
        messageDiv.innerHTML = "<p style='color:red;'>Error occurred.</p>";
    }
});