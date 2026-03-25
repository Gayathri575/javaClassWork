// ===== common.js =====

window.addEventListener("DOMContentLoaded", () => {

    // ── Navbar Toggle (every page) ──────────────
    const toggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");

    if (toggle && navLinks) {
        toggle.addEventListener("click", (e) => {
            e.stopPropagation();
            navLinks.classList.toggle("active");
            toggle.textContent = navLinks.classList.contains("active") ? "✖" : "☰";
        });

        document.addEventListener("click", (e) => {
            if (!navLinks.contains(e.target) && e.target !== toggle) {
                navLinks.classList.remove("active");
                toggle.textContent = "☰";
            }
        });
    }

    // ── Sidebar Toggle (only on topic pages) ───
    const sidebarToggleBtn = document.getElementById("sidebar-toggle");
    const sidebarEl = document.querySelector(".sidebar");

    if (sidebarToggleBtn && sidebarEl) {
        sidebarToggleBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            sidebarEl.classList.toggle("active");
            sidebarToggleBtn.textContent = sidebarEl.classList.contains("active")
                ? "✕ Close"
                : "☰ Topics";
        });

        document.addEventListener("click", (e) => {
            if (window.innerWidth <= 768) {
                if (!sidebarEl.contains(e.target) && e.target !== sidebarToggleBtn) {
                    sidebarEl.classList.remove("active");
                    sidebarToggleBtn.textContent = "☰ Topics";
                }
            }
        });
    }
});