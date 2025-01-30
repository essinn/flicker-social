import { Request, Response } from "express";
import Joi from "joi";
import {
  create_user,
  getToken,
  login_user,
  logout_user,
  setToken,
} from "../models/users.model";

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  bio: Joi.string().max(255).optional(),
  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .min(6)
    .required(),
});

export const register = (req: Request, res: Response): void => {
  const { error } = registerSchema.validate(req.body);

  if (error) {
    res.status(400).json({ error_message: error.details[0].message });
  }

  create_user(req.body, (err: Error, row: any) => {
    if (err)
      return res
        .status(400)
        .json({ error_message: "Error creating user" + err.message });

    return res
      .status(201)
      .json({ message: "User created successfully", user_id: row.userId });
  });
};

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .min(6)
    .required(),
});

export const login = (req: Request, res: Response) => {
  const { error } = loginSchema.validate(req.body);

  if (error) {
    res.status(400).json({ error_message: error.details[0].message });
  }

  login_user(
    req.body.email,
    req.body.password,
    (err: Error | number, id: number) => {
      if (err === 404) {
        return res.status(404).json({ error_message: "User not found" });
      }

      if (err) {
        return res.status(400).json({ error_message: "Error logging in" });
      }

      getToken(id, (err: Error, token: string) => {
        if (err) {
          return res.status(400).json({ error_message: "Error logging in" });
        }

        if (token) {
          return res.status(200).json({ userId: id, sessionToken: token });
        } else {
          setToken(id, (err: Error, token: string) => {
            if (err) {
              return res
                .status(400)
                .json({ error_message: "Error logging in" });
            }

            return res.status(200).json({ userId: id, sessionToken: token });
          });
        }
      });
    }
  );
};

export const logout = (req: Request, res: Response): void => {
  const token = req.get("Authorization");

  if (!token) {
    res.status(400).json({ error_message: "User must have a valid token" });
  }

  logout_user(token, (err: Error) => {
    if (err) {
      return res.status(400).json({ error_message: "Error logging out" });
    }

    return res.status(200).json({ message: "User logged out successfully" });
  });
};
