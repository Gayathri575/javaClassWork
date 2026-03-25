const sidebarList = document.getElementById("sidebar-list");
const pageContent = document.getElementById("page-content");
const pageNumber = document.getElementById("page-number");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const sidebarToggle = document.getElementById("sidebar-toggle");
const sidebar = document.getElementById("sidebar");

let pages = [];
let currentPage = 0;

// Section map defines the sidebar structure
const sectionMap = {
    "1. Basics": ["What is MySQL & RDBMS", "Database vs Table", "Rows & Columns", "Primary Key, Foreign Key", "Data Types"],
    "2. Table Operations": ["CREATE DATABASE", "DROP DATABASE", "CREATE TABLE", "ALTER TABLE", "TRUNCATE TABLE"],
    "3. CRUD": ["INSERT", "SELECT", "UPDATE", "DELETE"],
    "4. Filtering": ["WHERE clause", "AND, OR, NOT", "BETWEEN", "IN / NOT IN", "LIKE"],
    "5. Sorting & Limiting": ["ORDER BY", "LIMIT"],
    "6. Functions": ["Aggregate Functions", "String Functions", "Date Functions"],
    "7. Grouping": ["GROUP BY", "HAVING"],
    "8. Joins": ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN"],
    "9. Constraints": ["PRIMARY KEY", "FOREIGN KEY", "UNIQUE", "NOT NULL", "DEFAULT"],
    "10. Indexes": ["What is Index", "CREATE INDEX"],
    "11. Subqueries": ["Nested SELECT", "IN with subqueries"],
    "12. Views": ["CREATE VIEW", "DROP VIEW"],
    "13. Transactions": ["COMMIT", "ROLLBACK", "ACID properties"],
    "14. Performance": ["Index usage", "Query optimization"]
};

// Fetch notes dynamically from backend
async function fetchNotes() {
    pageContent.innerHTML = `<div class="loader">Loading MySQL Modules...</div>`;

    try {
        const response = await fetch(`http://localhost:8080/api/notes?topic=MySQL`);
        if (!response.ok) throw new Error("Failed to fetch");

        const allData = await response.json();

        // Filter only MySQL notes for pagination
        pages = allData.filter(note => note.category.toLowerCase() === "mysql");

        if (pages.length > 0) {
            currentPage = 0; // start from first MySQL note
            renderSidebar();
            renderPage();
        } else {
            pageContent.innerHTML = `<h3>No MySQL content found.</h3>`;
        }
    } catch (err) {
        console.error(err);
        pageContent.innerHTML = `<p style="color:red;">Error connecting to server. Check if backend is live.</p>`;
    }
}
// Build sidebar dynamically
// Build sidebar dynamically
function renderSidebar() {
    // 1. Clear the sidebar first to avoid duplicates
    sidebarList.innerHTML = "";

    Object.entries(sectionMap).forEach(([sectionName, titles]) => {
        // 2. Filter pages for this specific section
        const sectionNotes = pages
            .map((note, index) => ({ ...note, originalIndex: index }))
            .filter(note => {
                return titles.some(t => note.title.toLowerCase().includes(t.toLowerCase()));
            });

        if (sectionNotes.length === 0) return;

        // Check if the currently viewed page is in this section
        const isCurrentInSection = sectionNotes.some(n => n.originalIndex === currentPage);

        // 3. Create Section Container (To keep header and list together)
        const sectionContainer = document.createElement("div");
        sectionContainer.className = "sidebar-section-container";

        const sectionHeader = document.createElement("li");
        sectionHeader.className = "sidebar-section-header";
        sectionHeader.innerHTML = `<span>${sectionName}</span><span>${isCurrentInSection ? "▾" : "▸"}</span>`;

        const subList = document.createElement("ul");
        subList.className = "sidebar-sublist";
        subList.style.display = isCurrentInSection ? "block" : "none";

        sectionNotes.forEach(note => {
            const li = document.createElement("li");
            li.textContent = note.title;
            // Use originalIndex to match the actual page
            li.className = `sidebar-subitem ${note.originalIndex === currentPage ? "active" : ""}`;

            li.onclick = (e) => {
                e.stopPropagation(); // Prevents section toggle when clicking a topic
                currentPage = note.originalIndex;
                renderPage();
                renderSidebar();
            };
            subList.appendChild(li);
        });

        // Toggle logic
        sectionHeader.onclick = () => {
            const isHidden = subList.style.display === "none";
            subList.style.display = isHidden ? "block" : "none";
            sectionHeader.querySelector("span:last-child").textContent = isHidden ? "▾" : "▸";
        };

        sectionContainer.appendChild(sectionHeader);
        sectionContainer.appendChild(subList);
        sidebarList.appendChild(sectionContainer);
    });
}

// Render current page content
function renderPage() {
    if (pages.length === 0) return;
    const note = pages[currentPage];

    pageContent.innerHTML = `
        <div class="note-card">
            <div class="badge">MySQL Tutorial</div>
            <h2>${note.title}</h2>
            <div class="note-body">${note.content || "Content is being updated..."}</div>
        </div>
    `;
    pageNumber.textContent = `${currentPage + 1} / ${pages.length}`;
    window.scrollTo(0, 0);
}

// Pagination buttons
prevBtn.onclick = () => { if (currentPage > 0) { currentPage--; renderPage(); renderSidebar(); } };
nextBtn.onclick = () => { if (currentPage < pages.length - 1) { currentPage++; renderPage(); renderSidebar(); } };

// Sidebar toggle for small screens
sidebarToggle.onclick = () => {
    sidebar.classList.toggle("active");
};

// Load notes on page load
window.onload = fetchNotes;