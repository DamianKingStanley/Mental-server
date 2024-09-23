import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import axios from "axios";
import userRoute from "./routes/userRoute.js";
import chatRoute from "./routes/chatRoute.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Chat from "./models/chat.js";

dotenv.config();
const app = express();

// Retrieve the API key from environment variables
const api_key = process.env.HUGGINGFACE_API_KEY;
const model_name = "mistralai/Mistral-7B-Instruct-v0.2";
const api_url = `https://api-inference.huggingface.co/models/${model_name}`;

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Middlewares
app.use(morgan("dev"));
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

const PORT = process.env.PORT || 5000;
const MONGODB_URL = process.env.MONGODB_URL;

mongoose
    .connect(MONGODB_URL)
    .then(() =>
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
    )
    .catch((error) => console.error("Failed to connect to MongoDB:", error));

app.get("/", (req, res) => {
    res.json({ message: "Welcome" });
});

// app.post("/api/chat", async(req, res) => {
//     const userInput = req.body.input;

//     if (!userInput) {
//         return res.status(400).json({ error: "Input is required" });
//     }

//     try {
//         const response = await axios.post(
//             api_url, {
//                 inputs: userInput,
//                 options: { use_cache: false },
//             }, {
//                 headers: {
//                     Authorization: `Bearer ${api_key}`,
//                 },
//             }
//         );

//         console.log("Full response from API:", response.data); // Log full response
//         const generatedText =
//             response.data[0] ? .generated_text || "No response text found";

//         console.log("Generated text to send to frontend:", generatedText); // Log the text being sent
//         res.json({ generated_text: generatedText });
//     } catch (error) {
//         console.error("Backend error:", error); // Log error details
//         res
//             .status(error.response ? error.response.status : 500)
//             .json({ error: error.message });
//     }
// });

// Chat route to interact with Generative AI
app.post("/chat", async(req, res) => {
    const { message, userId } = req.body;

    if (!message || !userId) {
        return res.status(400).json({ error: "Message and User ID are required" });
    }
    try {
        // Generate content based on the message
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = await response.text();

        // Record the conversation in your database
        await Chat.create({
            userId: userId,
            userMessage: message,
            botReply: text,
        });

        res.json({ reply: text });
    } catch (error) {
        console.error("Error communicating with Generative AI:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/conversations/:userId", async(req, res) => {
    const { userId } = req.params;

    try {
        const conversations = await Chat.find({ userId: userId }).sort({
            createdAt: 1,
        });
        res.json(conversations);
    } catch (error) {
        console.error("Error fetching user conversations:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.use("/", userRoute);
app.use("/", chatRoute);