require("dotenv").config();

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  port: parseInt(process.env.PORT, 10) || 5000,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",

  // Square
  squareAccessToken: process.env.SQUARE_ACCESS_TOKEN || "",
  squareEnvironment: process.env.SQUARE_ENVIRONMENT || "sandbox",
  squareBaseUrl:
    process.env.SQUARE_ENVIRONMENT === "production"
      ? "https://connect.squareup.com"
      : "https://connect.squareupsandbox.com",
};

if (!env.squareAccessToken) {
  console.warn("WARNING: SQUARE_ACCESS_TOKEN is not set");
}

module.exports = { env };
