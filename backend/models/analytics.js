const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema(
    {
        victim: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Victim",
            required: true,
            index: true,
        },

        message: {
            type: String,
            required: true,
        },

        sentiment: {
            type: String,
            enum: ["POSITIVE", "NEUTRAL", "NEGATIVE"],
        },

        emotions: [String],

        distressScore: {
            type: Number,
            min: 0,
            max: 100,
        },

        riskLevel: {
            type: String,
            enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
        },

        threatIndicator: {
            type: Boolean,
            default: false,
        },

        engagementLevel: {
            type: String,
            enum: ["LOW", "MEDIUM", "HIGH"],
        },

        reasons: [String],

        recommendedInterventions: [String],
    },
    {
        timestamps: true,
    }
);

const Analytics = mongoose.model("Analytics", analyticsSchema);

module.exports = Analytics;