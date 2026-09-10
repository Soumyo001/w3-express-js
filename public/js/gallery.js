const modal = document.getElementById("galleryModal");
const track = document.getElementById("galleryTrack");
const viewport = document.getElementById("galleryViewport");
const closeBtn = document.getElementById("galleryClose");

let loaded = false;

const load = async () => {
  const res = await fetch("/images");
  const images = await res.json();
  track.innerHTML = images
    .map((src) => `<div class="gmodal__slide"><img src="${src}" alt="" /></div>`)
    .join("");
  loaded = true;
};

const open = async () => {
  try {
    if (!loaded) await load();
  } catch (err) {
    return;
  }
  modal.hidden = false;
  document.body.classList.add("modal-open");
  viewport.scrollTop = 0;
};

const close = () => {
  modal.hidden = true;
  document.body.classList.remove("modal-open");
};

export const initGallery = () => {
  const openBtn = document.getElementById("openGalleryBtn");
  if (!openBtn || !modal) return;

  openBtn.addEventListener("click", open);
  closeBtn.addEventListener("click", close);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) close();
  });
};