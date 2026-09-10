const KEY = "favorites";

const load = () => {
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY)) || []);
  } catch (err) {
    return new Set();
  }
};

const favorites = load();
const save = () => localStorage.setItem(KEY, JSON.stringify([...favorites]));

export const isFavourite = (id) => favorites.has(String(id));

export const initFavourites = () => {
  const grid = document.getElementById("stay-grid");
  if (!grid) return;

  grid.addEventListener("click", (e) => {
    const heart = e.target.closest(".stay-card__action--fav");
    if (!heart) return;

    const id = String(heart.closest(".stay-card").dataset.id);
    if (favorites.has(id)) {
      favorites.delete(id);
      heart.classList.remove("is-active");
    } else {
      favorites.add(id);
      heart.classList.add("is-active");
    }
    save();
  });
};