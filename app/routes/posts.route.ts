import express, { RequestHandler } from "express";
import { isAuthenticated } from "../lib/middleware";
import {
  createPost,
  deletePost,
  fetchPostbyId,
  fetchPosts,
  updatePost,
} from "../controllers/posts.controller";

const router = express.Router();

router.get("/posts", fetchPosts);
router.get("/posts/:postId", fetchPostbyId);
router.post("/posts", isAuthenticated as RequestHandler, createPost);
router.put("/posts/:postId", isAuthenticated as RequestHandler, updatePost);
router.delete("/posts/:postId", isAuthenticated as RequestHandler, deletePost);

export default router;
