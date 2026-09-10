export const initDescription = () => {
  const description = document.querySelector(".description");
  const toggle = document.getElementById("descriptionToggle");
  if (!description || !toggle) return;

  const label = toggle.querySelector(".readmore__label");

  toggle.addEventListener("click", () => {
    const expanded = description.classList.toggle("is-expanded");
    label.textContent = expanded ? "Collapse" : "Read more";
  });
};