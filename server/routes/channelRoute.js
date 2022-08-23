import express from "express";
import {
  getChannelList,
  newChannel,
  deleteChannel,
} from "../controllers/messagesControllers.js";
const router = express.Router();

router.post("/new", newChannel);
router.get("/sync", getChannelList);
router.delete("/:id", deleteChannel);

export default router;
