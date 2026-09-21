if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const connectDB = require("./config/db");
connectDB();
// require("./utils/cronJobs");

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

const port = process.env.PORT;

const ExpressError = require("./utils/ExpressError");
const authRoute = require("./routes/authRoute");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser()); // ✅ Middleware for handling cookies

corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true, // Allow cookies to be sent
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions)); // ✅ CORS Middleware

app.use("/api/auth", authRoute);

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
