const { getHealthStatus } = require("../services/health.service");

const getHealth = (req, res) => {
  const status = getHealthStatus();
  res.json(status);
};

module.exports = { getHealth };
