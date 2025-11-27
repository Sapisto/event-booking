"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = exports.configuration = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const dotenv_1 = __importDefault(require("dotenv"));
const Event_1 = require("./models/Event");
const Booking_1 = require("./models/Booking");
const User_1 = require("./models/User");
dotenv_1.default.config();
exports.configuration = {
    SECRET_KEY: process.env.SECRET_KEY,
    DB_URL: process.env.DB_URL,
};
if (!exports.configuration.SECRET_KEY) {
    throw new Error("SECRET_KEY is not defined in environment variables");
}
exports.sequelize = new sequelize_typescript_1.Sequelize(exports.configuration.DB_URL, {
    dialect: "postgres",
    models: [Event_1.Event, Booking_1.Booking, User_1.User],
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});
