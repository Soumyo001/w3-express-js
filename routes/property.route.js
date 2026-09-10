import { Router } from "express";
import { getPropertyController, getImagesController } from "../controllers/property.controller.js";

const propertyRoutes = Router();

propertyRoutes.route("/get-property").get(getPropertyController);
propertyRoutes.route("/images").get(getImagesController);

export default propertyRoutes;