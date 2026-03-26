const express = require("express");
const cors = require("cors");
const { requestLogger } = require("./middlewares/logger.middleware");
const { notFoundHandler, errorHandler } = require("./middlewares/error.middleware");
const { router } = require("./routes");

const app = express();

app.use(cors());
app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/ping", (req, res) => res.json({ pong: true }));

app.use("/api", router);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = { app };
