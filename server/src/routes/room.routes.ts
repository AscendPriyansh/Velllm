import { Router } from "express";
import { createRoomSchema, addRoomMemberSchema } from "../validators/room.validator.js";
import { validate } from "../middlewares/validate.middleware.js";
import { addRoomMember, createRoom } from "../controllers/room.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const roomRouter = Router();

roomRouter.post("/room", authenticate, validate(createRoomSchema), createRoom);
roomRouter.post("/:roomId/members", authenticate, validate(addRoomMemberSchema), addRoomMember);

export default roomRouter;