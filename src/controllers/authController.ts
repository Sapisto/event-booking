import { Request, Response } from "express";
import { User, UserRole } from "../models/User";
import { GeneralResponse, PageMeta } from "../service/response";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { calculateTotalPages } from "../service/response";
import { configuration } from "../config";
import { AuthRequest } from "../middlewares/authenticate";
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
} from "../schemaValidation/validations";
import { sendEmail } from "../service/emailService";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    res.status(400).json({
      succeeded: false,
      code: 400,
      message: `Validation failed: ${error.details[0].message}`,
    });
    return;
  }

  const { email, password, role = UserRole.USER } = req.body;

  try {
    // Validate role dynamically
    if (!Object.values(UserRole).includes(role)) {
      res.status(400).json({
        succeeded: false,
        code: 400,
        message: "Invalid role. Allowed values: admin, user",
      });
      return;
    }

    // Check if email exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({
        succeeded: false,
        code: 400,
        message: "User already exists.",
      });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with role
    const user = await User.create({
      email,
      password: hashedPassword,
      role,
    });

    // Send email based on role
    await sendEmail({
      to: email,
      subject:
        role === UserRole.ADMIN
          ? "Admin Account Created 👑"
          : "Welcome to Event Bookings 🎉",
      html:
        role === UserRole.ADMIN
          ? `<h1>Admin Account Created</h1>
             <p>Your admin account has been created successfully.</p>`
          : `<h1>Welcome to Event Bookings</h1>
             <p>Thank you for signing up! We are excited to have you onboard.</p>`,
    });

    res.status(201).json({
      succeeded: true,
      code: 201,
      message: `${role} registered successfully!`,
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      succeeded: false,
      code: 500,
      message: `Error registering user: ${(error as Error).message}`,
    });
  }
};


export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    const errorResponse: GeneralResponse<null> = {
      succeeded: false,
      code: 400,
      message: `Validation failed: ${error.details[0].message}`,
    };
    res.status(400).json(errorResponse);
    return;
  }

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      const errorResponse: GeneralResponse<null> = {
        succeeded: false,
        code: 401,
        message: "Invalid email or password.",
      };
      res.status(401).json(errorResponse);
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      configuration.SECRET_KEY,
      { expiresIn: "1h" }
    );

    const successResponse: GeneralResponse<{
      token: string;
      user: { id: string; email: string; role: string };
    }> = {
      succeeded: true,
      code: 200,
      message: "Login successful!",
      data: {
        token,
        user: { id: user.id, email: user.email, role: user.role },
      },
    };
    res.status(200).json(successResponse);
  } catch (error) {
    const errorResponse: GeneralResponse<null> = {
      succeeded: false,
      code: 500,
      message: `Error logging in: ${(error as Error).message}`,
    };
    res.status(500).json(errorResponse);
  }
};

export const getAllUsers = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const pageNumber = parseInt(req.query.pageNumber as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;

  try {
    const totalRecords = await User.count();
    const users = await User.findAll({
      offset: (pageNumber - 1) * pageSize,
      limit: pageSize,
    });

    const pageMeta: PageMeta = {
      pageNumber,
      pageSize,
      totalRecords,
      totalPages: calculateTotalPages(totalRecords, pageSize),
    };

    const pagedResponse: GeneralResponse<any[]> = {
      succeeded: true,
      code: 200,
      message: "Fetched all users",
      data: users,
      errors: null,
      pageMeta,
    };

    res.status(200).json(pagedResponse);
  } catch (error) {
    const errorResponse = {
      succeeded: false,
      code: 500,
      message: `Error fetching users: ${(error as Error).message}`,
      data: null,
      errors: null,
      pageMeta: null,
    };
    res.status(500).json(errorResponse);
  }
};
export const updateUserProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { error } = updateProfileSchema.validate(req.body);
  if (error) {
    const errorResponse: GeneralResponse<null> = {
      succeeded: false,
      code: 400,
      message: `Validation failed: ${error.details[0].message}`,
    };
    res.status(400).json(errorResponse);
    return;
  }

  const { email, password } = req.body;
  const userId = req.user?.id;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      const errorResponse: GeneralResponse<null> = {
        succeeded: false,
        code: 404,
        message: "User not found",
      };
      res.status(404).json(errorResponse);
      return;
    }

    if (email) {
      console.log(email, 'email addresss-----');
       
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser && existingUser.id !== userId) {
        const errorResponse: GeneralResponse<null> = {
          succeeded: false,
          code: 409, 
          message: "Email is already in use by another user",
        };
        res.status(409).json(errorResponse);
        return;
      }
      user.email = email;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    const { password: _, ...updatedUser } = user.get();

    const successResponse: GeneralResponse<any> = {
      succeeded: true,
      code: 200,
      message: "Profile updated successfully!",
      data: updatedUser,
    };
    res.status(200).json(successResponse);
  } catch (error) {
    const errorResponse: GeneralResponse<null> = {
      succeeded: false,
      code: 500,
      message: `Error updating profile: ${(error as Error).message}`,
    };
    res.status(500).json(errorResponse);
  }
};
