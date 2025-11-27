import { Router } from 'express';
import { createEvent, getAllEvents } from '../controllers/eventController';
import checkRole from '../middlewares/checkRoles';
import authenticate from '../middlewares/authenticate';

const router = Router();

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
router.get('/getAllEvents', getAllEvents);

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
router.post('/createEvents', authenticate, checkRole(['admin']), createEvent);

export default router;
