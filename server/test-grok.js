
import OpenAI from "openai";
import 'dotenv/config';

const AI = new OpenAI({
    apiKey: process.env.GROK_API_KEY,
    baseURL: "https://api.x.ai/v1"
});

async function testGrok() {
    console.log("Testing Grok API...");
    console.log("Key:", process.env.GROK_API_KEY ? "Present" : "Missing");
    try {
        const response = await AI.chat.completions.create({
            model: "grok-beta",
            messages: [{ role: "user", content: "Hello, world!" }],
            max_tokens: 10,
        });
        console.log("Success!");
        console.log(response.choices[0].message.content);
    } catch (error) {
        console.error("Error:", error.message);
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        }
    }
}

testGrok();
