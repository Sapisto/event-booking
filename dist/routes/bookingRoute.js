"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookingController_1 = require("../controllers/bookingController");
const authenticate_1 = __importDefault(require("../middlewares/authenticate"));
const checkRoles_1 = __importDefault(require("../middlewares/checkRoles"));
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/bookings/getAllBookings:
 *   get:
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: pageNumber
 *         in: query
 *       - name: pageSize
 *         in: query
 *     responses:
 *       200:
 *         description: Fetched all bookings
 *       401:
 *         description: Unauthorized
 */
router.get("/getAllBookings", authenticate_1.default, (0, checkRoles_1.default)(["admin"]), bookingController_1.getAllBookings);
/**
 * @swagger
 * /api/bookings/manage-bookings:
 *   post:
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [eventId, ticketsBooked]
 *             properties:
 *               eventId:
 *                 type: string
 *                 example: "a5d7c82e-98d1-4b6c-aa27"
 *               ticketsBooked:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Booking successful
 *       400:
 *         description: Not enough tickets or already booked
 *       404:
 *         description: Event or user not found
 */
router.post("/manage-bookings", authenticate_1.default, bookingController_1.bookTicket);
exports.default = router;
