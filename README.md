# Eagle Creek Golf Club — Stay & Play (Express.js)

A single property page (Eagle Creek Golf Club, Orlando) served by an **Express.js**
server and made interactive with **vanilla JavaScript (ES modules)**. The static page
is built with plain HTML and CSS; the server exposes a small API, and the front end
adds the gallery, description, date picker, favourites, nearby-properties, and map
features on top of it.

Language: **JavaScript only** (no TypeScript).

---

## Features

- **Express server** that serves the page and the API from the `public/` folder.
- **`GET /get-property`** — returns the most-popular / highest-price / lowest-price
  dataset, with an optional `limit`.
- **`GET /images`** — returns an array of the 10 property images served from the server.
- **Nearby Properties** — a sort dropdown (Most Popular / Highest Price / Lowest Price)
  that fetches from `/get-property` and renders the cards (6 on desktop, 4 on mobile).
  On mobile the cards become a single-card swipe carousel with dot indicators.
- **Gallery** — on **desktop**, "View all images" opens a modal showing all 10 images in
  a scrollable gallery (background locked; closes on ✕ icon, click-outside, or Esc). On
  **tablet and mobile**, the hero image itself is an inline swipe carousel of the 10
  images with prev/next arrows, an image counter, and up to 5 sliding dots — no modal,
  by design.
- **Description** — a "Read more / Collapse" toggle.
- **Date picker** — a date range picker (Hotel Datepicker) with a guests/infants/pets
  modal and an auto-calculated total price.
- **Favourites** — a heart toggle whose state is stored in `localStorage` and persists
  across reloads.
- **Map** — Google Maps markers for the shown properties, with hover-tile ↔ marker and
  click-marker ↔ tile highlighting. The Google Maps key is read at runtime and is never
  committed to the repository.

---

## Tech stack / required modules

| Purpose            | Module / Library                | How it's loaded         |
| ------------------ | ------------------------------- | ----------------------- |
| HTTP server        | **express**                     | npm dependency          |
| Environment config | **dotenv**                      | npm dependency          |
| Date range picker  | **hotel-datepicker** (+ fecha)  | CDN (in `index.html`)   |
| Map                | **Google Maps JavaScript API**  | loaded at runtime with the key from `/api/config` |

The front end is plain JavaScript with **ES modules** — no framework and no build step.

---

## Prerequisites

- **Node.js** 18 or newer (ES modules are used throughout).
- A **Google Maps JavaScript API key** if you want the live map. Without one, the map
  area falls back to a static image and the app still runs with no errors.

---

## Getting started

**1. Clone the repository**

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

**2. Install dependencies**

```bash
npm install
```

**3. Create a `.env` file** in the project root (see the variable names below):

```env
PORT=8000
GOOGLE_MAPS_API_KEY=
```

- `PORT` — optional; defaults to `8000` if omitted.
- `GOOGLE_MAPS_API_KEY` — the Google Maps JavaScript API key. Leave it blank to run
  with the static map fallback (console stays clean); add a real key to enable the live
  map with markers.

**4. Run the server**

```bash
node index.js
```

(or `npm start` if a `"start": "node index.js"` script is defined in `package.json`).

**5. Open the app**

```
http://localhost:8000
```

> `package.json` must include `"type": "module"` because the project uses `import` /
> `export` syntax.

---

## Environment variables

| Variable              | Required | Default | Description                                                                 |
| --------------------- | -------- | ------- | --------------------------------------------------------------------------- |
| `PORT`                | No       | `8000`  | Port the Express server listens on.                                         |
| `GOOGLE_MAPS_API_KEY` | No\*     | —       | Google Maps JavaScript API key. \*Required for the live map; blank shows the static fallback. |

---

## Project structure

