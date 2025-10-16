import express from "express";
import { createListing } from "../controllers/listing_controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();
router.post("/create", createListing);

export default router;