const getHealthStatus = () => ({
  status: "ok",
  timestamp: new Date().toISOString(),
  uptime: process.uptime(),
});

module.exports = { getHealthStatus };
