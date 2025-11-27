"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const eventRoutes_1 = __importDefault(require("./routes/eventRoutes"));
const bookingRoute_1 = __importDefault(require("./routes/bookingRoute"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.static("public"));
// Routes
app.use("/api/events", eventRoutes_1.default);
app.use("/api/bookings", bookingRoute_1.default);
app.use("/api/auth", userRoute_1.default);
// =======================
// 🔥 LATEST SWAGGER SETUP
// =======================
const swaggerOptions = {
    definition: {
        openapi: "3.0.3", // Updated to latest stable OpenAPI version
        info: {
            title: "Event Booking API",
            version: "1.0.0",
            description: "API documentation for the Event Booking application.",
            contact: {
                name: "Event Booking Dev Team",
                email: "support@eventbookings.com",
            },
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    // Auto-load your TS route files with @swagger comments
    apis: ["./src/routes/*.ts"],
};
const swaggerSpecs = (0, swagger_jsdoc_1.default)(swaggerOptions);
// Enable latest UI features
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpecs, {
    explorer: true, // Enables file & tag navigation
    swaggerOptions: {
        persistAuthorization: true, // Keeps JWT in Swagger after page refresh
        displayRequestDuration: true,
        syntaxHighlight: {
            activated: true,
            theme: "obsidian", // Dark theme
        },
        docExpansion: "none", // collapse all sections
    },
    customSiteTitle: "Event Booking API Docs",
}));
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send("Something went wrong!");
});
exports.default = app;
