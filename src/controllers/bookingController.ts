import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import Joi from "joi";
import { Event } from "../models/Event";
import { Booking } from "../models/Booking";
import { sequelize } from "../config";
import {
  calculateTotalPages,
  GeneralResponse,
  PageMeta,
} from "../service/response";
import { sendEmail } from "../service/emailService";
import { User } from "../models/User";
import dayjs from "dayjs";

const bookingSchema = Joi.object({
  eventId: Joi.number().required(),
  ticketsBooked: Joi.number().required().greater(0),
});

// Book a ticket for an event
export const bookTicket = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { error } = bookingSchema.validate(req.body);
  if (error) {
    const errorResponse: GeneralResponse<null> = {
      succeeded: false,
      code: 400,
      message: `Validation failed: ${error.details[0].message}`,
    };
    res.status(400).json(errorResponse);
    return;
  }

  const userId = req.user?.id;
  if (!userId) {
    res
      .status(401)
      .json({ succeeded: false, code: 401, message: "Unauthorized" });
    return;
  }

  const { eventId, ticketsBooked } = req.body;

  const transaction = await sequelize.transaction();

  try {
    const event = await Event.findByPk(eventId, { transaction });
    if (!event) {
      await transaction.rollback();
      const errorResponse: GeneralResponse<null> = {
        succeeded: false,
        code: 404,
        message: "Event not found",
      };
      res.status(404).json(errorResponse);
      return;
    }

    // Ensure enough tickets are available
    if (event.availableTickets < ticketsBooked) {
      await transaction.rollback();
      const errorResponse: GeneralResponse<null> = {
        succeeded: false,
        code: 400,
        message: "Not enough tickets available",
      };
      res.status(400).json(errorResponse);
      return;
    }

    const user = await User.findByPk(userId);
    if (!user) {
      await transaction.rollback();
      res
        .status(404)
        .json({ succeeded: false, code: 404, message: "User not found" });
      return;
    }

    const existingBooking = await Booking.findOne({
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
    } else {
      await Booking.create(
        { id: uuidv4(), eventId, userId, ticketsBooked },
        { transaction }
      );
    }

    await event.update(
      { availableTickets: event.availableTickets - ticketsBooked },
      { transaction }
    );

    await transaction.commit();

    const formattedDate = dayjs(event.eventDate).format('MMMM D, YYYY h:mm A');

    await sendEmail({
      to: user?.email,
      subject: "Your Ticket Booking Confirmation 🎟️",
      html: `
        <div style="padding: 10px; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.5;">
          <h1 style="margin-bottom: 10px;">Booking Confirmation</h1>
          <p>Dear ${user?.email},</p>
          <p>You have successfully booked your ticket(s) for <strong>${
            event?.eventName
          }</strong>.</p>
          <p><strong>Event Date:</strong> ${formattedDate}</p>
          <p><strong>Tickets Booked:</strong> ${ticketsBooked}</p>
          <p style="margin-bottom: 15px;">Thank you for choosing Event Bookings!</p>
          <img src="cid:eventImage" alt="Event Image" style="max-width: 100%; height: auto; display: block; margin: 10px 0;">
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

    const successResponse: GeneralResponse<null> = {
      succeeded: true,
      code: 200,
      message: "Booking successful",
    };
    res.status(200).json(successResponse);
  } catch (error) {
    console.error("Error during booking process:", error);

    await transaction.rollback();
    const errorResponse: GeneralResponse<null> = {
      succeeded: false,
      code: 500,
      message: `Error booking event: ${(error as Error).message}`,
    };
    res.status(500).json(errorResponse);
  }
};

// Get all bookings
export const getAllBookings = async (
  req: Request,
  res: Response
): Promise<void> => {
  const pageNumber = parseInt(req.query.pageNumber as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;

  try {
    const totalRecords = await Booking.count();

    const bookings = await Booking.findAll({
      offset: (pageNumber - 1) * pageSize,
      limit: pageSize,
    });

    const pageMeta: PageMeta = {
      pageNumber,
      pageSize,
      totalRecords,
      totalPages: calculateTotalPages(totalRecords, pageSize),
    };

    const pagedResponse: GeneralResponse<any[]> = {
      succeeded: true,
      code: 200,
      message: "Fetched paginated bookings",
      data: bookings,
      errors: null,
      pageMeta,
    };

    res.status(200).json(pagedResponse);
  } catch (error) {
    const errorResponse = {
      succeeded: false,
      code: 500,
      message: `Error fetching bookings: ${(error as Error).message}`,
      data: null,
      errors: null,
      pageMeta: null,
    };
    res.status(500).json(errorResponse);
  }
};
