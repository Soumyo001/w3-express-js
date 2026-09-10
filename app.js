import e from "express";
import path from "path";
import { fileURLToPath } from "url";
import propertyRoutes from "./routes/property.route.js";
import configRoutes from "./routes/config.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = e();
app.use(e.json());
app.use('/', propertyRoutes);
app.use('/api', configRoutes);
app.use(e.static(path.join(__dirname, "public")));

export default app;