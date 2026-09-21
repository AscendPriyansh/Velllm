import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);

app.get("/health", (_req, res) => {
    res.json({
        message: "Server is running Healthy."
    });
});

export default app;