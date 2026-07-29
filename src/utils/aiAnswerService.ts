import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "@/models/user.model";
import Answer from "@/models/answer.model";
import { groqClient } from "@/lib/groq";

const AI_USER_ID = new mongoose.Types.ObjectId("000000000000000000000001");
const AI_MODEL = "llama-3.1-8b-instant";

export async function getOrCreateAiUser() {
  const existing = await User.findById(AI_USER_ID);
  if (existing) return existing;

  const hashedPassword = await bcrypt.hash(new mongoose.Types.ObjectId().toString(), 10);

  return User.create({
    _id: AI_USER_ID,
    username: "MentorVerse AI",
    email: "ai-assistant@mentorverse.internal",
    password: hashedPassword,
    role: "mentor",
    isVerified: true,
    verifyEmailCode: "000000",
    verifyEmailCodeExpiry: new Date("2100-01-01"),
  });
}

export async function generateAiAnswerText(title: string, content: string) {
  const systemPrompt =
    "You are the MentorVerse AI Assistant, answering questions on a mentorship Q&A platform. " +
    "A user has just posted a question. Give a clear, accurate, and helpful first-pass answer, " +
    "formatted in Markdown. Be concise but thorough, and note that a mentor may add further detail.";

  const response = await groqClient.post("/chat/completions", {
    model: AI_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Title: ${title}\n\n${content}` },
    ],
    temperature: 0.4,
  });

  const text = response.data?.choices?.[0]?.message?.content;
  return typeof text === "string" ? text.trim() : null;
}

export async function createAiAnswerForQuestion(questionId: string, title: string, content: string) {
  try {
    const [aiUser, answerText] = await Promise.all([
      getOrCreateAiUser(),
      generateAiAnswerText(title, content),
    ]);

    if (!answerText) return null;

    return await Answer.create({
      questionId,
      authorId: aiUser._id,
      content: answerText.slice(0, 10000),
      isAiGenerated: true,
    });
  } catch (error) {
    console.error("Error generating AI answer:", error);
    return null;
  }
}
