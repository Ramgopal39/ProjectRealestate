import express from "express";
import { signup } from "../controllers/auth_controller.js";
import e from "express";

const router = express.Router();

router.post("/signup", signup);

export default router;