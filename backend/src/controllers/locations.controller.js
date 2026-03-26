const { getActiveLocations } = require("../services/locations.service");

/**
 * GET /api/locations
 * Returns all active Square locations.
 */
const getLocations = async (req, res, next) => {
  try {
    const locations = await getActiveLocations();
    res.json({ locations });
  } catch (err) {
    next(err);
  }
};

module.exports = { getLocations };
