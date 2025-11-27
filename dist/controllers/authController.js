"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfile = exports.getAllUsers = exports.loginUser = exports.registerUser = void 0;
const User_1 = require("../models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const response_1 = require("../service/response");
const config_1 = require("../config");
const validations_1 = require("../schemaValidation/validations");
const emailService_1 = require("../service/emailService");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = validations_1.registerSchema.validate(req.body);
    if (error) {
        res.status(400).json({
            succeeded: false,
            code: 400,
            message: `Validation failed: ${error.details[0].message}`,
        });
        return;
    }
    const { email, password, role = User_1.UserRole.USER } = req.body;
    try {
        // Validate role dynamically
        if (!Object.values(User_1.UserRole).includes(role)) {
            res.status(400).json({
                succeeded: false,
                code: 400,
                message: "Invalid role. Allowed values: admin, user",
            });
            return;
        }
        // Check if email exists
        const existingUser = yield User_1.User.findOne({ where: { email } });
        if (existingUser) {
            res.status(400).json({
                succeeded: false,
                code: 400,
                message: "User already exists.",
            });
            return;
        }
        // Hash password
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // Create user with role
        const user = yield User_1.User.create({
            email,
            password: hashedPassword,
            role,
        });
        // Send email based on role
        yield (0, emailService_1.sendEmail)({
            to: email,
            subject: role === User_1.UserRole.ADMIN
                ? "Admin Account Created 👑"
                : "Welcome to Event Bookings 🎉",
            html: role === User_1.UserRole.ADMIN
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
    }
    catch (error) {
        res.status(500).json({
            succeeded: false,
            code: 500,
            message: `Error registering user: ${error.message}`,
        });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = validations_1.loginSchema.validate(req.body);
    if (error) {
        const errorResponse = {
            succeeded: false,
            code: 400,
            message: `Validation failed: ${error.details[0].message}`,
        };
        res.status(400).json(errorResponse);
        return;
    }
    const { email, password } = req.body;
    try {
        const user = yield User_1.User.findOne({ where: { email } });
        if (!user || !(yield bcryptjs_1.default.compare(password, user.password))) {
            const errorResponse = {
                succeeded: false,
                code: 401,
                message: "Invalid email or password.",
            };
            res.status(401).json(errorResponse);
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, config_1.configuration.SECRET_KEY, { expiresIn: "1h" });
        const successResponse = {
            succeeded: true,
            code: 200,
            message: "Login successful!",
            data: {
                token,
                user: { id: user.id, email: user.email, role: user.role },
            },
        };
        res.status(200).json(successResponse);
    }
    catch (error) {
        const errorResponse = {
            succeeded: false,
            code: 500,
            message: `Error logging in: ${error.message}`,
        };
        res.status(500).json(errorResponse);
    }
});
exports.loginUser = loginUser;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    try {
        const totalRecords = yield User_1.User.count();
        const users = yield User_1.User.findAll({
            offset: (pageNumber - 1) * pageSize,
            limit: pageSize,
        });
        const pageMeta = {
            pageNumber,
            pageSize,
            totalRecords,
            totalPages: (0, response_1.calculateTotalPages)(totalRecords, pageSize),
        };
        const pagedResponse = {
            succeeded: true,
            code: 200,
            message: "Fetched all users",
            data: users,
            errors: null,
            pageMeta,
        };
        res.status(200).json(pagedResponse);
    }
    catch (error) {
        const errorResponse = {
            succeeded: false,
            code: 500,
            message: `Error fetching users: ${error.message}`,
            data: null,
            errors: null,
            pageMeta: null,
        };
        res.status(500).json(errorResponse);
    }
});
exports.getAllUsers = getAllUsers;
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { error } = validations_1.updateProfileSchema.validate(req.body);
    if (error) {
        const errorResponse = {
            succeeded: false,
            code: 400,
            message: `Validation failed: ${error.details[0].message}`,
        };
        res.status(400).json(errorResponse);
        return;
    }
    const { email, password } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const user = yield User_1.User.findByPk(userId);
        if (!user) {
            const errorResponse = {
                succeeded: false,
                code: 404,
                message: "User not found",
            };
            res.status(404).json(errorResponse);
            return;
        }
        if (email) {
            console.log(email, 'email addresss-----');
            const existingUser = yield User_1.User.findOne({ where: { email } });
            if (existingUser && existingUser.id !== userId) {
                const errorResponse = {
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
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            user.password = hashedPassword;
        }
        yield user.save();
        const _b = user.get(), { password: _ } = _b, updatedUser = __rest(_b, ["password"]);
        const successResponse = {
            succeeded: true,
            code: 200,
            message: "Profile updated successfully!",
            data: updatedUser,
        };
        res.status(200).json(successResponse);
    }
    catch (error) {
        const errorResponse = {
            succeeded: false,
            code: 500,
            message: `Error updating profile: ${error.message}`,
        };
        res.status(500).json(errorResponse);
    }
});
exports.updateUserProfile = updateUserProfile;
