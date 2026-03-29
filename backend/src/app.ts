import express from "express";
import cors from "cors";
import { requestLogger } from "./middlewares/logger.middleware";
import { notFoundHandler, errorHandler } from "./middlewares/error.middleware";
import { router } from "./routes";
import { env } from "./config/env";

export const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/ping", (_req, res) => res.json({ pong: true }));

app.use("/api", router);

app.use(notFoundHandler);
app.use(errorHandler);
