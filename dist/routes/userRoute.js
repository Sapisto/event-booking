"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authenticate_1 = __importDefault(require("../middlewares/authenticate"));
const checkRoles_1 = __importDefault(require("../middlewares/checkRoles"));
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Authentication]
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
router.post("/register", authController_1.registerUser);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Authentication]
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
router.post("/login", authController_1.loginUser);
/**
 * @swagger
 * /api/auth/getAllUsers:
 *   get:
 *     tags: [Authentication]
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
router.get("/getAllUsers", authenticate_1.default, (0, checkRoles_1.default)(["admin"]), authController_1.getAllUsers);
/**
 * @swagger
 * /api/auth/updateProfile:
 *   put:
 *     tags: [Authentication]
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
router.put("/updateProfile", authenticate_1.default, authController_1.updateUserProfile);
exports.default = router;
