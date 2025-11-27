import { Router } from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  updateUserProfile,
} from "../controllers/authController";
import authenticate from "../middlewares/authenticate";
import checkRole from "../middlewares/checkRoles";

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a new user or admin (single endpoint)
 *     description: |
 *       This endpoint is used to create both **normal users** and **admin users**.
 *       - If `role` is not provided, the default role applied is `"user"`.
 *       - Admin accounts can only be created by users with **admin privileges**.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: example@gmail.com
 *               password:
 *                 type: string
 *                 example: ExamplePassword123
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *                 example: user
 *     responses:
 *       201:
 *         description: User or admin registered successfully
 *       400:
 *         description: Validation error or user already exists
 *       403:
 *         description: Only admins can create other admin accounts
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Log in a user and return a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@gmail.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /api/auth/getAllUsers:
 *   get:
 *     tags: [Authentication]
 *     summary: Get all registered users (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: pageNumber
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *       - name: pageSize
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Paginated list of users returned successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get("/getAllUsers", authenticate, checkRole(["admin"]), getAllUsers);

/**
 * @swagger
 * /api/auth/updateProfile:
 *   put:
 *     tags: [Authentication]
 *     summary: Update user profile details
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: newemail@gmail.com
 *               password:
 *                 type: string
 *                 example: newSecret123
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 */
router.put("/updateProfile", authenticate, updateUserProfile);

export default router;
