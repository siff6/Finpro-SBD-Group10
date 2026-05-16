import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import applicationsRoutes from "./routes/applications.routes.js";
import companiesRoutes from "./routes/companies.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import remindersRoutes from "./routes/reminders.routes.js";
import notesRoutes from "./routes/notes.routes.js";
import statusHistoryRoutes from "./routes/statusHistory.routes.js";
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
app.use("/api/companies", companiesRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reminders", remindersRoutes);
app.use("/api", notesRoutes);
app.use("/api", statusHistoryRoutes);

app.use(errorHandler);

app.listen(port, async () => {
    console.log(`Backend listening on port ${port}`);
    await testConnection();
    await connectRedis();
});
