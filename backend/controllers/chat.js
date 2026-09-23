const ChatMessage = require("../models/chatMessage");
const Victim = require("../models/victim");
const { callGemini } = require("../config/gemini");
const {
  getChatSystemPrompt,
  getFallbackChatMessage,
} = require("../utils/promptGenerator");

// 📌 1. Get Chat History for Logged-In Victim
module.exports.getHistory = async (req, res) => {
  const victimId = req.victim._id;

  const messages = await ChatMessage.find({ victim: victimId })
    .sort({ createdAt: 1 })
    .select("sender message createdAt");

  res.status(200).json({
    success: true,
    messages,
  });
};

// 📌 2. Send Message to Gemini Chatbot & Save History
module.exports.sendMessage = async (req, res) => {
  const victimId = req.victim._id;
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ message: "Message content is required" });
  }

  // Fetch fresh victim and case details from DB
  const victimData =
    (await Victim.findById(victimId).select("-password")) || req.victim;

  // 1. Save Victim's Message
  const victimMsg = await ChatMessage.create({
    victim: victimId,
    sender: "victim",
    message: message.trim(),
  });

  // 2. Fetch past conversation history (last 16 messages for full multi-turn context)
  const recentHistory = await ChatMessage.find({ victim: victimId })
    .sort({ createdAt: -1 })
    .limit(16);

  const sortedHistory = recentHistory.reverse();

  // Format contents for Gemini multi-turn dialogue
  const contents = sortedHistory.map((m) => ({
    role: m.sender === "victim" ? "user" : "model",
    parts: [{ text: m.message }],
  }));

  // Generate personalized, plain-text prompt
  const systemInstruction = getChatSystemPrompt(victimData);

  let botReplyText = "";

  try {
    botReplyText = await callGemini({
      contents,
      systemInstruction,
      model: process.env.GEMINI_CHAT_MODEL,
      generationConfig: {
        temperature: 0.75,
        maxOutputTokens: 200,
        topP: 0.9,
      },
    });
  } catch (error) {
    console.error("Gemini Chat Error:", error.message);
    botReplyText = getFallbackChatMessage(victimData);
  }

  // 3. Save Bot's Message
  const botMsg = await ChatMessage.create({
    victim: victimId,
    sender: "bot",
    message: botReplyText,
  });

  res.status(200).json({
    success: true,
    reply: botMsg,
    messages: [victimMsg, botMsg],
  });
};

// 📌 3. Clear Chat History
module.exports.clearHistory = async (req, res) => {
  const victimId = req.victim._id;
  await ChatMessage.deleteMany({ victim: victimId });

  res.status(200).json({
    success: true,
    message: "Chat history cleared successfully.",
  });
};


