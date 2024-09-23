import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
    userId: {
        type: String, // Store user ID or username
        required: true,
    },
    userMessage: {
        type: String,
        required: true,
    },
    botReply: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Interaction = mongoose.model("Chat", ChatSchema);

export default Interaction;