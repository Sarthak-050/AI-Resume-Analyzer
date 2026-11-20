# 🚀 AI Resume Analyzer

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)
![Groq AI](https://img.shields.io/badge/AI-Groq-orange)
![Cloudinary](https://img.shields.io/badge/Storage-Cloudinary-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

An **AI-powered Resume Intelligence Platform** that helps job seekers optimize their resumes for modern Applicant Tracking Systems (ATS).

Upload your resume to receive an AI-generated ATS score, identify missing skills, compare it against any job description, rewrite weak resume bullets, and even get feedback from a **Multi-Agent AI Hiring Panel** that simulates real hiring decisions.

🌐 **Live Demo:** https://ai-resume-analyzer-sigma-tan.vercel.app

> **Note:** The backend is hosted on Render's free tier. The first request may take around **30–50 seconds** after inactivity.

---

# ✨ Features

## 📄 Resume Analysis

- Secure JWT Authentication
- PDF Resume Upload
- Automatic Resume Parsing
- AI-powered ATS Score
- Strong Skills Detection
- Missing Skills Analysis
- Personalized Improvement Suggestions
- Resume Preview
- Resume Download
- AI Report Export

---

## 🤖 AI-Powered Tools

### 🎯 Job Description Matching

Compare your resume with any job description and receive

- Match Percentage
- Missing Keywords
- Improvement Suggestions

---

### ✍️ AI Resume Rewrite

Convert weak resume bullet points into stronger ATS-friendly alternatives using AI.

Example

Before

> Worked on backend development.

After

> Designed and implemented scalable backend APIs using Express.js, improving application performance and maintainability.

---

### 👥 Multi-Agent Hiring Panel

Instead of relying on a single AI response, the project creates **three independent AI reviewers**.

- ATS Bot
- Skeptical Recruiter
- Hiring Manager

Each reviewer evaluates the resume independently.

A final synthesis combines their opinions and highlights where they agree or disagree, providing a much more realistic hiring evaluation.

---

### 📈 Resume Version History

Track multiple versions of your resume and compare improvements over time.

---

## 📊 Dashboard

- Total Uploaded Resumes
- Average ATS Score
- Best ATS Score
- Resume Analytics

---

## ☁️ Storage

- Cloudinary File Storage
- MongoDB Atlas Database

---

## 🎨 User Experience

- Fully Responsive
- Dark UI
- Five Custom Themes
- Framer Motion Animations
- Smooth Micro-interactions
- Animated Score Gauges
- 3D Tilt Cards

---

# 📸 Screenshots

## Landing Page

> Add screenshot here

---

## Resume Analysis

> Add screenshot here

---

## Job Description Matching

> Add screenshot here

---

## Resume Rewrite

> Add screenshot here

---

## Multi-Agent Hiring Panel

> Add screenshot here

---

# 🛠 Tech Stack

## Frontend

- React.js (Vite)
- Tailwind CSS v4
- Framer Motion
- Axios
- React Router
- React Hot Toast
- Lucide React
- jsPDF

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer
- pdf-parse
- Cloudinary
- Groq AI API

---

## Deployment

| Service | Platform |
|----------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |
| Storage | Cloudinary |

---

# ⚙️ Project Architecture

```
                Resume PDF
                     │
                     ▼
              PDF Text Extraction
                     │
                     ▼
                 Groq AI API
      ┌─────────┬──────────┬────────────┐
      │         │          │            │
      ▼         ▼          ▼            ▼
 ATS Score   JD Match   Rewrite   Hiring Panel
      │         │          │            │
      └─────────┴──────────┴────────────┘
                     │
                     ▼
          MongoDB + Cloudinary
                     │
                     ▼
               React Dashboard
```

---

# 📂 Project Structure

```
backend/
│
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── utils/
├── app.js
└── server.js

frontend/
│
├── components/
├── context/
├── pages/
├── services/
├── utils/
└── App.jsx
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/yuvanjain1206/ai-resume-analyzer.git

cd ai-resume-analyzer
```

---

## Backend

```bash
cd backend

npm install

npm run dev
```

Create a `.env`

```env
PORT=5000

MONGODB_URI=

JWT_SECRET=

GROQ_API_KEY=

CLIENT_URL=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

Create

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

---

# 💡 What Makes This Project Different?

Unlike traditional resume analyzers, this project focuses on producing practical and realistic AI feedback.

✅ Prompt calibration to reduce generic suggestions

✅ Realistic ATS scoring

✅ Parallel AI reviewers

✅ Multi-Agent Hiring Panel

✅ Resume Version Tracking

✅ AI Resume Rewrite

✅ Job Description Matching

---

# 🚀 Future Improvements

- AI Cover Letter Generator
- Interview Preparation
- LinkedIn Profile Analysis
- Resume Templates
- Public Resume Sharing
- Recruiter Dashboard
- Team Workspace

---

# 👨‍💻 Author

**Yuvan Jain**

GitHub: https://github.com/yuvanjain1206

---

⭐ **If you found this project useful, consider giving it a Star!**


 # 🖼️ Project Screenshots





 <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/f4872cf6-ed8e-4e73-9137-36ab3d4ddf5d" />
 <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/ae2fdf8a-50f6-499f-aa2b-ee2e6ebe5ee2" />
 <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/a1641203-2803-4862-86c0-582fd4775a9a" />
 <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/6654d90a-ef3d-4a93-96d0-938ebcc76f12" />
 <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/723574cf-4055-49ff-bd43-0522d9eb1bcc" />





