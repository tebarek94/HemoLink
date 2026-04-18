import express from "express";
import cors from "cors";
import { donorRouter } from "./routes/donorRoutes.js";
import { requestRouter } from "./routes/requestRoutes.js";
import { matchRouter } from "./routes/matchRoutes.js";
import { analyticsRouter } from "./routes/analyticsRoutes.js";
import { authRouter } from "./routes/authRoutes.js";
import { hospitalRouter } from "./routes/hospitalRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";

export function createApp() {
  const app = express();
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN?.split(",") ?? true,
    })
  );
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "hemolink-backend" });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/hospitals", hospitalRouter);
  app.use("/api/donors", donorRouter);
  app.use("/api/requests", requestRouter);
  app.use("/api/match", matchRouter);
  app.use("/api/analytics", analyticsRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
