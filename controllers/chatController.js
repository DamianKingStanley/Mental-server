import Interaction from "../models/chat.js";
import dotenv from "dotenv";
import { HfInference } from "@huggingface/inference";
import rateLimit from "express-rate-limit";
import axios from "axios";

import express from "express";

const router = express.Router();
dotenv.config();
const hf = new HfInference(process.env.HUGGING_FACE_API_KEY);

const MAX_TOKENS = 1024;
const MAX_NEW_TOKENS = 50;

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    message: "Too many requests, please try again later.",
});

router.use(limiter);

export const chatBot = async(req, res) => {
    const { input_text } = req.body;

    try {
        const response = await axios.post("http://127.0.0.1:5000/chat", {
            input_text,
        });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error communicating with the chatbot API" });
    }
};

// export const chatBot = async(req, res) => {
//     try {
//         const { message, userId } = req.body;

//         // Fetch previous interactions
//         const previousInteractions = await Interaction.find({ userId }).sort({
//             timestamp: 1,
//         });

//         // Create a conversation history
//         let conversationHistory = "";
//         previousInteractions.forEach((interaction) => {
//             conversationHistory += `User: ${interaction.userMessage}\nBot: ${interaction.botResponse}\n`;
//         });
//         conversationHistory += `User: ${message}\nBot:`;

//         // Call Hugging Face API
//         // const response = await axios.post(
//         //     "https://api-inference.huggingface.co/models/openai-community/gpt2", {
//         //         inputs: conversationHistory,
//         //     }, {
//         //         headers: {
//         //             Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
//         //         },
//         //     }
//         // );
//         const conversationTokens = conversationHistory.split(" ").length;

//         // Trim conversation history if it exceeds the maximum token limit
//         while (
//             conversationTokens + message.split(" ").length + MAX_NEW_TOKENS >
//             MAX_TOKENS
//         ) {
//             const firstNewLineIndex = conversationHistory.indexOf("\n");
//             conversationHistory = conversationHistory.slice(firstNewLineIndex + 1);
//         }

//         // Call Hugging Face API
//         const response = await hf.textGeneration({
//             model: "openai-community/gpt2", // Model ID from the JSON snippet
//             inputs: conversationHistory,
//             parameters: { max_new_tokens: MAX_NEW_TOKENS },
//         });

//         const botResponse = response.data.generated_text;

//         // Save the interaction
//         const interaction = new Interaction({
//             userId,
//             userMessage: message,
//             botResponse,
//         });

//         await interaction.save();

//         res.json({ botResponse });
//     } catch (error) {
//         console.error("Error handling chat request:", error);

//         if (error.message.includes("Rate limit reached")) {
//             res
//                 .status(429)
//                 .json({ error: "Rate limit reached. Please try again later." });
//         } else {
//             res.status(500).json({ error: "Internal server error" });
//         }
//     }
// };

// Mock function to generate bot response, replace with actual logic
// const generateBotResponse = (message) => {
//     const lowerMessage = message.toLowerCase();

