# 🛡️ SARTHI (सारथी)
### AI-Powered Legal, Psychological & Crisis Protection Portal for Women

[![React](https://img.shields.io/badge/Frontend-React%2019%20%7C%20Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Container-Docker%20%7C%20Compose-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Netlify](https://img.shields.io/badge/Deploy-Netlify%20Ready-00C7B7?logo=netlify&logoColor=white)](https://www.netlify.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📌 Overview

**Sarthi** is an intelligent, compassionate emergency and legal assistance platform engineered for victims of domestic violence, emotional trauma, and legal distress. It bridges the critical divide between victims in acute distress and crisis intervention authorities by combining **24/7 AI-guided conversational triage**, **speech-to-text voice dictation**, **clinical psychological risk scoring**, and an **Executive Crisis Command Center** for law enforcement, counselors, and legal aid workers.

---

## 🌟 Key Capabilities

### 🕊️ 1. Victim Care & Assistance Portal
- **Empathetic AI Companion ("What's On Your Mind")**: Provides safe, non-judgmental conversational support, legal rights guidance (e.g., Protection of Women from Domestic Violence Act 2005), and psychological de-escalation.
- **Microphone / Voice Dictation**: Integrated browser-native Speech-to-Text dictation allows survivors in shock or distress to speak freely without typing.
- **One-Touch Crisis Helplines**: Instant click-to-call links for National Emergency (**112**), Women's Helpline (**1091**), and National Legal Services Authority NALSA (**15100**).
- **Safety First & Discretion**: Dedicated account controls, confidential session isolation, and quiet emergency hotkeys.
- **Compassionate 404 Recovery**: Custom 404 page featuring instant crisis hotlines and single-click return paths.

### 🏛️ 2. Administrative & Crisis Command Center
- **Triage Dashboard**: Live visual metrics highlighting high-risk situations, emergency intervention queues, and severity trends.
- **Automated Clinical Risk Scoring**: Periodic background analysis calculates composite risk scores based on:
  - Physical violence indicators
  - Psychological trauma and coercion severity
  - Self-harm / suicidal ideation triggers
- **Immediate Attention Queue**: Filters and surfaces cases that require urgent intervention, keeping critical survivors top-of-mind without cluttering lists.
- **Citizen Case Directory**: In-depth individual user view containing past session logs, emergency contact profiles, and timeline logs.

---

## 🏗️ Architecture & Tech Stack

```
                          ┌─────────────────────────────────────┐
                          │         SARTHI WEB CLIENT           │
                          │   (React 19 + Vite + TailwindCSS)   │
                          │      [Netlify SPA / _redirects]     │
                          └──────────────────┬──────────────────┘
                                             │ HTTP / REST
                                             ▼
                          ┌─────────────────────────────────────┐
                          │         EXPRESS API BACKEND         │
                          │     (Node.js + JWT + Gemini AI)     │
                          │      [Dockerized on Port 8001]      │
                          └──────┬───────────────────────┬──────┘
                                 │                       │
                                 ▼                       ▼
                      ┌──────────────────────┐  ┌────────────────┐
                      │    MongoDB Atlas     │  │ Google Gemini  │
                      │  (Sessions, Users,   │  │   AI Engine    │
                      │   Risk Analytics)    │  │ (Chat & Risk)  │
                      └──────────────────────┘  └────────────────┘
```

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS, Framer Motion, React Router v7, Lucide & React Icons |
| **Backend** | Node.js, Express.js, JWT (HTTP-Only Cookies), Mongoose, Google GenAI SDK |
| **Email & Auth** | AWS Simple Email Service (SES), bcryptjs |
| **Deployment** | Docker, Docker Compose, Multi-stage Node Alpine images, Netlify SPA redirect rules |

---

## 📁 Repository Directory Structure

```
.
├── backend/
│   ├── config/              # MongoDB and Gemini AI client configurations
│   ├── controllers/         # Auth, Admin, Chat, and User controllers
│   ├── deploy/              # Alternative standalone Dockerfile
│   ├── jobs/                # Background clinical analytics & risk cron jobs
│   ├── middleware/          # JWT authentication guards (User & Admin)
│   ├── models/              # Mongoose schemas (Victim, Admin, Chat, Session)
│   ├── routes/              # Express API route declarations
│   ├── scripts/             # Admin and sample database seed scripts
│   ├── utils/               # AWS SES emailer, error wrappers
│   ├── .dockerignore        # Docker build exclusion rules
│   ├── .env.example         # Backend environment variables template
│   ├── Dockerfile           # Optimized production container image
│   └── server.js            # Express application entrypoint
│
├── frontend/
│   ├── public/              # Static assets, icons, and Netlify _redirects
│   │   ├── _redirects       # Netlify SPA catch-all redirect rule (200)
│   │   └── sarthi-shield.svg# Primary brand icon
│   ├── src/
│   │   ├── components/      # Reusable UI widgets, Navbars, Audio Recorder
│   │   ├── contexts/        # AuthContext and AdminAuthContext
│   │   ├── Pages/           # Home, Login, WhatsOnYourMind, AdminDashboard, NotFound
│   │   ├── App.jsx          # Route hierarchy with 404 catch-all
│   │   └── main.jsx         # React DOM mounting
│   ├── .env.example         # Frontend environment variables template
│   ├── index.html           # Document root with Sarthi meta & brand icon
│   └── vite.config.js       # Vite build configuration
│
└── deployment/
    ├── docker-compose.yaml  # Multi-container orchestration (App + MongoDB)
    └── .env.example         # Orchestration environment variables template
```

---

## ⚙️ Environment Variables Reference

### Backend (`backend/.env`)
| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | Backend server port | `8001` |
| `NODE_ENV` | Runtime environment | `development` / `production` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/sarthi` |
| `JWT_SECRET` | Secret key for signing tokens | `super_secret_jwt_key` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:5173` |
| `GEMINI_API_KEY` | Google Gemini API Key | `AIzaSy...` |
| `GEMINI_CHAT_MODEL` | Model for conversational agent | `gemini-2.5-flash` |
| `GEMINI_ANALYTICS_MODEL` | Model for risk analysis | `gemini-2.5-flash` |
| `AWS_REGION` | AWS SES Region | `ap-south-1` |
| `AWS_ACCESS_KEY_ID` | AWS SES Access Key ID | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | AWS SES Secret Key | `secret...` |
| `SES_FROM_EMAIL` | Verified AWS SES Sender | `noreply@sarthi.gov.in` |
| `ADMIN_EMAIL` | Seed admin account email | `admin@sarthi.gov.in` |
| `ADMIN_PASSWORD` | Seed admin account password | `Admin@12345` |

### Frontend (`frontend/.env`)
| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `VITE_BACKEND_URL` | Backend API base URL | `http://localhost:8001` |

---

## 🚀 Getting Started (Local Development)

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or v20.x recommended)
- [MongoDB](https://www.mongodb.com/) (Local server or MongoDB Atlas cluster)
- Google Gemini API Key

---

### 2. Backend Setup
```bash
# Navigate to the backend folder
cd backend

# Copy environment variables
cp .env.example .env
# Edit .env and supply your MONGO_URI and GEMINI_API_KEY

# Install dependencies
npm install

# (Optional) Seed default administrator account
npm run seed:admin

# Start development server
npm run dev
```
Backend will start on **`http://localhost:8001`**.

---

### 3. Frontend Setup
```bash
# Open a new terminal and navigate to frontend
cd frontend

# Copy environment variables
cp .env.example .env

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Frontend will be accessible at **`http://localhost:5173`**.

---

## 🐳 Docker Deployment

You can spin up the entire backend stack along with a dedicated MongoDB database using Docker Compose:

```bash
# Navigate to deployment directory
cd deployment

# Copy docker environment template
cp .env.example .env
# Configure your GEMINI_API_KEY and secrets in .env

# Build and start containers in detached mode
docker compose up -d --build
```

To view logs or stop the containers:
```bash
# View backend logs
docker compose logs -f sarthi-backend

# Stop containers
docker compose down
```

---

## 🌐 Deploying Frontend on Netlify

1. Link your repository to Netlify.
2. Configure build settings:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
3. In **Site Configuration > Environment Variables**, add:
   - `VITE_BACKEND_URL`: URL of your deployed backend (e.g. `https://api.yourdomain.com`).
4. **Client-Side Routing**: The `frontend/public/_redirects` file is pre-configured with:
   ```
   /*    /index.html   200
   ```
   This ensures that deep links (`/dashboard`, `/admin/dashboard`, `/auth/login`) and custom 404 pages render smoothly without HTTP 404 page load errors on page refresh.

---

## 🔐 Default Credentials

When seeded via `npm run seed:admin`:
- **Portal URL**: `http://localhost:5173/admin/login`
- **Email**: `admin@sarthi.gov.in`
- **Password**: `Admin@12345`

*(Be sure to rotate these credentials before deploying to a public production environment.)*

---

## 🤝 Emergency Helplines (India)

| Agency | Helpline Number | Scope |
| :--- | :--- | :--- |
| **National Emergency** | `112` | Police, Fire, Ambulance |
| **Women's Helpline** | `1091` / `181` | Domestic abuse & distress |
| **National Legal Services Authority (NALSA)** | `15100` | Free legal aid & representation |
| **National Commission for Women (NCW)** | `7827170170` | 24/7 Domestic violence crisis line |

---

## 📄 License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
