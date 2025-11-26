import { Router } from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  updateUserProfile
} from "../controllers/authController";
import  authenticate  from "../middlewares/authenticate";
import checkRole from "../middlewares/checkRoles";

const router = Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.put("/updateProfile", authenticate, updateUserProfile);

router.get("/users", authenticate, checkRole(["admin"]), getAllUsers);

export default router;
