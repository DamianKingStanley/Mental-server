import express from "express";

const router = express.Router();
import { chatBot } from "../controllers/chatController.js";

router.post("/chatbot", chatBot);

export default router;