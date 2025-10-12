import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoute from "./routes/user_route.js";
import authRoute from "./routes/auth_route.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./utils/error.js";


dotenv.config();



mongoose.connect(process.env.MONGO) .then(() => {
  console.log("Connected to MongoDB");
}) .catch((err) => {
  console.error(err);
});

const app = express();
app.use(express.json());
app.use(cookieParser());
app.listen(3000, () => {
  console.log("Server is running on port 3000");
}
);

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
}); 