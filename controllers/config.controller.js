const getConfigController = (req, res) => {
    try {
        const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY || "";
        res.status(200).json({ googleMapsApiKey });
    } catch (err) {
        res.status(500).json({ error: `Internal Server Error: ${err}` });
    }
}

export { getConfigController };