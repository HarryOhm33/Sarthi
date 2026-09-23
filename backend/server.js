if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const connectDB = require("./config/db");
connectDB();
require("./jobs/analyticsJob");

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

const port = process.env.PORT;

const ExpressError = require("./utils/ExpressError");
const authRoute = require("./routes/authRoute");
const chatRoute = require("./routes/chatRoute");
const adminRoute = require("./routes/adminRoute");

app.use(express.urlencoded({ extended: true, limit: "15mb" }));
app.use(express.json({ limit: "15mb" }));
app.use(cookieParser()); // ✅ Middleware for handling cookies

corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true, // Allow cookies to be sent
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions)); // ✅ CORS Middleware

app.use("/api/auth", authRoute);
app.use("/api/chat", chatRoute);
app.use("/api/admin", adminRoute);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Not a Valid Route"));
});

//Error Handling Middleware

app.use((err, req, res, next) => {
  let { status = 500, message = "Something Went Wrong!!" } = err;
  res.status(status).json({ error: message });
});

app.listen(port, () => {
  console.log(`App Listening To Port ${port}`);
});
