// Function to fetch notes from Spring Boot and display them
async function loadNotes() {
    const container = document.getElementById('articles-placeholder');
    if (!container) return;

    try {
        // 1. Call your Java API
        const response = await fetch('http://localhost:8080/api/notes');

        if (!response.ok) throw new Error("Backend not responding");

        const notes = await response.json();

        // 2. Clear the loading message
        container.innerHTML = '';

        // 3. Loop through notes and build HTML
        notes.forEach(note => {
            const noteCard = `
                <div class="timeline-item">
                    <div class="timeline-content show">
                        <h4>${note.title} <span style="color:var(--primary)">#${note.category}</span></h4>
                        <p>${note.content}</p>
                        <small>Updated: ${new Date(note.updatedAt).toLocaleDateString()}</small>
                    </div>
                </div>
            `;
            container.innerHTML += noteCard;
        });

    } catch (error) {
        console.error("Fetch error:", error);
        container.innerHTML = `<p style="color:red; text-align:center;">
            Connection Error: Check if your Spring Boot app is running on port 8080.
        </p>`;
    }
}

// Start the fetch when the page loads
window.addEventListener('DOMContentLoaded', loadNotes);