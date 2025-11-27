import { Request, Response } from "express";
import { Event } from "../models/Event";
import {
  calculateTotalPages,
  GeneralResponse,
  PageMeta,
} from "../service/response";
import { eventSchema } from "../schemaValidation/validations";


export const createEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { error } = eventSchema.validate(req.body);
  if (error) {
    const errorResponse: GeneralResponse<null> = {
      succeeded: false,
      code: 400,
      message: `Validation failed ${error.details[0].message}`,
    };
    res.status(400).json(errorResponse);
    return;
  }

  const { eventName, eventDate, totalTickets, availableTickets } = req.body;

  try {
    const existingEvent = await Event.findOne({ where: { eventName } });
    if (existingEvent) {
      const errorResponse: GeneralResponse<null> = {
        succeeded: false,
        code: 400,
        message: `Event with the name ${eventName} already exists.`,
      };
      res.status(400).json(errorResponse);
      return;
    }

    const createdBy = req.user?.id;
    if (!createdBy) {
      const errorResponse: GeneralResponse<null> = {
        succeeded: false,
        code: 401,
        message: "Unauthorized",
      };
      res.status(401).json(errorResponse);
      return;
    }

    const event = await Event.create({
      eventName,
      eventDate,
      totalTickets,
      availableTickets,
      createdBy,
    });
    
    const successResponse: GeneralResponse<{
      eventId: number;
      eventName: string;
    }> = {
      succeeded: true,
      code: 200,
      message: "Event created successfully",
      data: { eventId: event.eventId, eventName: event.eventName },
    };
    res.status(200).json(successResponse);
  } catch (error) {
    const errorResponse: GeneralResponse<null> = {
      succeeded: false,
      code: 500,
      message: `Error initializing event ${(error as Error).message}`,
    };
    res.status(500).json(errorResponse);
  }
};

// Get all events
export const getAllEvents = async (
  req: Request,
  res: Response
): Promise<void> => {
  const pageNumber = parseInt(req.query.pageNumber as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;
  try {
    const totalRecords = await Event.count();
    const events = await Event.findAll({
      offset: (pageNumber - 1) * pageSize,
      limit: pageSize,
      order: [["createdAt", "DESC"]],
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
      message: "Fetched all events",
      data: events,
      pageMeta,
      errors: null,
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
