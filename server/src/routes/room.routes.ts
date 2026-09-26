import { Router } from "express";
import { createRoomSchema, addRoomMemberSchema, updateRoomSchema } from "../validators/room.validator.js";
import { validate } from "../middlewares/validate.middleware.js";
import { addRoomMember, createRoom, deleteRoom, getAllMember, getAllRoom, getRoom, isLive, leaveRoomMember, removeRoomMember, updateRoom } from "../controllers/room.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const roomRouter = Router();

roomRouter.post("/room", authenticate, validate(createRoomSchema), createRoom);
roomRouter.post("/:roomId/members", authenticate, validate(addRoomMemberSchema), addRoomMember);
roomRouter.get("/:roomId/members", authenticate, getAllMember);
roomRouter.patch("/:roomId/isLive", authenticate, isLive);

roomRouter.patch("/:roomId/", validate(updateRoomSchema), authenticate, updateRoom);
roomRouter.delete("/:roomId/", authenticate, deleteRoom);

roomRouter.delete("/:roomId/members/:userId", authenticate, removeRoomMember);
roomRouter.delete("/:roomId/leave", authenticate, leaveRoomMember);

roomRouter.get("/:roomId", authenticate, getRoom);
roomRouter.get("/", authenticate, getAllRoom);

export default roomRouter;