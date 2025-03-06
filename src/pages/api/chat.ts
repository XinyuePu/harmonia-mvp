import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

// ✅ 初始化 OpenAI 客户端
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // 确保你的环境变量正确加载
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        console.log("Using OpenAI API Key:", process.env.OPENAI_API_KEY ? "Loaded" : "Not Loaded");

        const { message } = req.body; // 从请求体中获取用户输入
        if (!message) {
            return res.status(400).json({ error: "No message provided" });
        }

        // ✅ 发送请求到 OpenAI
        const aiResponse = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [
                { role: "system", content: "You are an AI assistant." },
                { role: "user", content: message }
            ],
            max_tokens: 800
        });

        console.log("OpenAI API Response:", aiResponse);

        // ✅ 解决 TypeScript 的 `null` 报错：先确保 aiResponse 不是空的
        if (!aiResponse || !aiResponse.choices || aiResponse.choices.length === 0) {
            console.error("❌ OpenAI API did not return a valid response");
            return res.status(500).json({ error: "AI response is empty" });
        }

        // ✅ 确保 `choices[0].message?.content` 存在
        const aiMessage = aiResponse.choices[0]?.message?.content?.trim() || "No response from AI";

        return res.status(200).json({ response: aiMessage });
    } catch (error) {
        console.error("Error processing request:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
