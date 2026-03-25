document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".grid-item");

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const project = card.dataset.project; // reads "ems", "lms", etc.
      window.location.href = `projects/${project}.html`;
    });
  });
});