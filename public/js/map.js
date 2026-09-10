const CENTER = { lat: 28.42, lng: -81.3 };

let map = null;
const markers = new Map();
let pending = null;
let hoveredId = null;

const loadGoogleMaps = (key) =>
  new Promise((resolve, reject) => {
    if (window.google && window.google.maps) return resolve();
    window.__initGmap = resolve;
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&loading=async&callback=__initGmap`;
    script.async = true;
    script.onerror = reject;
    document.head.appendChild(script);
  });

const highlightTile = (id) => {
  const grid = document.getElementById("stay-grid");
  if (!grid) return;
  grid.querySelectorAll(".stay-card").forEach((card) =>
    card.classList.toggle("is-highlighted", card.dataset.id === String(id))
  );
  const card = grid.querySelector(`.stay-card[data-id="${CSS.escape(String(id))}"]`);
  if (card) card.scrollIntoView({ behavior: "smooth", block: "nearest" });
};

const highlightMarker = (id, on) => {
  const marker = markers.get(String(id));
  if (marker) marker.setAnimation(on ? google.maps.Animation.BOUNCE : null);
};

// rebuild markers for the currently displayed properties
const renderMarkers = (properties) => {
  if (!map) {
    pending = properties;
    return;
  }

  markers.forEach((m) => m.setMap(null));
  markers.clear();

  const bounds = new google.maps.LatLngBounds();
  properties.forEach((p) => {
    if (p.lat == null || p.lng == null) return;
    const position = { lat: Number(p.lat), lng: Number(p.lng) };
    const marker = new google.maps.Marker({ position, map, title: p.name });
    marker.addListener("click", () => highlightTile(p.id));
    markers.set(String(p.id), marker);
    bounds.extend(position);
  });
  if (markers.size) map.fitBounds(bounds);
};

export const initMap = async () => {
  const grid = document.getElementById("stay-grid");
  const container = document.getElementById("stayMap");
  if (!grid || !container) return;

  // hover a tile -> bounce its marker
  grid.addEventListener("mouseover", (e) => {
    const card = e.target.closest(".stay-card");
    const id = card ? card.dataset.id : null;
    if (id === hoveredId) return;
    if (hoveredId) highlightMarker(hoveredId, false);
    hoveredId = id;
    if (id) highlightMarker(id, true);
  });
  grid.addEventListener("mouseleave", () => {
    if (hoveredId) highlightMarker(hoveredId, false);
    hoveredId = null;
  });

  // markers follow nearby properties rendered
  document.addEventListener("properties:loaded", (e) => renderMarkers(e.detail));

  // load the key
  try {
    const res = await fetch("/api/config");
    const { googleMapsApiKey } = await res.json();
    if (!googleMapsApiKey || !googleMapsApiKey.trim()) return;

    // restore the static image and stop.
    const fallbackHTML = container.innerHTML;
    window.gm_authFailure = () => {
      map = null;
      container.innerHTML = fallbackHTML;
    };

    await loadGoogleMaps(googleMapsApiKey.trim());
    container.innerHTML = ""; // remove the fallback image
    const canvas = document.createElement("div");
    canvas.className = "stay-map__canvas";
    container.appendChild(canvas);

    map = new google.maps.Map(canvas, {
      center: CENTER,
      zoom: 11,
      mapTypeControl: false,
      streetViewControl: false,
    });

    // map hidden on mobile
    window.matchMedia("(max-width: 767px)").addEventListener("change", (e) => {
      if (map && !e.matches) {
        google.maps.event.trigger(map, "resize");
        if (markers.size) {
          const bounds = new google.maps.LatLngBounds();
          markers.forEach((m) => bounds.extend(m.getPosition()));
          map.fitBounds(bounds);
        }
      }
    });

    if (pending) renderMarkers(pending);
  } catch (err) {
    
  }
};