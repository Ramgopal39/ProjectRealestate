import express from "express";
import { createListing, getListing } from "../controllers/listing_controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();
router.post("/create", createListing);
router.get("/:id", getListing);

export default router;