# Every Health --- Log Monitor

This application allows uploading anonymized healthcare-related logs,
viewing them in a clean UI, and filtering them by **severity** and
**timestamp (date and time)**. The system is designed with privacy,
validation, and production-readiness in mind.

------------------------------------------------------------------------

## ✨ Features

### Backend (Node.js + TypeScript)

-   REST API built with Express
-   SQLite database using Prisma ORM
-   Upload logs via JSON files
-   Server-side filtering by:
    -   Severity (`info`, `warning`, `error`)
    -   Timestamp range (date-only or date + time)
-   Automatic anonymization of sensitive fields (`patient_id`)
-   Input validation using Zod

### Frontend (React + TypeScript)

-   Built with React, TypeScript, and Vite
-   UI styled using Material UI
-   Upload JSON files directly from the browser
-   Filter logs by severity and timestamp
-   Summary statistics (total logs and counts by severity)
-   Responsive and accessible layout
-   No exposure of sensitive data

------------------------------------------------------------------------

## 🧱 Architecture Overview

    frontend/ → React + TypeScript (Vite)
    backend/ → Node.js + Express + Prisma
    database/ → SQLite (local)

    pgsql
    Copy code

-   Frontend communicates with backend via REST APIs
-   Backend is the single source of truth for validation and filtering
-   Sensitive identifiers are anonymized before persistence

------------------------------------------------------------------------

## 📦 Example Log Format

``` json
{
  "timestamp": "2025-03-01T14:25:43Z",
  "source": "medication-service",
  "severity": "error",
  "message": "User XYZ failed medication eligibility check",
  "patient_id": "abc123"
}
```

The `patient_id` field is anonymized before storage and is never
returned to the frontend.

------------------------------------------------------------------------

## 🚀 Running the Project Locally

### Prerequisites

-   Node.js
-   npm

------------------------------------------------------------------------

### 1️⃣ Backend Setup

``` bash
cd backend
npm install
npx prisma migrate deploy
npm run dev
```

The backend will run on:

    http://localhost:4000

------------------------------------------------------------------------

### 2️⃣ Frontend Setup

``` bash
cd frontend
npm install
npm run dev
```

The frontend will run on:

    http://localhost:5173

------------------------------------------------------------------------

## 🧪 Usage

-   Start the backend and frontend
-   Open the frontend in your browser
-   Upload a JSON file containing log entries
-   Use filters to refine logs by severity and timestamp
-   View logs in the table and summary statistics above

------------------------------------------------------------------------

## 🔐 Privacy & Security Notes

-   Sensitive identifiers (`patient_id`) are anonymized before storage
-   No personal or identifying health data is displayed in the UI
-   All input is validated on the backend
-   Designed with healthcare privacy considerations in mind

------------------------------------------------------------------------

## 🔮 Production Considerations

If extended for production use, the system would include:

-   Authentication and role-based access control (RBAC)
-   Encrypted storage and secrets management
-   Pagination for large log volumes
-   Database indexing on timestamps and severity
-   Centralized logging and monitoring
-   Containerized deployment using Docker
-   Cloud deployment (e.g., AWS ECS + RDS or serverless alternatives)

------------------------------------------------------------------------

## 📝 Notes for Reviewers

-   Logs persist locally in SQLite during runtime
-   Timestamp filtering supports both date-only and date + time inputs
-   Time filtering respects exact timestamps when provided
