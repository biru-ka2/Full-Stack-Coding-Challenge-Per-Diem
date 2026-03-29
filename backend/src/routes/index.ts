import { Router } from "express";
import { getHealth } from "../controllers/health.controller";
import { getLocations } from "../controllers/locations.controller";
import { getCatalog, getCategories } from "../controllers/catalog.controller";

export const router = Router();

router.get("/health", getHealth);
router.get("/locations", getLocations);
router.get("/catalog/categories", getCategories);
router.get("/catalog", getCatalog);
