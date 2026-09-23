// config/gemini.js
// Centralized Google Gemini configuration and caller

/**
 * Clean text of accidental markdown symbols (hashes, asterisks, bullets, etc.)
 */
function cleanPlainChatText(text) {
  if (!text) return "";
  return text
    .replace(/^#+\s+/gm, "") // remove heading hashes
    .replace(/\*\*(.*?)\*\*/g, "$1") // remove bold **
    .replace(/\*(.*?)\*/g, "$1") // remove single *
    .replace(/^[\*\-]\s+/gm, "") // remove bullet dashes/stars
    .replace(/[#*`~]/g, "") // strip any remaining asterisks, hashes, backticks
    .trim();
}

/**
 * Universal caller for Gemini APIs.
 * Supports passing data (contents), prompt (systemInstruction), and model settings.
 *
 * @param {Object} options
 * @param {Array} options.contents - Array of conversation messages [{ role, parts }]
 * @param {string} options.systemInstruction - System instructions / prompt
 * @param {string} [options.model] - Specific Gemini model (defaults to GEMINI_CHAT_MODEL or gemini-3.1-flash-lite)
 * @param {Object} [options.generationConfig] - Temperature, maxOutputTokens, topP, etc.
 */
async function callGemini({
  contents,
  systemInstruction,
  model,
  generationConfig = {},
  raw = false,
}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in backend .env");
  }

  // Priority: explicitly passed model -> GEMINI_CHAT_MODEL env -> GEMINI_MODEL env -> fallback list
  const primaryModel =
    model ||
    process.env.GEMINI_CHAT_MODEL ||
    process.env.GEMINI_MODEL ||
    "gemini-3.1-flash-lite";

  const modelsToTry = [
    primaryModel,
    "gemini-3.1-flash-lite",
    "gemini-flash-lite-latest",
    "gemini-3.5-flash-lite",
    "gemini-2.5-flash-lite",
    "gemini-3.6-flash",
  ];

  const uniqueModels = [...new Set(modelsToTry.filter(Boolean))];

  const mergedConfig = {
    temperature: 0.5,
    maxOutputTokens: 160,
    topP: 0.85,
    ...generationConfig,
  };

  let lastError = null;

  for (const m of uniqueModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`;

      const requestBody = {
        contents,
        generationConfig: mergedConfig,
      };

      if (systemInstruction) {
        requestBody.system_instruction = {
          parts: [{ text: systemInstruction }],
        };
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errText = await response.text();
        lastError = new Error(`Gemini API Error (${m} - ${response.status}): ${errText}`);
        continue;
      }

      const data = await response.json();
      const rawText =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I am here with you. How else can I assist you right now?";

      if (raw || generationConfig.responseMimeType === "application/json") {
        return rawText.trim();
      }

      return cleanPlainChatText(rawText);
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error("Failed to connect to any Gemini model");
}

module.exports = {
  callGemini,
  cleanPlainChatText,
};
