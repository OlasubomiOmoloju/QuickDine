import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import restaurantRouter from "./routes/restaurantRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import adminRouter from "./controllers/adminRoutes.js";

const app = express();

// Connect to MongoDB
await connectDB();

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Server is Live!");
});

app.use("/api/auth", authRouter);
app.use("/api/restaurants", restaurantRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/admin", adminRouter);

// Global error handler
app.use(
    (
        err: Error,
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        console.error("Unhandled Error:", err);

        res.status(500).json({
            message: err.message || "Internal Server Error",
            stack:
                process.env.NODE_ENV === "production"
                    ? undefined
                    : err.stack,
        });
    }
);

export default app;