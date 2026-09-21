import { Router } from 'express';
import { registerUser } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { registerUserSchema } from "../validators/auth.validator.js";

const authRouter = Router();

authRouter.post("/register", validate(registerUserSchema), registerUser);

export default authRouter;