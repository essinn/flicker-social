import { Request, Response } from "express";
import {
  fetch_posts,
  fetch_post_by_id,
  create_post,
  update_post,
  delete_post,
} from "../models/posts.model";
import Joi from "joi";
import { getTokenById } from "../models/users.model";

interface UserRequest extends Request {
  userId?: number;
}

export const fetchPosts = (req: Request, res: Response) => {
  fetch_posts(req.body, (err: Error, row: any) => {
    if (err)
      return res
        .status(400)
        .json({ error_message: "Failed to fetch posts", err });

    if (!row || row.length === 0) {
      return res.status(404).json({ error_message: "No posts found" });
    }

    return res
      .status(200)
      .json({ message: "Successfully featched posts", row });
  });
};

const postByIdSchema = Joi.object({
  postId: Joi.number().required(),
});

export const fetchPostbyId = (req: Request, res: Response): void => {
  const { error } = postByIdSchema.validate(req.params);

  if (error) {
    res.status(400).json({ error_message: error.details[0].message });
  }

  fetch_post_by_id(req.params.postId, (err: Error, row: any) => {
    if (err)
      return res
        .status(400)
        .json({ error_message: "Failed to fetch post", err });

    if (!row) {
      return res.status(404).json({ error_message: "No posts found" });
    }

    return res.status(200).json({ message: "Successfully featched post", row });
  });
};

const createPostSchema = Joi.object({
  imageUrl: Joi.string().optional(),
  caption: Joi.string().max(255).optional(),
});

export const createPost = (req: Request, res: Response): void => {
  const { error } = createPostSchema.validate(req.body);

  if (error) {
    res.status(400).json({ error_message: error.details[0].message });
    return;
  }

  const token: string | undefined = req.get("Authorization");

  if (!token) {
    res.status(401).json({ error_message: "No token provided" });
    return;
  }

  getTokenById(token, (err: Error | null, userId?: number) => {
    if (err || !userId) {
      return res.status(401).json({ error_message: "Invalid token" });
    }

    create_post(req.body, userId, (err: Error | null, row?: any) => {
      if (err) {
        return res
          .status(400)
          .json({ error_message: "Failed to create post", error: err.message });
      }

      return res
        .status(201)
        .json({ message: "Successfully created post", post: row });
    });
  });
};

const updatePostSchema = Joi.object({
  imageUrl: Joi.string().optional(),
  caption: Joi.string().max(255).optional(),
});

export const updatePost = (req: UserRequest, res: Response): void => {
  const { error } = updatePostSchema.validate(req.body);

  if (error) {
    res.status(400).json({ error_message: error.details[0].message });
  }

  const userId = req.userId;

  fetch_post_by_id(req.params.postId, (err: Error, row: any) => {
    if (err)
      return res
        .status(400)
        .json({ error_message: "Failed to fetch post", err });

    if (!row) {
      return res.status(404).json({ error_message: "Post with id not found" });
    }

    if (row.userId !== userId) {
      return res
        .status(403)
        .json({ error_message: "You are not authorized to update" });
    }

    update_post(
      { ...req.body, postId: req.params.postId },
      (err: Error, row: any) => {
        if (err)
          return res
            .status(400)
            .json({ error_message: "Failed to update post", err });

        return res
          .status(200)
          .json({ message: "Successfully updated post", row });
      }
    );
  });
};

const deletePostSchema = Joi.object({
  postId: Joi.number().required(),
});

export const deletePost = (req: UserRequest, res: Response): void => {
  const { error } = deletePostSchema.validate(req.params);

  if (error) {
    res.status(400).json({ error_message: error.details[0].message });
  }

  const userId = req.userId;

  fetch_post_by_id(req.params.postId, (err: Error, row: any) => {
    if (err)
      return res
        .status(400)
        .json({ error_message: "Failed to fetch post", err });

    if (!row) {
      return res.status(404).json({ error_message: "Post with id not found" });
    }

    if (row.userId !== userId) {
      return res
        .status(403)
        .json({ error_message: "You are not authorized to delete" });
    }

    delete_post(req.params.postId, (err: Error, row: any) => {
      if (err) {
        return res
          .status(400)
          .json({ error_message: "Failed to delete post", err });
      }

      return res
        .status(200)
        .json({ message: "Successfully deleted post", row });
    });
  });
};
