import express from "express";
import { deleteUser, getUserListings, getUser, signOut, test, updateUser } from "../controllers/user_controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import { upload } from "../utils/upload.js";

const router = express.Router();

router.get("/test", test);
router.post("/update/:id", verifyToken, upload.single("photo"), updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/signout", signOut);
router.get("/listings/:id", verifyToken, getUserListings);
router.get("/:id", verifyToken, getUser)
export default router;
