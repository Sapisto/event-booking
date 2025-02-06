import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import { GeneralResponse } from "../service/response";

const checkRole = (allowedRoles: string[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
        
      const userId = req.user?.id;
      if (!userId) {
        const response: GeneralResponse<null> = {
          succeeded: false,
          code: 401,
          message: "Unauthorized",
        };
        res.status(401).json(response);
        return;
      }

      const user = await User.findByPk(userId);

      if (!user || !allowedRoles.includes(user.role)) {
        const response: GeneralResponse<null> = {
          succeeded: false,
          code: 403,
          message: "Forbidden: only admin can access this endpoint",
        };
        res.status(403).json(response);
        return;
      }

      next();
    } catch (error) {
      const response: GeneralResponse<null> = {
        succeeded: false,
        code: 500,
        message: `Error checking role: ${(error as Error).message}`,
      };
      res.status(500).json(response);
    }
  };
};

export default checkRole;
