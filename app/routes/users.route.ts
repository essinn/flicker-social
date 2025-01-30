import express, { RequestHandler } from "express";
import { login, logout, register } from "../controllers/users.controller";
import { isAuthenticated } from "../lib/middleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", isAuthenticated as RequestHandler, logout);

export default router;
