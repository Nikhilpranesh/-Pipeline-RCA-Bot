# 🚀 Pipeline Failure RCA Bot

An AI-powered Root Cause Analysis (RCA) platform built using MERN Stack and Grok AI to automatically investigate pipeline failures, analyze logs, compare successful executions, review Git changes, and generate intelligent RCA reports.

---

# 👥 Team Information

## Team Name

Team 18

## Team Number

18 

## Team Members

* Naresh S
* Nikhil Pranesh KS
* Nigun Karthi R
---

# 🌐 Deliverable Links

## Demo Video

Demo Link: https://www.loom.com/share/6210f4c5713a499fb4c504dfcc385abe

## GitHub Repository

GitHub Repository Link: https://github.com/Nikhilpranesh/-Pipeline-RCA-Bot

---

# 📌 Project Overview

Pipeline Failure RCA Bot is an AI-powered support system designed to automate Root Cause Analysis (RCA) for failed ETL jobs, scheduled tasks, and data processing pipelines.

When a pipeline fails, engineers usually spend significant time analyzing logs, comparing previous executions, and reviewing code changes to identify the issue.

This system automates that process by using:

* Log Comparison
* Git Change Analysis
* AI-Powered Reasoning (Grok AI)
* RCA Report Generation
* Failure Investigation Automation

The platform reduces manual effort and improves incident resolution time.

---

# ✨ Features

## 🔐 User Authentication

* User Registration
* User Login
* JWT Authentication
* Secure Password Hashing

---

## 📂 Pipeline Management

* Create Pipeline
* View Pipelines
* Update Pipeline Details
* Delete Pipelines

---

## 📤 Log Upload Module

Users can upload:

* Success Logs
* Failure Logs

Features:

* Secure File Upload
* Log Storage
* Log Retrieval
* Log Management

---

## 🔍 Log Comparison Engine

Automatically compares:

* Success Logs
* Failure Logs

Detects:

* Missing Execution Steps
* New Error Messages
* Runtime Differences
* Unexpected Failures

---

## 📝 Git Change Analysis

Analyzes:

* Recent Commits
* Modified Files
* Added Code
* Removed Code
* Configuration Changes

Uses:

* Git Diff
* Commit History

---

## 🤖 AI-Powered RCA Generation

Powered by Grok AI.

The system generates:

* Root Cause
* Impact Analysis
* Confidence Score
* Recommended Fixes

Example:

Root Cause:
Database schema mismatch detected.

Impact:
Data transformation failed.

Confidence:
95%

Recommendation:
Update ETL mapping configuration and retry.

---

## 📊 Dashboard Analytics

Displays:

* Total Pipelines
* Successful Runs
* Failed Runs
* Failure Trends
* Success Rate
* Common Error Categories

---

## 📄 RCA Report Management

* Generate RCA Reports
* Store RCA History
* Download PDF Reports

---

## 📧 Notification System

* Failure Alerts
* RCA Generation Alerts
* Email Notifications

---

# 🛠 Technology Stack

| Category          | Technology          |
| ----------------- | ------------------- |
| Frontend          | React.js            |
| Backend           | Node.js, Express.js |
| Database          | MongoDB Atlas       |
| Authentication    | JWT, bcrypt         |
| AI Model          | Grok AI             |
| File Upload       | Multer              |
| Git Analysis      | simple-git          |
| Report Generation | PDFKit              |
| Charts            | Recharts            |
| API Communication | Axios               |

---

# 📁 Project Structure

Pipeline-Failure-RCA-Bot/

├── frontend/

│ ├── public/

│ ├── src/

│ │ ├── components/

│ │ ├── pages/

│ │ ├── services/

│ │ ├── routes/

│ │ └── context/

│

├── backend/

│ ├── controllers/

│ ├── models/

│ ├── routes/

│ ├── middleware/

│ ├── services/

│ ├── uploads/

│ ├── utils/

│ └── config/

│

├── README.md

└── package.json

---

# 🏗 Architecture Diagram

User

↓

React Frontend

↓

Express Backend

↓

Log Comparison Engine

↓

Git Analysis Engine

↓

Grok AI Processing

↓

RCA Report Generator

↓

MongoDB Storage

↓

Results Displayed to User

---

# 🔄 System Workflow

