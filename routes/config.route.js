import { Router } from "express";
import { getConfigController } from "../controllers/config.controller.js";

const configRoutes = Router();
configRoutes.route('/config').get(getConfigController);
export default configRoutes;