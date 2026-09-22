import { Router } from 'express';
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { registerUserSchema, loginUserSchema } from "../validators/auth.validator.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", validate(registerUserSchema), registerUser);
authRouter.post("/login", validate(loginUserSchema), loginUser);
authRouter.get("/profile", authenticate, (_req, res) => {
    res.status(200).json({
        message: "You accessed a protected route"
    });
});

export default authRouter;