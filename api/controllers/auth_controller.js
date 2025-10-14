import User from "../models/user_model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = new User({ username, email, password: hashedPassword });
    try {
        await newUser.save()
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        next(error);
    }
};

export const signin= async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const validUser = await User.findOne({ email});
        if  (!validUser) {
            return next(errorHandler(404, "User not found"));
        }
        const validPassword = bcrypt.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(400, "Invalid password"));
        }
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const { password: pass, ...rest} = validUser._doc;
        res.cookie("access_token", token, { 
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
        })
            .status(200)
            .json(rest);  
    } catch (error) {
        next(error);
    }
};

export const google = async (req, res, next) => {
  try {
    const { name, email, photoURL } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      // Existing user → just sign token and return
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password, ...rest } = user._doc;
      res
        .cookie("access_token", token, { 
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
        })
        .status(200)
        .json(rest);
    } else {
      // Create new user
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).toUpperCase().slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 8);

      const newUser = new User({
        username:
          name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email,
        password: hashedPassword,
        photoURL,
      });

      const savedUser = await newUser.save();
      const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);
      const { password, ...rest } = savedUser._doc;

      res
        .cookie("access_token", token, { 
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
        })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
