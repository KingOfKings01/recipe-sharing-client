import express from "express";
import { loginUser, SignInUser } from "../controllers/authControllers.js";

const router = express.Router();

// Route for user registration
router.post("/sign-in", SignInUser);

// Route for user login
router.post("/login", loginUser)

export default router;;