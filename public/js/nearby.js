import { isFavourite } from "./favourites.js";

const grid = document.getElementById("stay-grid");
const dropdown = document.getElementById("sort-select");

const mobileMq = window.matchMedia("(max-width: 767px)");
const limitForPlatform = () => (mobileMq.matches ? 4 : 6);

const scoreLabel = (score) => {
  if (score >= 9) return "Exceptional";
  if (score >= 8) return "Excellent";
  if (score >= 7) return "Very Good";
  return "Good";
};

const esc = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const cardHTML = (p) => {
  const score = p.reviewScore != null ? Number(p.reviewScore).toFixed(1) : "—";
  const price = p.price != null ? `From $${Math.round(Number(p.price))}` : "";
  const features = [...(p.amenities || []), p.occupancy ? `Sleeps ${p.occupancy}` : null]
    .filter(Boolean)
    .join(" · ");
  const favActive = isFavourite(p.id) ? " is-active" : "";

  return `
    <article class="stay-card" data-id="${esc(p.id)}">
      <div class="stay-card__media">
        <img src="${esc(p.image)}" alt="${esc(p.name)}" />
        <span class="stay-card__badge">50+ Golf Courses Nearby</span>
        <div class="stay-card__actions">
          <button type="button" class="stay-card__action"><img src="assets/icons-white/share.svg" alt="share" width="8" height="8" /></button>
          <button type="button" class="stay-card__action"><img src="assets/icons-white/pin.svg" alt="location" width="8" height="8" /></button>
          <button type="button" class="stay-card__action stay-card__action--fav${favActive}"><span class="stay-card__heart"></span></button>
        </div>
      </div>
      <div class="stay-card__body">
        <div class="stay-card__rating">
          <span class="stay-card__score"><span class="star"></span> ${score} ${scoreLabel(Number(p.reviewScore))}</span>
          <span class="divider"></span>
          <span class="stay-card__reviews">${p.reviewCount} Reviews</span>
        </div>
        <h3 class="stay-card__name">${esc(p.name)}</h3>
        <span class="stay-card__source">Booking.com</span>
        <div class="stay-card__price">${price}</div>
        <p class="stay-card__features">${esc(features)}</p>
        <span class="stay-card__location">${esc(p.location)}</span>
        <div class="stay-card__cta">
          <button type="button" class="stay-card__btn stay-card__btn__outline">Learn More</button>
          <button type="button" class="stay-card__btn stay-card__btn__green">See Dates</button>
        </div>
      </div>
    </article>`;
};

const loadProperties = async (sort) => {
  try {
    const res = await fetch(`/get-property?${sort}=true&limit=${limitForPlatform()}`);
    const properties = await res.json();
    grid.innerHTML = properties.map(cardHTML).join("");
    document.dispatchEvent(new CustomEvent("properties:loaded", { detail: properties }));
  } catch (err) {
    grid.innerHTML = "<p>Could not load properties. Please try again.</p>";
  }
};

export const initNearby = () => {
  if (!grid || !dropdown) return;

  const label = dropdown.querySelector(".filter__select-label");
  const toggle = dropdown.querySelector(".filter__select-toggle");
  const reload = () => loadProperties(dropdown.dataset.value);

  // open / close the menu
  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("is-open");
  });
  document.addEventListener("click", () => dropdown.classList.remove("is-open"));

  // pick an option
  dropdown.querySelectorAll(".filter__select-option").forEach((option) => {
    option.addEventListener("click", () => {
      dropdown.dataset.value = option.dataset.value;
      label.textContent = option.textContent;
      dropdown.classList.remove("is-open");
      reload();
    });
  });

  reload(); 
  mobileMq.addEventListener("change", reload);
};