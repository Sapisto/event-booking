"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eventController_1 = require("../controllers/eventController");
const checkRoles_1 = __importDefault(require("../middlewares/checkRoles"));
const authenticate_1 = __importDefault(require("../middlewares/authenticate"));
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/events/getAllEvents:
 *   get:
 *     tags: [Events]
 *     parameters:
 *       - name: pageNumber
 *         in: query
 *         required: false
 *       - name: pageSize
 *         in: query
 *         required: false
 *     responses:
 *       200:
 *         description: Fetched all events
 */
router.get('/getAllEvents', eventController_1.getAllEvents);
/**
 * @swagger
 * /api/events/createEvents:
 *   post:
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [eventName, eventDate, totalTickets, availableTickets]
 *             properties:
 *               eventName:
 *                 type: string
 *                 example: Tech Meetup
 *               eventDate:
 *                 type: string
 *                 example: 2025-01-15T14:00:00Z
 *               totalTickets:
 *                 type: integer
 *                 example: 150
 *               availableTickets:
 *                 type: integer
 *                 example: 150
 *     responses:
 *       200:
 *         description: Event created successfully
 *       400:
 *         description: Validation error or event exists
 */
router.post('/createEvents', authenticate_1.default, (0, checkRoles_1.default)(['admin']), eventController_1.createEvent);
exports.default = router;
