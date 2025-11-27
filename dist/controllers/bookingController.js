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
exports.getAllBookings = exports.bookTicket = void 0;
const uuid_1 = require("uuid");
const Event_1 = require("../models/Event");
const Booking_1 = require("../models/Booking");
const config_1 = require("../config");
const response_1 = require("../service/response");
const emailService_1 = require("../service/emailService");
const User_1 = require("../models/User");
const dayjs_1 = __importDefault(require("dayjs"));
const validations_1 = require("../schemaValidation/validations");
// Book a ticket for an event
const bookTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { error } = validations_1.bookingSchema.validate(req.body);
    if (error) {
        const errorResponse = {
            succeeded: false,
            code: 400,
            message: `Validation failed: ${error.details[0].message}`,
        };
        res.status(400).json(errorResponse);
        return;
    }
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        res
            .status(401)
            .json({ succeeded: false, code: 401, message: "Unauthorized" });
        return;
    }
    const { eventId, ticketsBooked } = req.body;
    const transaction = yield config_1.sequelize.transaction();
    try {
        const event = yield Event_1.Event.findByPk(eventId, { transaction });
        if (!event) {
            yield transaction.rollback();
            const errorResponse = {
                succeeded: false,
                code: 404,
                message: "Event not found",
            };
            res.status(404).json(errorResponse);
            return;
        }
        // Ensure enough tickets are available
        if (event.availableTickets < ticketsBooked) {
            yield transaction.rollback();
            const errorResponse = {
                succeeded: false,
                code: 400,
                message: "Not enough tickets available",
            };
            res.status(400).json(errorResponse);
            return;
        }
        const user = yield User_1.User.findByPk(userId);
        if (!user) {
            yield transaction.rollback();
            res
                .status(404)
                .json({ succeeded: false, code: 404, message: "User not found" });
            return;
        }
        const existingBooking = yield Booking_1.Booking.findOne({
            where: { userId, eventId },
            transaction,
        });
        if (existingBooking) {
            res.status(400).json({
                succeeded: false,
                code: 400,
                message: "You have already booked tickets for this event.",
            });
            return;
        }
        else {
            yield Booking_1.Booking.create({ id: (0, uuid_1.v4)(), eventId, userId, ticketsBooked }, { transaction });
        }
        yield event.update({ availableTickets: event.availableTickets - ticketsBooked }, { transaction });
        yield transaction.commit();
        const formattedDate = (0, dayjs_1.default)(event.eventDate).format("MMMM D, YYYY h:mm A");
        yield (0, emailService_1.sendEmail)({
            to: user === null || user === void 0 ? void 0 : user.email,
            subject: "Your Ticket Booking Confirmation 🎟️",
            html: `
        <div style="padding: 10px; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.5;">
          <h1 style="margin-bottom: 10px;">Booking Confirmation</h1>
          <p>Dear ${user === null || user === void 0 ? void 0 : user.email},</p>
          <p>You have successfully booked your ticket(s) for <strong>${event === null || event === void 0 ? void 0 : event.eventName}</strong>.</p>
          <p><strong>Event Date:</strong> ${formattedDate}</p>
          <p><strong>Tickets Booked:</strong> ${ticketsBooked}</p>
          <p style="margin-bottom: 15px;">Thank you for choosing Event Bookings!</p>
           <a href="https://autox.aff.ng/event/${event === null || event === void 0 ? void 0 : event.id}" target="_blank">
             <img src="cid:eventImage" alt="Event Image" style="max-width: 100%; height: auto; display: block; margin: 10px 0;">
          </a>
        </div>
      `,
            attachments: [
                {
                    filename: "reg.jpg",
                    path: "./public/reg.jpg",
                    cid: "eventImage",
                },
            ],
        });
        const successResponse = {
            succeeded: true,
            code: 200,
            message: "Booking successful",
        };
        res.status(200).json(successResponse);
    }
    catch (error) {
        console.error("Error during booking process:", error);
        yield transaction.rollback();
        const errorResponse = {
            succeeded: false,
            code: 500,
            message: `Error booking event: ${error.message}`,
        };
        res.status(500).json(errorResponse);
    }
});
exports.bookTicket = bookTicket;
// Get all bookings
const getAllBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    try {
        const totalRecords = yield Booking_1.Booking.count();
        const bookings = yield Booking_1.Booking.findAll({
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
            message: "Fetched All bookings",
            data: bookings,
            errors: null,
            pageMeta,
        };
        res.status(200).json(pagedResponse);
    }
    catch (error) {
        const errorResponse = {
            succeeded: false,
            code: 500,
            message: `Error fetching bookings: ${error.message}`,
            data: null,
            errors: null,
            pageMeta: null,
        };
        res.status(500).json(errorResponse);
    }
});
exports.getAllBookings = getAllBookings;
