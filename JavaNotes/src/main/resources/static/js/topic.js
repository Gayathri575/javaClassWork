// ===== topic.js (Core Java) =====

const sidebar = document.getElementById("sidebar-list");
const pageContent = document.getElementById("page-content");
const pageNumber = document.getElementById("page-number");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let pages = [];
let currentPage = 0;
let isInitialized = false;

const category = "Core Java";

const sectionMap = {
  "OOP Concepts": [
    "Classes and Objects", "Constructors", "this keyword", "static keyword",
    "Inheritance", "Method Overriding & super keyword", "Polymorphism",
    "Encapsulation", "Abstraction", "Interfaces", "Object class methods",
    "Packages and Access Modifiers", "Marker Interface", "Cloneable Interface"
  ],
  "Exception Handling": [
    "try, catch, finally", "Multiple catch blocks", "Nested try",
    "throw vs throws", "Custom Exceptions", "Checked vs Unchecked Exceptions"
  ],
  "Java Memory Management": [
    "Stack vs Heap", "Garbage Collection", "finalize() method",
    "final, finally, finalize differences", "Garbage Collectors (types)",
    "Garbage Collector"
  ],
  "Java Strings": [
    "String, StringBuilder, StringBuffer", "Immutability of String",
    "String methods", "String Comparison", "Regular Expressions"
  ],
  "Collections Framework": [
    "Collection Interfaces", "Implementation Classes", "Iterators & Loops",
    "Generics", "Comparable vs Comparator", "Collections Utility Class",
    "Thread-safe Collections"
  ],
  "Java Generics": [
    "Generic Classes and Methods", "Bounded Types", "Wildcards", "Type Erasure"
  ],
  "Multithreading": [
    "Thread Creation", "Thread Lifecycle", "Thread Priorities",
    "Synchronization", "Inter-thread Communication", "ExecutorService",
    "Callable and Future", "Atomic Classes"
  ],
  "Java I/O": [
    "File I/O", "Buffered I/O", "Byte vs Character Streams", "Serialization",
    "Deserialization", "transient keyword", "Scanner Class", "NIO"
  ],
  "Java 8+ Features": [
    "Lambda Expressions", "Functional Interfaces", "Predicate", "Function",
    "Consumer", "Stream API", "Optional Class", "Method References",
    "Default & Static Methods in Interfaces", "Date & Time API"
  ],
  "Concurrency Utilities": [
    "java.util.concurrent", "CountDownLatch, Semaphore, CyclicBarrier",
    "ForkJoinPool", "Executors Framework"
  ],
  "Annotations & Reflection": [
    "Built-in Annotations", "Custom Annotations", "Reflection API",
    "Dynamic Class Loading"
  ],
  "Networking": [
    "Sockets (TCP/UDP)", "URL & URLConnection", "HTTP Requests", "InetAddress"
  ]
};

// -------- 1. Fetch Notes --------
async function fetchNotes() {
  pageContent.innerHTML = `<div class="loader">Fetching ${category} from Database...</div>`;

  try {
    const response = await fetch(`/api/notes/category?category=${encodeURIComponent(category)}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();

    const orderedTitles = Object.values(sectionMap).flat();
    const sorted = orderedTitles
      .map(title => data.find(p => p.title === title))
      .filter(Boolean);

    if (sorted.length > 0) {
      pages = sorted;
      currentPage = 0;
      renderSidebar();
      renderPage();
    } else {
      pageContent.innerHTML = `<h3>No content found for "${category}"</h3>`;
      pageNumber.textContent = "0 / 0";
    }
  } catch (err) {
    console.error("Fetch Error:", err);
    pageContent.innerHTML = `<p style="color:red;">Error loading content.</p>`;
    pageNumber.textContent = "0 / 0";
  }
}

// -------- 2. Render Sidebar --------
function renderSidebar() {
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

    if (sectionNotes.includes(currentPage)) {
      subList.style.display = "block";
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

// -------- 5. Sidebar Visibility --------
function handleSidebarVisibility() {
  const sidebarEl = document.getElementById("sidebar");
  const overlayEl = document.getElementById("sidebar-overlay");
  const toggleBtn = document.getElementById("sidebar-toggle");

  if (window.innerWidth <= 768) {
    if (sidebarEl) sidebarEl.style.display = "none";
    if (overlayEl) overlayEl.style.display = "none";
    if (toggleBtn) toggleBtn.style.display = "none";
  } else {
    if (sidebarEl) sidebarEl.style.display = "";
    if (overlayEl) overlayEl.style.display = "";
    if (toggleBtn) toggleBtn.style.display = "none";
  }
}

// -------- 6. Init --------
window.addEventListener("DOMContentLoaded", () => {
  handleSidebarVisibility();
  fetchNotes();
  isInitialized = true;
});

window.addEventListener("resize", () => {
  if (!isInitialized) return;
  handleSidebarVisibility();
  renderSidebar();
});