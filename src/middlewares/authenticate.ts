import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { configuration } from "../config";
import { GeneralResponse } from "../service/response";

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    const errorResponse: GeneralResponse<null> = {
      succeeded: false,
      code: 401,
      message: "Access denied, Unauthenticated.",
      errors: ["Authentication token is missing."],
    };
    res.status(401).json(errorResponse);
    return;
  }

  try {
    const decoded = jwt.verify(token, configuration.SECRET_KEY) as {
      id: string;
    };
    const user = await User.findByPk(decoded.id);

    if (!user) {
      const errorResponse: GeneralResponse<null> = {
        succeeded: false,
        code: 401,
        message: "Invalid token.",
      };

      res.status(401).json(errorResponse);
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    const errorResponse: GeneralResponse<null> = {
      succeeded: false,
      code: 401,
      message: "Invalid or expired token.",
    };
    res.status(401).json(errorResponse);
    return;
  }
};

export default authenticate;
