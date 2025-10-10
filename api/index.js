import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/user_route.js";
import authRoute from "./routes/auth_route.js";
dotenv.config();



mongoose.connect(process.env.MONGO) .then(() => {
  console.log("Connected to MongoDB");
}) .catch((err) => {
  console.error(err);
});

const app = express();
app.use(express.json());
app.listen(5000, () => {
  console.log("Server is running on port 5000");
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