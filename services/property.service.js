import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "..", "data");
const IMAGES_DIR = path.join(__dirname, "..", "public", "images");

function normalizeProperty(entry) {
  if (!entry || !entry.Property) return null;

  const property = entry.Property;
  const geo = entry.GeoInfo || {};
  const partner = entry.Partner || {};

  return {
    id: entry.ID,
    name: property.PropertyName || "Unnamed property",
    slug: property.PropertySlug || null,
    type: property.PropertyType || null,
    location: geo.Display || "",
    lat: geo.Lat ? Number(geo.Lat) : null,
    lng: geo.Lng ? Number(geo.Lng) : null,
    price: property.Price ?? property.CachePrice ?? null,
    currency: "USD",
    reviewScore: property.ReviewScore ?? null,
    reviewCount: (property.Counts && property.Counts.Reviews) ?? 0,
    bedrooms: (property.Counts && property.Counts.Bedroom) ?? null,
    bathrooms: (property.Counts && property.Counts.Bathroom) ?? null,
    occupancy: (property.Counts && property.Counts.Occupancy) ?? null,
    highlight: property.PropertyHighlight || null,
    amenities: (property.TopAmenities || []).map((a) => a.Name),
    image: property.FeatureImage
      ? `https://beta.imgservice.rentbyowner.com/640x300/${property.FeatureImage}`
      : null,
    bookingUrl: partner.URL || null,
  };
}

function loadDataset(filename) {
  const filePath = path.join(DATA_DIR, filename);
  const raw = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const items = (raw.Result && raw.Result.Items) || [];
  return items.map(normalizeProperty).filter(Boolean);
}

const datasets = {
  "most-popular": loadDataset("most_popular.json"),
  "highest-price": loadDataset("highest_price.json"),
  "lowest-price": loadDataset("lowest_price.json"),
};

export function getDataset(key) {
  return datasets[key] || null;
}

export function listImages() {
  return new Promise((resolve, reject) => {
    fs.readdir(IMAGES_DIR, (err, files) => {
      if (err) return reject(err);

      const images = files
        .filter((file) => /\.(jpe?g|png|webp)$/i.test(file))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
        .map((file) => `/images/${file}`);

      resolve(images);
    });
  });
}