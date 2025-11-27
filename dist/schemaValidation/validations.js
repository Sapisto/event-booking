"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingSchema = exports.eventSchema = exports.updateProfileSchema = exports.loginSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.registerSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required(),
});
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
});
exports.updateProfileSchema = joi_1.default.object({
    email: joi_1.default.string().email().optional(),
    name: joi_1.default.string().min(3).max(50).optional(),
    password: joi_1.default.string().min(6).optional(),
});
exports.eventSchema = joi_1.default.object({
    eventName: joi_1.default.string().required(),
    eventDate: joi_1.default.date().min("now").required(),
    totalTickets: joi_1.default.number().integer().min(1).required(),
    availableTickets: joi_1.default.number().integer().min(0).required(),
});
exports.bookingSchema = joi_1.default.object({
    eventId: joi_1.default.number().required(),
    ticketsBooked: joi_1.default.number().required().greater(0),
});
