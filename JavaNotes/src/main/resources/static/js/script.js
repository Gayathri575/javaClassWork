//script.js
async function loadNotes() {
    const container = document.getElementById('articles-placeholder');

    // If not articles page → do nothing
    if (!container) return;

    try {
// CORRECT ✅
const response = await fetch('/api/notes');
        if (!response.ok) throw new Error("Backend not responding");

        const notes = await response.json();

        // Clear loading
        container.innerHTML = '';

        // If no data
        if (notes.length === 0) {
            container.innerHTML = "<p style='text-align:center;'>No articles available</p>";
            return;
        }

        // Loop and render
        notes.forEach(note => {
            const noteCard = `
                <div class="timeline-item">
                    <div class="timeline-content show">
                        <h4>
                            ${note.title}
                            <span style="color:var(--primary)">#${note.category}</span>
                        </h4>
                        <p>${note.content}</p>
                        <small>Updated: ${formatDate(note.updatedAt)}</small>
                    </div>
                </div>
            `;
            container.innerHTML += noteCard;
        });

    } catch (error) {
        console.error("Fetch error:", error);
        container.innerHTML = `
            <p style="color:red; text-align:center;">
                ⚠️ Connection Error: Check if Spring Boot is running (port 8080)
            </p>
        `;
    }
}
// ===== Scroll Animation for Timeline =====
window.addEventListener("DOMContentLoaded", () => {
    const timelineItems = document.querySelectorAll(".timeline-content");

    if (timelineItems.length === 0) return; // not on this page

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target); // animate once
            }
        });
    }, { threshold: 0.2 });

    timelineItems.forEach(item => observer.observe(item));
});