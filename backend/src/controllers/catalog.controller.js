const { getCatalogByLocation, getCategoriesByLocation } = require("../services/catalog.service");
const { AppError } = require("../utils/errors");

/**
 * GET /api/catalog?location_id=<id>
 * Returns catalog items grouped by category for a location.
 */
const getCatalog = async (req, res, next) => {
  try {
    const { location_id } = req.query;
    if (!location_id) {
      return next(new AppError("location_id query parameter is required", 400));
    }
    const catalog = await getCatalogByLocation(location_id);
    res.json({ catalog });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/catalog/categories?location_id=<id>
 * Returns categories with item counts for a location.
 */
const getCategories = async (req, res, next) => {
  try {
    const { location_id } = req.query;
    if (!location_id) {
      return next(new AppError("location_id query parameter is required", 400));
    }
    const categories = await getCategoriesByLocation(location_id);
    res.json({ categories });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCatalog, getCategories };
