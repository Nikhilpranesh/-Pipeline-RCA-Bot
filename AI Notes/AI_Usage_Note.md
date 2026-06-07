# AI Usage Note — RAC (Root Cause Analysis) Project

---

## What AI Helped With

- **Scaffolding the project structure** — AI suggested the folder layout separating `backend/` (controllers, models, routes, services, utils) and `frontend/` (pages, components, context, services), saving significant setup time.
- **Writing the `logComparator.js` utility** — AI generated the `compareLogs()` function using the `diff` library to detect missing/unexpected lines and the `detectFlowDivergence()` heuristic (>30% line change threshold).
- **Building the AI service (`aiService.js`)** — AI wrote the full Groq API integration including the `buildPrompt()` function, smart log truncation with error-line prioritization (`ERROR_LINE_RE` regex), and `parseAIResponse()` with JSON cleanup logic.
- **JWT Authentication flow** — AI wrote the `authController.js` with `registerUser`, `loginUser`, and token generation using `jsonwebtoken` and `bcrypt`.
- **PDF Report Generation** — AI produced the `downloadPDF` function in `rcaController.js` using `pdfkit`, including color-coded log differences and structured sections.
- **React frontend pages** — AI helped draft `RcaReport.jsx`, `Dashboard.jsx`, and the `AuthContext.jsx` provider with login state management.
- **Writing boilerplate** — Mongoose models (`User`, `Pipeline`, `Log`, `RcaReport`), route wiring, and middleware (`auth.js`, `upload.js`) were largely AI-generated.

---

## What AI Got Wrong

- **`gitService` import error** — `rcaController.js` imports `analyzeGitChanges` from `'../services/gitService'`, but this file does not exist in the project. AI hallucinated a service that was never created, causing a runtime crash.
- **Overconfident JSON parsing** — AI's initial `parseAIResponse()` did not handle cases where Groq returned plain text instead of JSON, leading to unhandled parse errors. A try-catch wrapper had to be added manually.
- **`diff` library API mismatch** — AI initially used `Diff.diffWords()` instead of `Diff.diffLines()`, producing incorrect line-level comparisons that had to be corrected.
- **Missing `.env` validation** — AI did not add startup checks for required environment variables (`MONGO_URI`, `JWT_SECRET`, `GROQ_API_KEY`), making silent misconfigurations possible.
- **PDF font path assumption** — AI assumed `Helvetica-Bold` was always available without checking `pdfkit` font registration; worked in practice but was fragile.

---

## Best Prompts Used

1. **"Write an Express controller for user registration with bcrypt password hashing and JWT token generation. Return user data without the password field."**
   → Produced clean, production-ready `authController.js` on the first try.

2. **"Compare two CI/CD log strings (success vs failure) using the `diff` npm library. Return missingInFailure, unexpectedInFailure arrays (max 20 lines each), and a flowDivergence boolean if more than 30% of lines differ."**
   → Directly produced the `logComparator.js` logic with the exact heuristic needed.

3. **"Build a prompt-engineering function for a DevOps RCA AI. It should truncate large logs intelligently — prioritizing error lines — and format the prompt to return structured JSON with: jobName, failureTime, rootCause, evidence[], impact, recommendedAction[], confidenceScore."**
   → Gave the best single output of the project; the `buildPrompt()` + `truncateText()` combo worked correctly.

4. **"Create a React AuthContext with login/logout functions, JWT stored in localStorage, and a PrivateRoute component that redirects unauthenticated users to /login."**
   → Saved about 2 hours of setup; minor fix was needed for the token expiry check.
