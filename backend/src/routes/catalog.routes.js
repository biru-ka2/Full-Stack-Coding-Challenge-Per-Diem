const express = require("express");
const { getCatalog, getCategories } = require("../controllers/catalog.controller");

const catalogRouter = express.Router();

catalogRouter.get("/categories", getCategories);
catalogRouter.get("/", getCatalog);

module.exports = { catalogRouter };
