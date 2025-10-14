import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/user_route.js";
import authRoute from "./routes/auth_route.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error(err);
});

const app = express();
app.use(express.json());
app.use(cookieParser());

// Serve static files from uploads directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});
