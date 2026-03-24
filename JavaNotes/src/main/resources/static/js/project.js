const gridItems = document.querySelectorAll(".grid-item");
const toggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

toggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    toggle.textContent = navLinks.classList.contains("active") ? "✖" : "☰";
});

gridItems.forEach(item => {
    item.addEventListener("click", () => {
        const topic = item.getAttribute("data-topic");
        // For now, alert the topic
        alert(`You clicked: ${topic}`);
        // Later, you can redirect to topic-specific page
        // window.location.href = `topic/${topic}.html`;
    });
});

// Navbar toggle (optional)
const toggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
toggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    toggle.textContent = navLinks.classList.contains("active") ? "✖" : "☰";
});