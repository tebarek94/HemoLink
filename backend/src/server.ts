import "dotenv/config";
import { createApp } from "./app.js";

const port = Number(process.env.PORT) || 4000;

const app = createApp();

const host = process.env.HOST ?? "0.0.0.0";

app.listen(port, host, () => {
  console.log(`HemoLink API listening on http://${host}:${port}`);
});
