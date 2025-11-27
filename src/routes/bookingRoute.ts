import { Router } from "express";
import { bookTicket, getAllBookings } from "../controllers/bookingController";
import authenticate from "../middlewares/authenticate";
import checkRole from "../middlewares/checkRoles";

const router = Router();

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
router.get(
  "/getAllBookings",
  authenticate,
  checkRole(["admin"]),
  getAllBookings
);

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
router.post("/manage-bookings", authenticate, bookTicket);

export default router;
