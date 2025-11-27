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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const config_1 = require("../config");
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
    if (!token) {
        const errorResponse = {
            succeeded: false,
            code: 401,
            message: "Access denied. No token provided.",
        };
        res.status(401).json(errorResponse);
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.configuration.SECRET_KEY);
        const user = yield User_1.User.findByPk(decoded.id);
        if (!user) {
            const errorResponse = {
                succeeded: false,
                code: 401,
                message: "Invalid token.",
            };
            res.status(401).json(errorResponse);
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        const errorResponse = {
            succeeded: false,
            code: 401,
            message: "Invalid or expired token.",
        };
        res.status(401).json(errorResponse);
        return;
    }
});
exports.default = authenticate;