```
.
├── index.js                     # Entry point: loads env, starts the server
├── app.js                       # Express app: static files + routes
├── package.json
├── .env                         # Local secrets (git-ignored)
├── .gitignore                   # Ignores node_modules/ and .env
│
├── controllers/
│   ├── property.controller.js   # /get-property and /images handlers
│   └── config.controller.js     # /api/config (serves the Google Maps key)
│
├── routes/
│   ├── property.route.js        # /get-property, /images
│   └── config.route.js          # /api/config
│
├── services/
│   └── property.service.js      # Reads + normalizes the JSON datasets, lists images
│
├── data/
│   ├── most_popular.json
│   ├── highest_price.json
│   └── lowest_price.json
│
└── public/                      # Static site, served by express.static
    ├── index.html
    ├── style.css
    ├── assets/
    │   ├── icons/               # dark icons
    │   └── icons-white/         # white icons
    ├── images/                  # 10 property images returned by /images
    └── js/
        ├── main.js              # Entry module: initializes every feature
        ├── nearby.js            # Nearby Properties dropdown + card rendering
        ├── carousel.js          # Nearby cards single-card swipe carousel (mobile)
        ├── gallery.js           # Desktop "View all images" modal
        ├── hero.js              # Inline hero image carousel (tablet/mobile)
        ├── description.js       # Read more / Collapse
        ├── picker.js            # Hotel Datepicker + guests modal + total price
        ├── favourites.js        # Heart toggle + localStorage
        └── map.js               # Google Maps markers + tile/marker highlighting
```

---

## API endpoints

### `GET /get-property`

Returns a dataset of properties. Query parameters:

| Parameter        | Value  | Effect                                            |
| ---------------- | ------ | ------------------------------------------------- |
| `most-popular`   | `true` | Return the most-popular dataset                   |
| `highest-price`  | `true` | Return the highest-price dataset                  |
| `lowest-price`   | `true` | Return the lowest-price dataset                   |
| `limit`          | number | Return only the first *N* items from the dataset  |

Example:

```
GET /get-property?most-popular=true&limit=4
```

### `GET /images`

Returns an array of the 10 property image paths served from the server:

```json
["/images/1.jpg", "/images/2.jpg", "..."]
```

### `GET /api/config`

Returns the client-side config (the Google Maps key from the environment) so the key
stays out of the source:

```json
{ "googleMapsApiKey": "..." }
```

---

## ES6+ / modern JavaScript features used

- **ES modules** (`import` / `export`) on both the server and the front end.
- **`const` / `let`** and block scoping.
- **Arrow functions**.
- **Template literals** (card / marker markup, query strings).
- **Destructuring** (`const { googleMapsApiKey } = ...`, `const [start, end] = value.split(...)`).
- **Spread operator** (`[...set]`, `[...(p.amenities || [])]`).
- **Nullish coalescing (`??`)** and **logical/optional checks** for safe defaults.
- **Promises + `async` / `await`** with the **Fetch API** for all data loading.
- **`Set` / `Map`** for favourites and marker lookups.
- **Array methods** (`map`, `filter`, `forEach`, `join`).
- **`CustomEvent`** to keep the map markers in sync with the rendered cards.
- **`MutationObserver`**, **`matchMedia`**, and **`localStorage`** for the picker,
  responsive limits, and favourites persistence.
- **`import.meta.url` + `fileURLToPath`** to resolve paths in ES modules on the server.

---

## Notes

- The **booking / date-picker card** is a desktop element by design (on tablet and mobile
  it is replaced by the STAY/PLAY promo, matching the mockup), so test the picker on a
  wide window.
- The **gallery** uses a modal on desktop and an inline hero carousel on tablet/mobile —
  the "View all images" button appears on desktop only.
- The **map** is shown on desktop and tablet and hidden on mobile, matching the design.
- Without `GOOGLE_MAPS_API_KEY`, the map shows a static fallback image and the console
  stays clean. With a valid key, Google's console prints a single `google.maps.Marker`
  deprecation notice — a library notice, not an application error.
- The `.env` file is listed in `.gitignore`, so the Google Maps API key is never
  committed to the repository.