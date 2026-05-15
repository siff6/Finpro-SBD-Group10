import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import applicationsRoutes from "./routes/applications.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import errorHandler from "./middleware/errorHandler.js";
import { testConnection } from "./config/db.js";
import { connectRedis } from "./config/redis.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.use("/api/applications", applicationsRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(errorHandler);

app.listen(port, async () => {
    console.log(`Backend listening on port ${port}`);
    await testConnection();
    await connectRedis();
});
