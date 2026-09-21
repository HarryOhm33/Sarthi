# JWT Authentication with OTP Verification & Cron Jobs Cleanup

## 🚀 Project Overview

This project implements **JWT-based authentication** with email **OTP verification** and a **cron job** to automatically remove expired OTPs and sessions. Built with **Node.js, Express, and MongoDB**, it ensures secure user authentication while keeping the database clean.

## 🔑 Features

- ✅ **User Authentication** using JWT (Login, Register, Logout)
- ✉️ **OTP-based Email Verification** (instead of links)
- 🛠️ **Session Management** for tracking logins
- ⏳ **Automated Cleanup** of expired OTPs & sessions using **cron jobs**
- ⚡ **Error Handling & Async Wrappers** for cleaner code

## 📂 Project Structure

```
📁 JWT-AUTH/
├── 📂 config/
│   ├── 🗄️ db.js             # MongoDB connection
│
├── 📂 controllers/
│   ├── 🔑 auth.js           # Authentication logic
│
├── 📂 middleware/
│   ├── 🛡️ authenticate.js   # Middleware to protect routes
│
├── 📂 models/
│   ├── 👤 user.js           # User schema
│   ├── 🔢 otp.js            # OTP schema
│   ├── 📌 session.js        # Session schema
│
├── 📂 routes/
│   ├── 🚏 authRoute.js      # Authentication routes
│
├── 📂 utils/
│   ├── ⏳ cronJobs.js       # Cron job to delete expired OTPs & sessions
│   ├── 📧 sendEmail.js      # Utility for sending OTP emails
│   ├── 🏗️ wrapAsync.js      # Async wrapper for clean controllers
│   ├── ⚠️ ExpressError.js   # Custom error handling
│
├── 📄 .env                  # Environment variables
├── 🚀 server.js             # Entry point
├── 📦 package.json          # Dependencies & scripts
├── 📜 .gitignore            # Ignore unnecessary files
```

## 🛠️ Installation & Setup

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/your-username/jwt-auth-otp-cron.git
cd jwt-auth-otp-cron
```

### 2️⃣ Install Dependencies

```sh
npm install
```

### 3️⃣ Setup Environment Variables

Create a **.env** file in the root directory and add:

```
PORT=your_port
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

### 4️⃣ Run the Server

```sh
npm run dev
```

The server runs on **http://localhost:5000** by default.

## 📌 API Routes

### **Authentication**

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/logout` - Logout

## ⏳ Automated Cron Job Cleanup

- **Runs every X minutes** to delete expired OTPs & sessions.
- Implemented in `utils/cronJobs.js`.

## 📜 License

This project is licensed under the MIT License.

---

🌟 **Contributions & Suggestions Welcome!** 🌟
Feel free to fork, raise issues, or suggest improvements. Let’s connect and learn together! 🚀
