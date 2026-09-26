import { Router } from "express";
import { createRoomSchema, addRoomMemberSchema } from "../validators/room.validator.js";
import { validate } from "../middlewares/validate.middleware.js";
import { addRoomMember, createRoom, getAllMember, getAllRoom, getRoom, isLive, removeRoomMember } from "../controllers/room.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const roomRouter = Router();

roomRouter.post("/room", authenticate, validate(createRoomSchema), createRoom);
roomRouter.post("/:roomId/members", authenticate, validate(addRoomMemberSchema), addRoomMember);
roomRouter.get("/:roomId/members", authenticate, getAllMember);
roomRouter.patch("/:roomId/isLive", authenticate, isLive);

roomRouter.delete("/:roomId/members/:userId", authenticate, removeRoomMember);

roomRouter.get("/:roomId", authenticate, getRoom);
roomRouter.get("/", authenticate, getAllRoom);

export default roomRouter;