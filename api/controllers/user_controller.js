import bcryptjs from "bcryptjs";
import User from "../models/user_model.js";
import { errorHandler } from "../utils/error.js";
import Listing from "../models/listing_model.js";

export const test = (req, res) => {
  res.json({ message: "User route is working!" });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You are not allowed to update this user!"));
  }
  try {
    const updateData = {
      username: req.body.username,
      email: req.body.email,
    };

    if (req.file) {
      updateData.photoURL = `/uploads/${req.file.filename}`;
    }

    if (req.body.password) {
      updateData.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can only delete your own account!"));
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token", { path: "/" });
    return res.status(200).json({ message: "User has been deleted!" });
  } catch (error) {
    next(error);
  }
};

export const signOut = (req, res, next) => {
  try {
    res.clearCookie("access_token", { path: "/" });
    return res.status(200).json({ message: "User has been signed out!" });
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      return res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  }else{
    return next(errorHandler(401, "You can only view your own listings!"));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(errorHandler(404, "User not found!"));
    }
    const { password: pass, ...rest } = user._doc;
    return res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
