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
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
const checkRole = (allowedRoles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                const response = {
                    succeeded: false,
                    code: 401,
                    message: "Unauthorized",
                };
                res.status(401).json(response);
                return;
            }
            const user = yield User_1.User.findByPk(userId);
            if (!user || !allowedRoles.includes(user.role)) {
                const response = {
                    succeeded: false,
                    code: 403,
                    message: "Forbidden: only admin can access this endpoint",
                };
                res.status(403).json(response);
                return;
            }
            next();
        }
        catch (error) {
            const response = {
                succeeded: false,
                code: 500,
                message: `Error checking role: ${error.message}`,
            };
            res.status(500).json(response);
        }
    });
};
exports.default = checkRole;