1. User logs into the application.
2. User creates a pipeline.
3. User uploads Success Log and Failure Log.
4. System compares both logs.
5. Git Analyzer retrieves recent code changes.
6. Log differences and Git changes are sent to Grok AI.
7. Grok AI generates:

   * Root Cause
   * Impact Analysis
   * Confidence Score
   * Recommendation
8. RCA report is stored in MongoDB.
9. Results are displayed on the dashboard.
10. User can download the RCA report as PDF.

---

# 🚀 Setup Instructions

## Clone Repository

git clone https://github.com/Nikhilpranesh/-Pipeline-RCA-Bot

cd pipeline-failure-rca-bot

---

## Backend Setup

cd backend

Install Dependencies:

npm install

Create .env File:

PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GROK_API_KEY=your_grok_api_key

GROK_MODEL=grok-3

Start Backend:

npm run dev

---

## Frontend Setup

cd frontend

Install Dependencies:

npm install

Start Frontend:

npm start

---

## Application URLs

Frontend:

http://localhost:3000

Backend:

http://localhost:5000

---

# ▶ Run Instructions

## Start Backend

cd backend

npm run dev

Expected Output:

Server running on port 5000

MongoDB Connected Successfully

---

## Start Frontend

cd frontend

npm start

Expected Output:

Compiled Successfully

Local: http://localhost:3000

---

## Access Application

Open Browser:

http://localhost:3000

---

## Generate RCA

1. Login
2. Create Pipeline
3. Upload success.log
4. Upload failure.log
5. Click Generate RCA
6. View RCA Report
7. Download PDF

---

# 📋 Sample Input

Failure Log:

Database connected

Fetched records

Transformation Error:

Column 'customer_age' not found

Git Diff:

customer_age → age

---

# 📋 Expected Output

Root Cause:

Column name changed from customer_age to age.

Impact:

Transformation stage failed.

Confidence:

96%

Recommendation:

Update ETL mapping configuration and retry pipeline.

---

# 🧠 AI Concepts Used

* Grok AI
* Prompt Engineering
* Root Cause Analysis
* Log Analysis
* Git Diff Analysis
* AI-Based Reasoning
* Structured JSON Output
* Incident Investigation Automation

---

# ⚠ Assumptions

* Users have valid credentials.
* Success logs are available for comparison.
* Failure logs are uploaded correctly.
* Git repository access is available.
* Grok AI API is configured properly.
* MongoDB Atlas is operational.
* Internet connection is available for AI communication.

---

# ⚠ Limitations

* RCA accuracy depends on log quality.
* AI recommendations may require human validation.
* Large log files may impact performance.
* Git analysis requires repository access.
* Real-time log monitoring is not supported.
* Automatic issue fixing is not implemented.

---

# 🔮 Future Enhancements

* Real-Time Log Monitoring
* Similar Failure Detection
* AI Chat Assistant
* Failure Prediction Engine
* Jenkins Integration
* GitHub Actions Integration
* Docker Deployment
* Kubernetes Deployment
* ELK Stack Integration
* Slack Notifications
* Microsoft Teams Notifications
* Automated Retry Execution

---

# 🤖 AI Usage Note

## AI Tools Used

* Grok AI
* ChatGPT
* Claude AI
* GitHub Copilot

## What AI Helped With

* Frontend Development
* Backend API Development
* Prompt Engineering
* MongoDB Integration
* Log Comparison Logic
* Git Analysis Logic
* Debugging
* Documentation

## What AI Got Wrong

* Initial API Integration Issues
* Incorrect Log Parsing Logic
* UI Alignment Problems
* Git Diff Processing Errors

## Human Corrections

* Improved Error Handling
* Refined Prompt Structure
* Fixed API Integration
* Enhanced Dashboard Design
* Optimized RCA Generation Flow

---

# 🎥 Project Demonstration Video

Demo Link:

https://www.loom.com/share/6210f4c5713a499fb4c504dfcc385abe

The demonstration includes:

* Project Overview
* Authentication
* Pipeline Creation
* Log Upload
* Log Comparison
* Git Analysis
* Grok AI RCA Generation
* Dashboard Analytics
* PDF Report Generation

---

# ✅ Project Outcome

Pipeline Failure RCA Bot successfully automates root cause analysis by combining log comparison, Git change tracking, and Grok AI-powered reasoning. The system reduces manual troubleshooting effort, accelerates incident resolution, and improves the reliability of data processing pipelines.

---

# 👨‍💻 Developed By

Team Number – 18

Project: Pipeline Failure RCA Bot
