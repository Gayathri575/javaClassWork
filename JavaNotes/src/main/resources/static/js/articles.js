const toggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

toggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    toggle.textContent = navLinks.classList.contains("active") ? "✖" : "☰";
});

// Close nav when clicking outside
document.addEventListener("click", (e) => {
    if (!navLinks.contains(e.target) && e.target !== toggle) {
        navLinks.classList.remove("active");
        toggle.textContent = "☰";
    }
});