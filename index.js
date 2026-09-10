import dotenv from "dotenv";
dotenv.config({
    path: ".env"
});
import app from "./app.js";

const startServer = () => {
    try {
        app.on("error", (err) => {
            console.log("ERROR", err);
            throw err;
        });
        const port = process.env.PORT || 8000;
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    } catch (err) {
        console.log(`Failed to start server: ${err}`);
    }
}

startServer();