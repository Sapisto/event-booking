import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import { Event } from "./models/Event";
import { Booking } from "./models/Booking";
import { User } from "./models/User";

dotenv.config();

export const configuration = {
  SECRET_KEY: process.env.SECRET_KEY as string,
  DB_URL: process.env.DB_URL as string,
};

if (!configuration.SECRET_KEY) {
  throw new Error("SECRET_KEY is not defined in environment variables");
}

export const sequelize = new Sequelize(configuration.DB_URL, {
  dialect: "postgres",
  models: [Event, Booking, User],
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});
