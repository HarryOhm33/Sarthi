const mongoose = require("mongoose");

const victimSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        password: {
            type: String,
            required: true,
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        caseType: {
            type: String,
            default: null,
        },

        district: {
            type: String,
            default: null,
        },

        caseStatus: {
            type: String,
            enum: ["ONGOING", "COMPLETED", "REHABILITATION"],
            default: "ONGOING",
        },
    },
    {
        timestamps: true,
    }
);

const Victim = mongoose.model("Victim", victimSchema);

module.exports = Victim;