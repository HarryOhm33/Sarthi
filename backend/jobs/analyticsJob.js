// jobs/analyticsJob.js
// Scheduled analytics job running twice a day at 10:00 AM and 10:00 PM
// Gathers user profiles and conversations, evaluates them via Gemini, and stores results in Analytics model.

const cron = require("node-cron");
const Victim = require("../models/victim");
const ChatMessage = require("../models/chatMessage");
const Analytics = require("../models/analytics");
const { callGemini } = require("../config/gemini");
const {
  getAnalyticsSystemPrompt,
  formatVictimAnalyticsContext,
} = require("../utils/promptGenerator");

/**
 * Core Analytics Processor
 * Can be called automatically by cron or triggered manually via script
 */
async function runAnalyticsJob() {
  console.log("\n=======================================================");
  console.log(`🚀 [ANALYTICS JOB STARTED] ${new Date().toISOString()}`);
  console.log("=======================================================");

  try {
    const victims = await Victim.find().select("-password");
    console.log(`📋 Found ${victims.length} registered victim(s) to evaluate.`);

    if (victims.length === 0) {
      console.log("ℹ️ No registered victims found. Finishing analytics job.");
      return { success: true, processed: 0 };
    }

    const results = [];

    for (const victim of victims) {
      console.log(`\n🔍 Evaluating victim: ${victim.name} (ID: ${victim._id})...`);

      try {
        // Fetch up to 30 recent chat messages for this victim
        const recentMessages = await ChatMessage.find({ victim: victim._id })
          .sort({ createdAt: -1 })
          .limit(30);

        const orderedMessages = recentMessages.reverse();
        console.log(`💬 Retrieved ${orderedMessages.length} chat message(s).`);

        // Format prompt context for Gemini
        const userPrompt = formatVictimAnalyticsContext(victim, orderedMessages);
        const systemInstruction = getAnalyticsSystemPrompt();

        console.log("🤖 Sending data to Gemini for clinical & legal evaluation...");

        const rawGeminiOutput = await callGemini({
          contents: [{ role: "user", parts: [{ text: userPrompt }] }],
          systemInstruction,
          model: process.env.GEMINI_ANALYTICS_MODEL || "gemini-3.1-flash-lite",
          generationConfig: {
            temperature: 0.2, // Low temperature for consistent JSON structure
            maxOutputTokens: 600,
            responseMimeType: "application/json",
          },
          raw: true,
        });

        // Parse structured JSON
        const cleanJson = rawGeminiOutput
          .replace(/^```json\s*/i, "")
          .replace(/```\s*$/, "")
          .trim();

        let parsed;
        try {
          parsed = JSON.parse(cleanJson);
        } catch (parseErr) {
          console.error(`❌ Failed to parse Gemini JSON output for ${victim.name}:`, parseErr.message);
          continue;
        }

        // Replace previous analytics record for this victim (upsert & clean duplicates)
        const analyticsDoc = await Analytics.findOneAndUpdate(
          { victim: victim._id },
          {
            victim: victim._id,
            message:
              parsed.message ||
              `Automated risk and psychological evaluation for ${victim.name}`,
            sentiment: ["POSITIVE", "NEUTRAL", "NEGATIVE"].includes(parsed.sentiment)
              ? parsed.sentiment
              : "NEUTRAL",
            emotions: Array.isArray(parsed.emotions) ? parsed.emotions : [],
            distressScore:
              typeof parsed.distressScore === "number"
                ? Math.min(100, Math.max(0, Math.round(parsed.distressScore)))
                : 50,
            riskLevel: ["LOW", "MEDIUM", "HIGH", "CRITICAL"].includes(parsed.riskLevel)
              ? parsed.riskLevel
              : "MEDIUM",
            threatIndicator: Boolean(parsed.threatIndicator),
            engagementLevel: ["LOW", "MEDIUM", "HIGH"].includes(parsed.engagementLevel)
              ? parsed.engagementLevel
              : "MEDIUM",
            reasons: Array.isArray(parsed.reasons) ? parsed.reasons : [],
            recommendedInterventions: Array.isArray(parsed.recommendedInterventions)
              ? parsed.recommendedInterventions
              : [],
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // Delete any older duplicate analytics records for this victim
        await Analytics.deleteMany({ victim: victim._id, _id: { $ne: analyticsDoc._id } });

        console.log(`✅ Successfully updated Analytics record ID: ${analyticsDoc._id} (replaced previous)`);
        results.push({ victimId: victim._id, analyticsId: analyticsDoc._id, success: true });
      } catch (victimErr) {
        console.error(`❌ Error analyzing victim ${victim.name}:`, victimErr.message);
        results.push({ victimId: victim._id, error: victimErr.message, success: false });
      }
    }

    console.log("\n=======================================================");
    console.log(`🏁 [ANALYTICS JOB FINISHED] Processed ${results.length} victims.`);
    console.log("=======================================================\n");

    return { success: true, results };
  } catch (jobErr) {
    console.error("❌ Fatal error in runAnalyticsJob:", jobErr.message);
    return { success: false, error: jobErr.message };
  }
}

/**
 * Run analytics for a single victim and replace previous analytics record
 */
async function runAnalyticsForVictim(victimId) {
  console.log(`\n🔍 [ON-DEMAND ANALYTICS] Evaluating victim ID: ${victimId}...`);

  const victim = await Victim.findById(victimId).select("-password");
  if (!victim) {
    throw new Error("Victim not found");
  }

  // Fetch up to 30 recent chat messages
  const recentMessages = await ChatMessage.find({ victim: victim._id })
    .sort({ createdAt: -1 })
    .limit(30);

  const orderedMessages = recentMessages.reverse();

  // Format prompt context for Gemini
  const userPrompt = formatVictimAnalyticsContext(victim, orderedMessages);
  const systemInstruction = getAnalyticsSystemPrompt();

  console.log(`🤖 Sending data to Gemini for clinical & legal evaluation for ${victim.name}...`);

  const rawGeminiOutput = await callGemini({
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    systemInstruction,
    model: process.env.GEMINI_ANALYTICS_MODEL || "gemini-3.1-flash-lite",
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 600,
      responseMimeType: "application/json",
    },
    raw: true,
  });

  // Parse structured JSON
  const cleanJson = rawGeminiOutput
    .replace(/^```json\s*/i, "")
    .replace(/```\s*$/, "")
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(cleanJson);
  } catch (parseErr) {
    throw new Error(`Failed to parse Gemini evaluation output: ${parseErr.message}`);
  }

  // Replace previous analytics record for this victim (upsert & clean duplicates)
  const analyticsDoc = await Analytics.findOneAndUpdate(
    { victim: victim._id },
    {
      victim: victim._id,
      message:
        parsed.message ||
        `Automated risk and psychological evaluation for ${victim.name}`,
      sentiment: ["POSITIVE", "NEUTRAL", "NEGATIVE"].includes(parsed.sentiment)
        ? parsed.sentiment
        : "NEUTRAL",
      emotions: Array.isArray(parsed.emotions) ? parsed.emotions : [],
      distressScore:
        typeof parsed.distressScore === "number"
          ? Math.min(100, Math.max(0, Math.round(parsed.distressScore)))
          : 50,
      riskLevel: ["LOW", "MEDIUM", "HIGH", "CRITICAL"].includes(parsed.riskLevel)
        ? parsed.riskLevel
        : "MEDIUM",
      threatIndicator: Boolean(parsed.threatIndicator),
      engagementLevel: ["LOW", "MEDIUM", "HIGH"].includes(parsed.engagementLevel)
        ? parsed.engagementLevel
        : "MEDIUM",
      reasons: Array.isArray(parsed.reasons) ? parsed.reasons : [],
      recommendedInterventions: Array.isArray(parsed.recommendedInterventions)
        ? parsed.recommendedInterventions
        : [],
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).populate("victim", "name email phone district caseType caseStatus createdAt");

  // Clean older duplicate records
  await Analytics.deleteMany({ victim: victim._id, _id: { $ne: analyticsDoc._id } });

  console.log(`✅ Successfully updated Analytics record ID: ${analyticsDoc._id} for ${victim.name}`);
  return analyticsDoc;
}

// ⏰ Scheduled Cron: Runs 2 times a day at 10:00 AM and 10:00 PM (0 10,22 * * *)
const cronExpression = "0 10,22 * * *";

const scheduledJob = cron.schedule(cronExpression, async () => {
  console.log("⏰ Triggering scheduled Analytics job (10:00 AM / 10:00 PM trigger)...");
  await runAnalyticsJob();
});

console.log(`⏳ Analytics Cron initialized: Scheduled for 10:00 AM and 10:00 PM daily (${cronExpression})`);

module.exports = {
  runAnalyticsJob,
  runAnalyticsForVictim,
  scheduledJob,
};
