import { getDataset, listImages } from "../services/property.service.js";

const getPropertyController = async (req, res) => {
    try {
        const mostPopular = req.query["most-popular"];
        const highestPrice = req.query["highest-price"];
        const lowestPrice = req.query["lowest-price"];
        const limit = req.query.limit;
    
        let key = null;
        if (mostPopular === "true") key = "most-popular";
        else if (highestPrice === "true") key = "highest-price";
        else if (lowestPrice === "true") key = "lowest-price";
    
        const selected = key ? getDataset(key) : null;
    
        if (!selected) {
          return res.status(400).json({
            error: "Bad request. Please select one of most-popular, highest-price or lowest-price.",
          });
        }
    
        let result = selected;
    
        if (limit !== undefined) {
          const parsedLimit = parseInt(limit, 10);
          if (!Number.isNaN(parsedLimit) && parsedLimit >= 0) {
            result = selected.slice(0, parsedLimit);
          }
        }
    
        res.status(200).json(result);
    } catch(err) {
        res.status(500).json({ error: `Internal Server Error: ${err}` });
    }
}

const getImagesController = async (req, res) => {
  try {
    const images = await listImages();
    res.status(200).json(images);
  } catch (err) {
    res.status(500).json({ error: `Internal Server Error: ${err}` });
  }
}

export {
    getPropertyController,
    getImagesController
};