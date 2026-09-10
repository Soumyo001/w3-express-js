const grid = document.getElementById("stay-grid");
const dots = document.getElementById("stayDots");

// width of one page = card width + the 16px grid gap
const pageWidth = () => {
  const card = grid.querySelector(".stay-card");
  return card ? card.offsetWidth + 16 : grid.clientWidth;
};

const setActiveDot = () => {
  const index = Math.round(grid.scrollLeft / pageWidth());
  [...dots.children].forEach((dot, i) => dot.classList.toggle("is-active", i === index));
};

const buildDots = (count) => {
  dots.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "stay-dot" + (i === 0 ? " is-active" : "");
    dot.addEventListener("click", () => {
      grid.scrollTo({ left: pageWidth() * i, behavior: "smooth" });
    });
    dots.appendChild(dot);
  }
};

export const initCarousel = () => {
  if (!grid || !dots) return;

  // rebuild one dot per card whenever nearby.js renders
  document.addEventListener("properties:loaded", (e) => {
    buildDots(e.detail.length);
    grid.scrollLeft = 0;
  });

  // keep the active dot in sync while swiping
  grid.addEventListener("scroll", setActiveDot, { passive: true });
};