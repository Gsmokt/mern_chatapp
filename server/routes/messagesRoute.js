import express from "express";
import {
  newMessage,
  getConversation,
  updateMessage,
  deleteMessage,
} from "../controllers/messagesControllers.js";
const router = express.Router();

router.post("/new/:id", newMessage);
router.get("/sync/:id", getConversation);
router.patch("/:id", updateMessage);
router.patch("/:id/delete", deleteMessage);

export default router;
