const PRICE_PER_NIGHT = 2026;
const DAY_MS = 86400000;
const money = (n) => `USD $${n}`;

const initDatepicker = () => {
  const input = document.getElementById("dateRange");
  if (!input || !window.HotelDatepicker) return;

  const checkinField = document.getElementById("checkinField");
  const checkoutField = document.getElementById("checkoutField");
  const checkinValue = document.getElementById("checkinValue");
  const checkoutValue = document.getElementById("checkoutValue");
  const totalPrice = document.getElementById("totalPrice");

  const datepicker = new window.HotelDatepicker(input, {
    format: "DD MMM YYYY",
    separator: " - ",
    startDate: new Date(), // past dates are not selectable
    minNights: 1,          // check-out is at least 1 night after check-in
    autoClose: true,
    moveBothMonths: true,
  });

  let lastValue = "";
  const applySelection = () => {
    const value = input.value || datepicker.getValue() || "";
    if (!value || value === lastValue || !value.includes(" - ")) return;
    lastValue = value;

    const [startStr, endStr] = value.split(" - ");
    checkinValue.textContent = startStr;
    checkoutValue.textContent = endStr;

    const nights = Math.round((new Date(endStr) - new Date(startStr)) / DAY_MS);
    if (!Number.isNaN(nights)) totalPrice.textContent = money(nights * PRICE_PER_NIGHT);
  };

  const watchTarget =
    document.querySelector(".datepicker") || input.closest(".booking__card") || document.body;
  new MutationObserver(applySelection).observe(watchTarget, {
    attributes: true,
    childList: true,
    subtree: true,
  });
  input.addEventListener("change", applySelection);

  // Keep the popup inside the viewport
  const fitInViewport = () => {
    const el = datepicker.datepicker || document.querySelector(".datepicker");
    if (!el) return;
    el.style.transform = "none";
    const rect = el.getBoundingClientRect();
    const margin = 12;
    let shift = 0;
    if (rect.right > window.innerWidth - margin) shift = window.innerWidth - margin - rect.right;
    if (rect.left + shift < margin) shift = margin - rect.left;
    el.style.transform = shift ? `translateX(${shift}px)` : "none";
  };

  const openPicker = () => {
    datepicker.open();
    setTimeout(fitInViewport, 0);
  };
  checkinField.addEventListener("click", openPicker);
  checkoutField.addEventListener("click", openPicker);
};

const initGuests = () => {
  const field = document.getElementById("guestsField");
  const modal = document.getElementById("guestsModal");
  if (!field || !modal) return;

  const value = document.getElementById("guestsValue");
  const closeBtn = document.getElementById("guestsClose");

  const counts = { guests: 1, infants: 0, pets: 0 };
  const minimums = { guests: 1, infants: 0, pets: 0 }; // at least 1 guest
  const countEls = {
    guests: document.getElementById("countGuests"),
    infants: document.getElementById("countInfants"),
    pets: document.getElementById("countPets"),
  };

  const label = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;
  const render = () => {
    const parts = [label(counts.guests, "Guest")];
    if (counts.infants) parts.push(label(counts.infants, "Infant"));
    if (counts.pets) parts.push(label(counts.pets, "Pet"));
    value.textContent = parts.join(", ");
    countEls.guests.textContent = counts.guests;
    countEls.infants.textContent = counts.infants;
    countEls.pets.textContent = counts.pets;
  };

  const open = () => { modal.hidden = false; document.body.classList.add("modal-open"); };
  const close = () => { modal.hidden = true; document.body.classList.remove("modal-open"); };

  field.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  modal.addEventListener("click", (e) => { if (e.target === modal) close(); });

  modal.querySelectorAll(".pmodal__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.counter;
      const step = Number(btn.dataset.step);
      counts[key] = Math.max(minimums[key], counts[key] + step);
      render();
    });
  });

  render();
};

export const initPicker = () => {
  initDatepicker();
  initGuests();
};