import axios from "axios";

const API_URL =
    "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium"; // Use a conversational model
const API_TOKEN = "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"; // Replace with your Hugging Face API token

export async function getMedicalResponse(message) {
    try {
        const response = await axios.post(
            API_URL, {
                inputs: message,
            }, {
                headers: {
                    Authorization: `Bearer ${API_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching model response:", error);
        throw new Error("Error fetching model response");
    }
}