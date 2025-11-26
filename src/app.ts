import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import eventRoutes from "./routes/eventRoutes";
import bookingRoutes from "./routes/bookingRoute";
import userRoutes from "./routes/userRoute";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger-output.json";
import { Request, Response, NextFunction } from "express";

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.static("public"));

// Routes
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes); 
app.use("/api/auth", userRoutes);

// Error handling middleware
interface Error {
  stack?: string;
}

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err.stack);
  res.status(500).send("Something went wrong!");
});

export default app;