//     if (lowerMessage.includes("stress")) {
//         return "It seems you are feeling stressed. Here are some tips to manage stress: Take regular breaks, practice mindfulness, exercise, and ensure you're getting enough sleep. It might also help to talk to a counselor or therapist.";
//     } else if (lowerMessage.includes("anxiety")) {
//         return "Dealing with anxiety can be tough. Here are some resources that might help: Practice deep breathing exercises, consider talking to a mental health professional, and try to stay organized to reduce stress. Mindfulness and relaxation techniques can also be beneficial.";
//     } else if (lowerMessage.includes("sleep")) {
//         return "Struggling with sleep due to academic pressure is common. Try to establish a regular sleep schedule, avoid caffeine and screens before bedtime, and create a calming bedtime routine. If sleep issues persist, consider seeking help from a healthcare provider.";
//     } else if (
//         lowerMessage.includes("lonely") ||
//         lowerMessage.includes("isolation")
//     ) {
//         return "Feeling lonely or isolated can be challenging. Try to connect with others through campus activities, join student groups or clubs, and consider reaching out to a counselor for support. Building a strong social network can make a big difference.";
//     } else if (
//         lowerMessage.includes("balance") &&
//         (lowerMessage.includes("studies") || lowerMessage.includes("life"))
//     ) {
//         return "Balancing studies and personal life can be tough. Create a structured schedule, set realistic goals, and make time for self-care and relaxation. Prioritizing tasks and managing your time effectively can help maintain this balance.";
//     } else if (lowerMessage.includes("grades")) {
//         return "Worrying about grades is common. Focus on effective study habits, seek help from professors or tutors if needed, and remember that grades are just one part of your academic journey. Managing stress and maintaining a positive mindset are also important.";
//     } else if (
//         lowerMessage.includes("test anxiety") ||
//         lowerMessage.includes("exam anxiety")
//     ) {
//         return "Managing test anxiety involves preparation and relaxation techniques. Practice mock exams, develop a study plan, and try techniques like deep breathing or visualization to calm your nerves before the test.";
//     } else if (
//         lowerMessage.includes("falling behind") ||
//         lowerMessage.includes("struggling with")
//     ) {
//         return "If you feel like you're falling behind, assess your study habits and seek support from professors or academic advisors. Prioritizing tasks, setting achievable goals, and using campus resources can help you get back on track.";
//     } else if (lowerMessage.includes("focus")) {
//         return "Improving focus involves creating a distraction-free study environment, breaking tasks into smaller chunks, and using techniques like the Pomodoro Technique. Regular breaks and staying organized can also enhance concentration.";
//     } else if (lowerMessage.includes("procrastination")) {
//         return "To overcome procrastination, set clear goals, create a schedule, and break tasks into smaller, manageable steps. Using productivity techniques and rewarding yourself for completing tasks can also help.";
//     } else if (
//         lowerMessage.includes("depressed") ||
//         lowerMessage.includes("unmotivated")
//     ) {
//         return "If you're feeling depressed or unmotivated, consider talking to a mental health professional. Engaging in activities you enjoy, setting small goals, and seeking support from friends and family can also help improve your mood.";
//     } else if (
//         lowerMessage.includes("conflict") ||
//         lowerMessage.includes("roommates")
//     ) {
//         return "Handling conflicts with roommates involves communication and compromise. Try to address issues calmly and openly, and consider involving a mediator or counselor if necessary.";
//     } else if (
//         lowerMessage.includes("job search") ||
//         lowerMessage.includes("graduation")
//     ) {
//         return "Preparing for a job search involves networking, researching potential employers, and updating your resume and cover letters. Utilize career services on campus and attend job fairs for additional support.";
//     } else if (lowerMessage.includes("fitting in")) {
//         return "Feeling like you don’t fit in can be tough. Engaging in campus activities, finding groups with similar interests, and seeking support from counselors can help you build connections and feel more included.";
//     } else if (lowerMessage.includes("homesickness")) {
//         return "Dealing with homesickness involves staying connected with family and friends, exploring your new environment, and establishing a routine that includes activities you enjoy. Seek support from campus resources if needed.";
//     } else if (lowerMessage.includes("time management")) {
//         return "Effective time management involves creating a schedule, setting priorities, and using tools like planners or apps. Breaking tasks into smaller steps and setting specific deadlines can also help manage your time better.";
//     } else if (
//         lowerMessage.includes("future career") ||
//         lowerMessage.includes("career anxiety")
//     ) {
//         return "Anxiety about your future career can be managed by exploring career options, seeking advice from mentors, and setting career-related goals. Taking small steps toward your career interests can help build confidence and reduce anxiety.";
//     } else if (lowerMessage.includes("self-esteem")) {
//         return "Improving self-esteem involves practicing self-compassion, setting achievable goals, and recognizing your strengths. Engaging in positive self-talk and seeking support from a therapist can also be beneficial.";
//     } else if (
//         lowerMessage.includes("extracurricular activities") ||
//         lowerMessage.includes("overwhelmed")
//     ) {
//         return "If you’re feeling overwhelmed by extracurricular activities, assess your commitments and prioritize what’s most important. It’s okay to step back from activities if necessary and focus on maintaining balance.";
//     } else if (lowerMessage.includes("social anxiety")) {
//         return "Managing social anxiety involves gradual exposure to social situations, practicing relaxation techniques, and seeking support from a counselor or therapist. Building social skills and confidence over time can also help.";
//     } else if (lowerMessage.includes("study habits")) {
//         return "Improving study habits involves creating a structured study schedule, using active learning techniques, and finding a study environment that works best for you. Seeking help from tutors or academic advisors can also be beneficial.";
//     } else if (lowerMessage.includes("burned out")) {
//         return "Recovering from burnout involves taking breaks, engaging in self-care, and reassessing your workload and commitments. It’s important to prioritize rest and seek support if needed.";
//     } else if (
//         lowerMessage.includes("criticism") ||
//         lowerMessage.includes("professors")
//     ) {
//         return "Handling criticism from professors involves staying open to feedback, viewing it as a learning opportunity, and communicating any concerns or difficulties you’re experiencing. Seeking clarification can also help.";
//     } else if (
//         lowerMessage.includes("assignments") ||
//         lowerMessage.includes("struggling")
//     ) {
//         return "Struggling with assignments can be managed by breaking them into smaller tasks, creating a study plan, and seeking help from professors or study groups. Time management and staying organized can also be helpful.";
//     } else if (lowerMessage.includes("group projects")) {
//         return "Dealing with anxiety about group projects involves clear communication with group members, setting expectations, and dividing tasks effectively. Seeking feedback and addressing concerns early can also help.";
//     } else if (lowerMessage.includes("work-life balance")) {
//         return "Maintaining a healthy work-life balance involves setting boundaries, scheduling regular breaks, and prioritizing self-care. It’s important to make time for activities that bring you joy and relaxation.";
//     } else if (
//         lowerMessage.includes("academic performance") ||
//         lowerMessage.includes("insecure")
//     ) {
//         return "Feeling insecure about academic performance can be managed by focusing on your strengths, setting realistic goals, and seeking support from academic advisors or tutors. It’s important to recognize that setbacks are part of the learning process.";
//     } else if (lowerMessage.includes("self-doubt")) {
//         return "Overcoming self-doubt involves challenging negative thoughts, recognizing your achievements, and seeking feedback from mentors or peers. Building confidence through small successes can also help.";
//     } else if (lowerMessage.includes("academic pressure")) {
//         return "Managing academic pressure involves setting realistic goals, practicing stress management techniques, and seeking support from counselors or academic advisors. It’s important to prioritize your well-being.";
//     } else if (lowerMessage.includes("stress about future plans")) {
//         return "Feeling stressed about future plans can be managed by setting short-term and long-term goals, seeking advice from mentors, and focusing on what you can control. Taking small steps toward your goals can also help reduce anxiety.";
//     } else if (lowerMessage.includes("making friends")) {
//         return "Struggling to make friends can be challenging. Try joining campus groups, attending social events, and reaching out to peers with similar interests. Building connections takes time, so be patient with yourself.";
//     } else if (lowerMessage.includes("mental health")) {
//         return "Improving mental health involves seeking support from counselors, practicing self-care, and engaging in activities that bring you joy. It’s important to prioritize your well-being and reach out for help when needed.";
//     } else if (
//         lowerMessage.includes("workload") ||
//         lowerMessage.includes("overwhelmed")
//     ) {
//         return "Feeling overwhelmed by your workload can be managed by prioritizing tasks, creating a schedule, and seeking support from academic advisors or peers. It’s important to take breaks and focus on self-care.";
//     } else if (lowerMessage.includes("test anxiety")) {
//         return "Managing test anxiety involves preparation and relaxation techniques. Practice mock exams, develop a study plan, and try techniques like deep breathing or visualization to calm your nerves before the test.";
//     } else if (
//         lowerMessage.includes("feeling disconnected") ||
//         lowerMessage.includes("peers")
//     ) {
//         return "Feeling disconnected from peers can be addressed by reaching out to classmates, joining campus activities, and seeking support from counselors or student groups. Building connections takes time, so be patient.";
//     } else if (lowerMessage.includes("homesickness")) {
//         return "Dealing with homesickness involves staying connected with family and friends, exploring your new environment, and establishing a routine that includes activities you enjoy. Seek support from campus resources if needed.";
//     } else {
//         return "Could you specific please!";
//     }
// };