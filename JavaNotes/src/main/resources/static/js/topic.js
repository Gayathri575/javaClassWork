const toggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

toggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    toggle.textContent = navLinks.classList.contains("active") ? "✖" : "☰";
});
const sidebar = document.querySelector(".sidebar");
const pageContent = document.getElementById("page-content");
const pageNumber = document.getElementById("page-number");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let pages = [];
let currentPage = 0;
const category = "Core Java";

// 1. Fetch notes from backend
async function fetchNotes() {
    try {
        // Backend port 8080 nu confirm panniko
        const response = await fetch(`http://localhost:8080/api/notes/category?category=${encodeURIComponent(category)}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API DATA RECEIVED:", data); // Browser Console-la check pannunga data varudha nu

        if (data && data.length > 0) {
            pages = data;
            renderSidebar();
            renderPage();
        } else {
            pageContent.innerHTML = `<h3>No content found for "${category}"</h3><p>Check if the category name matches exactly in Database.</p>`;
        }
    } catch (err) {
        pageContent.innerHTML = "<p style='color:red;'>Error loading content. Make sure Backend is running and CORS is enabled.</p>";
        console.error("Fetch Error:", err);
    }
}

// 2. Render Sidebar dynamically based on DB titles
function renderSidebar() {
    sidebar.innerHTML = ""; // Clear static HTML
    pages.forEach((note, idx) => {
        const li = document.createElement("li");
        li.textContent = note.title; // DB field name 'title' ah nu check panniko
        li.classList.toggle("active", idx === currentPage);

        li.addEventListener("click", () => {
            currentPage = idx;
            renderPage();
            renderSidebar(); // Refresh active class
        });
        sidebar.appendChild(li);
    });
}

// 3. Render Page Content
function renderPage() {
    if (!pages || pages.length === 0) {
        pageContent.innerHTML = "<p>No content available.</p>";
        pageNumber.textContent = "0 / 0";
        return;
    }

    const currentNote = pages[currentPage];

    // Check if content exists
    if (currentNote && currentNote.content) {
        pageContent.innerHTML = currentNote.content;
        pageNumber.textContent = `${currentPage + 1} / ${pages.length}`;
    } else {
        pageContent.innerHTML = "<h3>" + (currentNote.title || "Untitled") + "</h3><p>Content is empty for this topic in DB.</p>";
    }

    // Scroll back to top when page changes
    window.scrollTo(0, 0);
}

// 4. Pagination Listeners
prevBtn.addEventListener("click", () => {
    if (currentPage > 0) {
        currentPage--;
        renderPage();
        renderSidebar();
    }
});

nextBtn.addEventListener("click", () => {
    if (currentPage < pages.length - 1) {
        currentPage++;
        renderPage();
        renderSidebar();
    }
});

// 5. Sidebar Toggle (Mobile Fix)
// Navbar-la iruka hamburger button use panrom
const menuToggle = document.getElementById("menu-toggle-navbar");
if (menuToggle) {
    menuToggle.addEventListener("click", () => {
        sidebar.classList.toggle("active");
    });
}
const pageContent = document.getElementById("page-content");
const sidebarItems = document.querySelectorAll(".sidebar li");

// Function to get data ONLY from the Database
async function loadDataFromDB(category) {
    // Show a loading state so the user knows the DB is working
    pageContent.innerHTML = `<div class="loader">Fetching ${category} from Database...</div>`;

    try {
        // This calls your @GetMapping("/category") in NotesController
        const response = await fetch(`http://localhost:8080/api/notes/category?category=${encodeURIComponent(category)}`);

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const notes = await response.json();

        if (notes.length === 0) {
            pageContent.innerHTML = `<h3>${category}</h3><p>No data found in MySQL for this topic.</p>`;
            return;
        }

        // Displaying the Database results
        pageContent.innerHTML = notes.map(note => `
            <div class="note-card">
                <h2>${note.title}</h2>
                <div class="note-body">${note.content}</div>
                <hr>
                <small>Category: ${note.category} | ID: ${note.id}</small>
            </div>
        `).join("");

    } catch (error) {
        console.error("Database Fetch Error:", error);
        pageContent.innerHTML = `
            <div class="error-msg">
                <p><strong>Connection Failed!</strong></p>
                <p>Make sure Spring Boot is running and @CrossOrigin is added to your Controller.</p>
            </div>`;
    }
}

// Sidebar Click Listener
sidebarItems.forEach(item => {
    item.addEventListener("click", function() {
        // 1. Update UI Active State
        sidebarItems.forEach(li => li.classList.remove("active"));
        this.classList.add("active");

        // 2. Get the exact name from the <li> and fetch from DB
        const selectedTopic = this.textContent.trim();
        loadDataFromDB(selectedTopic);
    });
});

// Load the first item by default on page load
window.addEventListener('DOMContentLoaded', () => {
    const firstTopic = document.querySelector(".sidebar li.active").textContent.trim();
    loadDataFromDB(firstTopic);
});
// Initial Load
fetchNotes();