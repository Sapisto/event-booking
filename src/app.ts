import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import eventRoutes from "./routes/eventRoutes";
import bookingRoutes from "./routes/bookingRoute";
import userRoutes from "./routes/userRoute";

import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

import { Request, Response, NextFunction } from "express";

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static("public"));

// Routes
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", userRoutes);

// -------------------- Simple route --------------------
app.get("/", (req: Request, res: Response) => {
    res.send("Event Booking API is running...");
});

// 🔥 LATEST SWAGGER SETUP

const swaggerOptions = {
  definition: {
    openapi: "3.0.3",        
    info: {
      title: "Event Booking API",
      version: "1.0.0",
      description:
        "API documentation for the Event Booking application.",
      contact: {
        name: "Event Booking Dev Team",
        email: "abdulazeezalasa@.com",
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

const swaggerSpecs = swaggerJsdoc(swaggerOptions);

// Enable latest UI features
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpecs, {
    explorer: true, // Enables file & tag navigation
    swaggerOptions: {
      persistAuthorization: false, // Keeps JWT in Swagger after page refresh in test will be removed later
      displayRequestDuration: true,
      syntaxHighlight: {
        activated: true,
        theme: "obsidian", // Dark theme
      },
      docExpansion: "none", // collapse all sections
    },
    customSiteTitle: "Event Booking API Docs",
  })
);


// GLOBAL ERROR HANDLER

interface Error {
  stack?: string;
}

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err.stack);
  res.status(500).send("Something went wrong!");
});

export default app;
