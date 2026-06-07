PROJECT TITLE
Pipeline Failure RCA Bot
==========================================================
ARCHITECTURE OVERVIEW
==========================================================

Pipeline Failure RCA Bot is an AI-powered Root Cause Analysis (RCA) platform that automatically investigates failed ETL jobs, scheduled tasks, and data processing pipelines.

The system analyzes failure logs, compares them with previous successful executions, examines recent Git code changes, and uses Grok AI to generate detailed RCA reports with recommended solutions.

The primary objective is to reduce manual troubleshooting efforts, improve incident resolution time, and increase pipeline reliability.

----------------------------------------------------------
SYSTEM ARCHITECTURE
----------------------------------------------------------
  User
  	  |
  	  V
    React Frontend
  	  |
  	  V
    Express Backend
    	  |
  +----------------------+
  |                      |
  V                      V

Log Analyzer       Git Analyzer
  |                      |
  +----------+-----------+
             |
             V
        Grok AI Engine
             |
             V
      RCA Report Generator
             |
             V
          MongoDB

==========================================================
TECHNOLOGY STACK
==========================================================
Frontend:
- React.js
- React Router
- Axios
- Tailwind CSS
- Recharts

Backend:
- Node.js
- Express.js

Database:
- MongoDB
- Mongoose

Authentication:
- JWT
- bcrypt
AI Integration:
- Grok AI API

File Upload:
- Multer

Git Analysis:
- simple-git

Report Generation:
- PDFKit
==========================================================
FEATURES
==========================================================
1. User Authentication
   - Registration
   - Login
   - JWT Authentication
   - Password Encryption

2. Pipeline Management
   - Create Pipeline
   - View Pipelines
   - Update Pipelines
   - Delete Pipelines

3. Log Upload System
   - Upload Success Logs
   - Upload Failure Logs
   - View Uploaded Logs

4. Log Comparison Engine
   - Compare Success and Failure Logs
   - Detect Missing Steps
   - Identify New Errors
   - Highlight Execution Differences
5. Git Change Analysis
   - Analyze Recent Commits
   - Retrieve Git Differences
   - Detect Modified Files

6. AI-Powered RCA Generation
   - Root Cause Identification
   - Impact Analysis
   - Confidence Score
   - Recommended Fixes

7. Dashboard Analytics
   - Total Pipelines
   - Successful Runs
   - Failed Runs
   - Failure Trends

8. RCA Reports
   - View Reports
   - Download PDF Reports
   - Historical RCA Tracking
==========================================================
SETUP INSTRUCTIONS
==========================================================
PREREQUISITES

Install the following:

- Node.js (v18+)
- npm
- MongoDB
- Git
- Grok AI API Key
----------------------------------------------------------
STEP 1: CLONE REPOSITORY
----------------------------------------------------------

git clone https://github.com/Nikhilpranesh/-Pipeline-RCA-Bot
cd pipeline-failure-rca-bot

----------------------------------------------------------
STEP 2: BACKEND SETUP
----------------------------------------------------------
cd backend

Install dependencies:

npm install

Create a .env file inside backend folder:

PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GROK_API_KEY=your_grok_api_key

GROK_MODEL=grok-3

GIT_REPO_PATH=your_local_git_repository

Start backend server:

npm run dev
Backend URL:

http://localhost:5000

----------------------------------------------------------
STEP 3: FRONTEND SETUP
----------------------------------------------------------
cd frontend

Install dependencies:

npm install

Start frontend:

npm start

Frontend URL:

http://localhost:3000

==========================================================
RUN INSTRUCTIONS
==========================================================

STEP 1: START BACKEND

cd backend

npm run dev

Expected Output:

Server running on port 5000
MongoDB Connected Successfully

----------------------------------------------------------
STEP 2: START FRONTEND

Open another terminal

cd frontend

npm start

Expected Output:

Compiled Successfully

Local:
http://localhost:3000
----------------------------------------------------------

STEP 3: ACCESS APPLICATION

Open browser and navigate to:

http://localhost:3000

----------------------------------------------------------

STEP 4: LOGIN

- Register a new account
- Login with credentials

----------------------------------------------------------

STEP 5: CREATE PIPELINE

Provide:

- Pipeline Name
- Description

----------------------------------------------------------

STEP 6: UPLOAD LOG FILES

Upload:

- success.log
- failure.log

---------------------------------------------------------

STEP 7: GENERATE RCA

Click "Generate RCA"

The system will:

- Compare Logs
- Analyze Git Changes
- Send Context to Grok AI
- Generate RCA Report

----------------------------------------------------------
STEP 8: DOWNLOAD REPORT

View and download RCA report as PDF.

==========================================================
SAMPLE RCA OUTPUT
==========================================================

Pipeline Name:
Customer Data ETL

Root Cause:
Column 'customer_age' was renamed to 'age'
in commit a4b5d6.

Impact:
Transformation stage failed due to schema mismatch.

Confidence Score:
96%

Recommendation:
Update ETL mapping configuration and rerun the pipeline.

==========================================================
ASSUMPTIONS
==========================================================
1. Users have valid credentials.

2. Success and failure logs are available.

3. Uploaded logs are in readable text format.

4. Git repository access is available.

5. Grok AI API is properly configured.

6. MongoDB  is accessible.

7. System has permissions to read logs and repository files.

8. Internet connectivity is available for AI communication.

==========================================================
LIMITATIONS
==========================================================

1. RCA accuracy depends on the quality of uploaded logs.

2. AI-generated recommendations may require human validation.

3. Extremely large logs may increase processing time.

4. Git analysis is limited to accessible repositories.

5. Real-time log monitoring is not supported.

6. Automatic issue fixing is not implemented.

7. Confidence scores are AI estimates and not guaranteed.

8. Failure prediction before execution is outside the scope of the current version

==========================================================
FUTURE ENHANCEMENTS
==========================================================

- Real-Time Log Monitoring
- Similar Failure Detection
- AI Chat Assistant
- Failure Prediction Engine
- Jenkins Integration
- GitHub Actions Integration
- Docker Deployment
- Kubernetes Deployment
- ELK Stack Integration
- Slack Notifications
- Microsoft Teams Notifications
- Automated Retry Execution

==========================================================
CONCLUSION
==========================================================
Pipeline Failure RCA Bot combines log comparison, Git change analysis, and Grok AI-powered reasoning to automatically 
identify the most likely causes of pipeline failures. The platform reduces manual troubleshooting effort, accelerates incident resolution,
improves operational visibility, and enhances the reliability of modern data processing workflows.



