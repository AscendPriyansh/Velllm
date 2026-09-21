import { Router } from 'express';
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { registerUserSchema, loginUserSchema } from "../validators/auth.validator.js";

const authRouter = Router();

authRouter.post("/register", validate(registerUserSchema), registerUser);
authRouter.post("/login", validate(loginUserSchema), loginUser); 

export default authRouter;