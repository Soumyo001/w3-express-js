const track = document.getElementById("heroTrack");
const dotsWindow = document.getElementById("heroDots");
const strip = document.getElementById("heroDotsStrip");
const counter = document.getElementById("heroCounter");
const prevBtn = document.getElementById("heroPrev");
const nextBtn = document.getElementById("heroNext");

const carouselMq = window.matchMedia("(max-width: 1024px)");

let images = [];
let total = 0;
let dots = [];
let built = false;

const slideWidth = () => track.clientWidth;
const current = () => Math.round(track.scrollLeft / slideWidth());

// window shows at most 5 dots
const buildDots = () => {
  const visible = Math.min(total, 5);
  dotsWindow.style.width = `${visible * 8 + (visible - 1) * 6}px`;
  strip.innerHTML = images.map(() => `<span class="carousel-dots__dot"></span>`).join("");
  dots = [...strip.children];
};

const syncDots = (index) => {
  const offsetMax = Math.max(0, total - 5);
  const offset = Math.min(Math.max(index - 2, 0), offsetMax);
  strip.style.transform = `translateX(${-offset * 14}px)`;
  dots.forEach((dot, i) => {
    dot.classList.toggle("is-active", i === index);
    const leftEdge = offset > 0 && i === offset;
    const rightEdge = offset + 4 < total - 1 && i === offset + 4;
    dot.classList.toggle("is-edge", leftEdge || rightEdge);
  });
};

const sync = () => {
  const index = current();
  counter.textContent = `${index + 1} / ${total}`;
  syncDots(index);
};

const goTo = (i) => {
  const index = Math.max(0, Math.min(i, total - 1));
  track.scrollTo({ left: slideWidth() * index, behavior: "smooth" });
};

const build = async () => {
  if (built) return;
  try {
    const res = await fetch("/images");
    images = await res.json();
  } catch (err) {
    return;
  }
  total = images.length;
  track.innerHTML = images
    .map((src) => `<img src="${src}" alt="" class="gallery-layout__slide" />`)
    .join("");
  buildDots();
  built = true;
  sync();
};

export const initHero = () => {
  if (!track || !strip || !counter || !prevBtn || !nextBtn) return;

  prevBtn.addEventListener("click", () => goTo(current() - 1));
  nextBtn.addEventListener("click", () => goTo(current() + 1));
  strip.addEventListener("click", (e) => {
    const i = dots.indexOf(e.target);
    if (i >= 0) goTo(i);
  });
  track.addEventListener("scroll", sync, { passive: true });

  // load the 10 images only when tablet or mobile is used
  if (carouselMq.matches) build();
  carouselMq.addEventListener("change", (e) => { if (e.matches) build(); });
};