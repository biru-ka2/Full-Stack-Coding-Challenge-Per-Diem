const express = require("express");
const { getHealth } = require("../controllers/health.controller");
const { getLocations } = require("../controllers/locations.controller");
const { getCatalog, getCategories } = require("../controllers/catalog.controller");

const router = express.Router();

router.get("/health", getHealth);
router.get("/locations", getLocations);
router.get("/catalog/categories", getCategories);
router.get("/catalog", getCatalog);

module.exports = { router };
