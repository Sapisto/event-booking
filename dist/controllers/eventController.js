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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllEvents = exports.createEvent = void 0;
const Event_1 = require("../models/Event");
const response_1 = require("../service/response");
const validations_1 = require("../schemaValidation/validations");
const createEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { error } = validations_1.eventSchema.validate(req.body);
    if (error) {
        const errorResponse = {
            succeeded: false,
            code: 400,
            message: `Validation failed ${error.details[0].message}`,
        };
        res.status(400).json(errorResponse);
        return;
    }
    const { eventName, eventDate, totalTickets, availableTickets } = req.body;
    try {
        const existingEvent = yield Event_1.Event.findOne({ where: { eventName } });
        if (existingEvent) {
            const errorResponse = {
                succeeded: false,
                code: 400,
                message: `Event with the name ${eventName} already exists.`,
            };
            res.status(400).json(errorResponse);
            return;
        }
        const createdBy = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!createdBy) {
            const errorResponse = {
                succeeded: false,
                code: 401,
                message: "Unauthorized",
            };
            res.status(401).json(errorResponse);
            return;
        }
        const event = yield Event_1.Event.create({
            eventName,
            eventDate,
            totalTickets,
            availableTickets,
            createdBy,
        });
        const successResponse = {
            succeeded: true,
            code: 200,
            message: "Event created successfully",
            data: { eventId: event.eventId, eventName: event.eventName },
        };
        res.status(200).json(successResponse);
    }
    catch (error) {
        const errorResponse = {
            succeeded: false,
            code: 500,
            message: `Error initializing event ${error.message}`,
        };
        res.status(500).json(errorResponse);
    }
});
exports.createEvent = createEvent;
// Get all events
const getAllEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    try {
        const totalRecords = yield Event_1.Event.count();
        const events = yield Event_1.Event.findAll({
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
            message: "Fetched all events",
            data: events,
            pageMeta,
            errors: null,
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
exports.getAllEvents = getAllEvents;
