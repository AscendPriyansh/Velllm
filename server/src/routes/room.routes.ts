import { Router } from "express";
import { createRoomSchema } from "../validators/room.validator.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createRoom } from "../controllers/room.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const roomRouter = Router();

roomRouter.post("/room", authenticate, validate(createRoomSchema), createRoom);

export default roomRouter;