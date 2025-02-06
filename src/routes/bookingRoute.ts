import { Router } from "express";
import { bookTicket, getAllBookings } from "../controllers/bookingController";
import  authenticate  from "../middlewares/authenticate";
import checkRole from "../middlewares/checkRoles";

const router = Router();


router.get(
  "/getAllBookings",
  authenticate,
  checkRole(["admin"]),
  getAllBookings
);

router.post("/manage-bookings", authenticate, bookTicket);

export default router;
