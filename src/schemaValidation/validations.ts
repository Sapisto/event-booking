import Joi from "joi";

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("admin", "user").optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const updateProfileSchema = Joi.object({
  email: Joi.string().email().optional(),
  name: Joi.string().min(3).max(50).optional(),
  password: Joi.string().min(6).optional(),
});

export const eventSchema = Joi.object({
  eventName: Joi.string().required(),
  eventDate: Joi.date().min("now").required(),
  totalTickets: Joi.number().integer().min(1).required(),
  availableTickets: Joi.number().integer().min(0).required(),
});

export const bookingSchema = Joi.object({
  eventId: Joi.number().required(),
  ticketsBooked: Joi.number().required().greater(0),
});