import * as dotenv from "dotenv";
import { Router, Request, Response } from "express";

const router = Router();
// Load environment variables from .env file
dotenv.config();
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAIAPI, // Replace with actual key, but avoid exposing it in client-side code
    organization: process.env.OPENAIORG,
});

router.get("/", async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("Received message:", req.query.ui);
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: req.query.ui as string },
            ],
        });
        if (!completion) {
            res.status(500).send("Internal Server Error");
            return;
        }
        const botMessage = completion.choices[0].message.content;
        res.json(botMessage);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});

export default router;
