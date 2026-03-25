// ===== hibernate.js =====

const sidebar = document.getElementById("sidebar-list");
const pageContent = document.getElementById("page-content");
const pageNumber = document.getElementById("page-number");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let pages = [];
let currentPage = 0;
let isInitialized = false; // ✅ Guard flag to prevent double render on load

const hibernateCategories = ["Hibernate"];

const sectionMap = {
  "Hibernate Basics": [
    "Hibernate Basics",
    "ORM (Object Relational Mapping)",
    "Hibernate Architecture",
    "Configuration (hibernate.cfg.xml)"
  ],
  "Core Components": [
    "SessionFactory",
    "Session",
    "CRUD Operations"
  ],
  "Entity & Mapping": [
    "Entity Mapping",
    "Annotations (@Entity, @Table, @Id, @Column)",
    "Relationships (OneToOne, OneToMany, ManyToOne)",
    "Fetch Types (Lazy, Eager)"
  ],
  "Advanced Concepts": [
    "Hibernate Object States (Transient, Persistent, Detached)",
    "HQL (Hibernate Query Language)",
    "Transactions"
  ]
};

// -------- 1. Fetch All Hibernate Notes --------
async function fetchNotes() {
    pageContent.innerHTML = `<div class="loader">Fetching Hibernate from Database...</div>`;

    try {
        const responses = await Promise.all(
            hibernateCategories.map(cat =>
                fetch(`http://localhost:8080/api/notes/category?category=${encodeURIComponent(cat)}`)
                    .then(res => {
                        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                        return res.json();
                    })
            )
        );

        const allData = responses.flat();

        // ✅ Sort by sectionMap order
        const orderedTitles = Object.values(sectionMap).flat();
        const sorted = orderedTitles
            .map(title => allData.find(p => p.title === title))
            .filter(Boolean);

        if (sorted.length > 0) {
            pages = sorted; // ✅ use sorted instead of allData
            currentPage = 0;
            renderSidebar();
            renderPage();
        } else {
            pageContent.innerHTML = `<h3>No Hibernate content found in database.</h3>`;
            pageNumber.textContent = "0 / 0";
        }

    } catch (err) {
        console.error("Fetch Error:", err);
        pageContent.innerHTML = `<p style="color:red;">Error loading content. Is the backend running?</p>`;
        pageNumber.textContent = "0 / 0";
    }
}

// -------- 2. Render Sidebar (Desktop only) --------
function renderSidebar() {
    // ✅ Skip rendering sidebar on mobile
    if (window.innerWidth <= 768) return;

    sidebar.innerHTML = "";

    Object.entries(sectionMap).forEach(([sectionName, titles]) => {
        const sectionNotes = titles
            .map(title => pages.findIndex(p => p.title === title))
            .filter(idx => idx !== -1);

        if (sectionNotes.length === 0) return;

        const sectionHeader = document.createElement("li");
        sectionHeader.classList.add("sidebar-section-header");
        sectionHeader.innerHTML = `<span>${sectionName}</span><span class="arrow">▾</span>`;

        const subList = document.createElement("ul");
        subList.classList.add("sidebar-sublist");

        // Auto-open active section
        if (sectionNotes.includes(currentPage)) {
            subList.style.display = "block";
            sectionHeader.querySelector(".arrow").textContent = "▾";
        }

        sectionNotes.forEach(noteIdx => {
            const note = pages[noteIdx];
            const li = document.createElement("li");
            li.textContent = note.title;
            li.classList.add("sidebar-subitem");

            if (noteIdx === currentPage) li.classList.add("active");

            li.addEventListener("click", () => {
                currentPage = noteIdx;
                renderPage();
                renderSidebar();
            });

            subList.appendChild(li);
        });

        sectionHeader.addEventListener("click", () => {
            const isOpen = subList.style.display === "block";
            subList.style.display = isOpen ? "none" : "block";
            sectionHeader.querySelector(".arrow").textContent = isOpen ? "▸" : "▾";
        });

        sidebar.appendChild(sectionHeader);
        sidebar.appendChild(subList);
    });
}

// -------- 3. Render Page --------
function renderPage() {
    if (!pages || pages.length === 0) {
        pageContent.innerHTML = "<p>No content available.</p>";
        pageNumber.textContent = "0 / 0";
        return;
    }

    const currentNote = pages[currentPage];
    pageContent.innerHTML = `
        <div class="note-card">
            <h2>${currentNote.title}</h2>
            <div class="note-body">${currentNote.content || "Content is empty."}</div>

        </div>
    `;

    pageNumber.textContent = `${currentPage + 1} / ${pages.length}`;
    window.scrollTo(0, 0);
}

// -------- 4. Pagination --------
prevBtn.addEventListener("click", () => {
    if (currentPage > 0) { currentPage--; renderPage(); renderSidebar(); }
});

nextBtn.addEventListener("click", () => {
    if (currentPage < pages.length - 1) { currentPage++; renderPage(); renderSidebar(); }
});

// -------- 5. Hide sidebar element on mobile via JS --------
function handleSidebarVisibility() {
    const sidebarEl = document.getElementById("sidebar");
    const overlayEl = document.getElementById("sidebar-overlay");
    const toggleBtn = document.getElementById("sidebar-toggle");

    if (window.innerWidth <= 768) {
        // ✅ Completely hide sidebar and related elements on mobile
        if (sidebarEl) sidebarEl.style.display = "none";
        if (overlayEl) overlayEl.style.display = "none";
        if (toggleBtn) toggleBtn.style.display = "none";
    } else {
        // ✅ Show sidebar on desktop
        if (sidebarEl) sidebarEl.style.display = "";
        if (overlayEl) overlayEl.style.display = "";
        if (toggleBtn) toggleBtn.style.display = "none"; // toggle btn only for mobile
    }
}

// -------- 6. Init --------
window.addEventListener("DOMContentLoaded", () => {
    handleSidebarVisibility();
    fetchNotes();
    isInitialized = true; // ✅ Set after init so resize won't double-render on load
});

// ✅ Re-check on screen resize (e.g. rotating phone)
window.addEventListener("resize", () => {
    if (!isInitialized) return; // ✅ Prevent false resize trigger on page load
    handleSidebarVisibility();
    renderSidebar();
});