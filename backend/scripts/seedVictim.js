const path = require("path");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Victim = require("../models/victim");

require("dotenv").config({ path: path.join(__dirname, "../.env") });

const victims = [
    {
        name: "Hari Om",
        email: "hari333333om@gmail.com",
        password: "1234",
        isVerified: true,
        caseType: "Caste-based violence",
        district: "Darbhanga",
        caseStatus: "ONGOING",
    },
    {
        name: "Ravi Kumar",
        email: "hariprojectest2@gmail.com",
        password: "1234",
        isVerified: true,
        caseType: "Grievous hurt and intimidation",
        district: "Patna",
        caseStatus: "ONGOING",
    },
];

const seedVictims = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI environment variable is not defined.");
        }
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        // Remove existing seeded victims
        await Victim.deleteMany({
            email: {
                $in: victims.map((victim) => victim.email),
            },
        });

        // Hash passwords before saving
        const preparedVictims = await Promise.all(
            victims.map(async (victim) => ({
                ...victim,
                password: await bcrypt.hash(victim.password, 10),
            }))
        );

        // Insert victims
        await Victim.insertMany(preparedVictims);

        console.log("✅ 2 victims seeded successfully");

        process.exit(0);
    } catch (error) {
        console.error("❌ Seeder error:", error);
        process.exit(1);
    }
};

seedVictims();