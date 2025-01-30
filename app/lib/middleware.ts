import { Request, Response, NextFunction } from "express";
import { getTokenById } from "../models/users.model";

interface AuthenticatedRequest extends Request {
  userId?: number;
}

export const isAuthenticated = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.get("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ error_message: "User must have a valid token" });
  }

  getTokenById(token, (err: Error, userId: number) => {
    if (err) {
      return res.status(500).json({ error_message: "Server error" });
    }

    if (!userId) {
      return res
        .status(401)
        .json({ error_message: "Invalid or expired session token" });
    }

    req.userId = userId;
    next();
  });
};
