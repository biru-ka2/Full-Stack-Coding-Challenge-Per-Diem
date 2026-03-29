import { app } from "./app";
import { env } from "./config/env";

const server = app.listen(env.port, () => {
  console.log(`[server] Running on port ${env.port} [${env.nodeEnv}]`);
});

server.on("error", (err: Error) => {
  console.error("[server] Fatal error:", err);
  process.exit(1);
});

const shutdown = () => {
  server.close(() => {
    console.log("[server] HTTP server closed");
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
