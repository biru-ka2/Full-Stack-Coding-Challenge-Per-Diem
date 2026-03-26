const express = require("express");
const { getLocations } = require("../controllers/locations.controller");

const locationsRouter = express.Router();

locationsRouter.get("/", getLocations);

module.exports = { locationsRouter };
