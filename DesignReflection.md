# Design Reflection — Every Health Log Monitor

> A short write-up of what I built, why I built it this way, what went well, what hurt a little, and how I’d take it to production.

---

## 1) Design choices and trade-offs

### Architecture: “Thin UI, strong backend”
I intentionally kept the frontend focused on **user intent** (upload, filters, display) and pushed the important logic to the backend:
- Validation (Zod)
- Anonymization (`patient_id`)
- Filtering by severity + timestamp

**Why:** In a sensitive domain, the backend should be the source of truth. A UI-only validation approach is too easy to bypass.

**Trade-off:** More backend code and stricter contracts between frontend and backend (but that’s a good thing for correctness).

---

### Storage: SQLite + Prisma
I used **SQLite** with **Prisma** because it’s:
- Lightweight and easy to run locally (reviewer-friendly)
- Still a real database (unlike in-memory only)
- Gives me a clean schema + query interface

**Trade-off:** SQLite isn’t the right choice for production at scale or for concurrent heavy writes — but it’s perfect for the challenge and clear design.

---

### Sensitive data: anonymize at ingestion time
I treat `patient_id` as confidential information: never display it, and ideally never store it raw.
So I **anonymize before persistence** and never return it from any API responses.

**Trade-off:** If an operator ever needed the raw `patient_id` for a real support workflow, this design intentionally prevents that. In production, that would be handled via a secure lookup system with strict RBAC, auditing, and encryption, not by showing it in a dashboard.

---

### Filtering: server-side + time-aware logic
Filtering happens on the backend using Prisma queries:
- `severity` (info/warning/error)
- `from` / `to` timestamp range

I made the filter logic **time-aware**:
- If the input includes a time, I respect it
- If it’s date-only, I expand it to start/end of day

**Trade-off:** You must be careful about timezone behavior and input formats. I kept the contract strict and ISO-based.

---

## 2) What would change in production (privacy, scaling, monitoring)

### Privacy / Security
In production, I’d harden privacy beyond “don’t show patient_id”:
- **Encryption at rest** (DB-level + backups)
- **Encryption in transit** (TLS everywhere)
- **Secrets management** (AWS Secrets Manager / Parameter Store)
- **Data minimization by default** (store only what’s needed, redact aggressively)
- **PII/PHI scanning** in logs (prevent leakage in `message` fields)

Additionally:
- Introduce a “redaction pipeline” for free-text log messages
- Explicit data retention policies (e.g., 30/60/90 days depending on need)

---

### Scaling
If log volume grows (it will), I’d add:
- Pagination on `/logs` (cursor-based pagination is best)
- Indexes on `timestamp` and `severity`
- Background ingestion or buffering (SQS/Kinesis)
- Separation of ingestion vs query workloads

At higher scale, I’d consider:
- PostgreSQL with read replicas
- Or a log-oriented store (OpenSearch / Loki) depending on query patterns

---

### Monitoring / Observability
For production reliability I’d add:
- Structured logging (JSON logs)
- Request tracing / correlation IDs
- Metrics: request latency, error rates, ingestion rate
- Dashboards + alerts (CloudWatch / Grafana)
- Health checks + readiness probes

This matters especially because “monitoring the monitoring tool” is not optional.

---

## 3) How I’d deploy this on AWS

### Minimal, clean deployment (good for early stage)
**Frontend**
- Build static assets
- Host on **S3 + CloudFront**
- Route with **Route 53**
- Use HTTPS via ACM

**Backend**
- Containerize Express app (Docker)
- Deploy to **ECS Fargate**
- Put behind an **Application Load Balancer (ALB)**
- Store config in **SSM Parameter Store** or **Secrets Manager**

**Database**
- Move from SQLite to **RDS PostgreSQL**
- Add indexes on timestamp/severity
- Automated backups + encryption at rest enabled

**Networking**
- VPC with public/private subnets
- Backend + DB in private subnets
- ALB in public subnet
- Security groups locked down tightly

---

### More scalable ingestion (next step)
If ingestion is high volume:
- Upload → S3
- Parse + validate via Lambda or ECS worker
- Queue via SQS
- Persist to DB / log store
This decouples user uploads from DB writes and improves resilience.

---

## 4) Expansion plan: auth, RBAC, audit logs

### Authentication
I’d add:
- OIDC-based auth (Auth0 / Cognito / Clerk)
- Short-lived access tokens
- Session management with refresh tokens

### RBAC (Role-Based Access Control)
Start simple:
- `admin`: manage users, retention policies, full access
- `support`: view logs, filter, export
- `engineer`: view + advanced diagnostics
- `auditor`: read-only with extended audit trail visibility

RBAC would be enforced:
- In backend middleware
- At the route level (and eventually at the query level)

### Audit logs
This is crucial for healthcare-adjacent systems.

I’d log events like:
- User logged in/out
- Logs uploaded (who/when/how many)
- Filters applied (especially if they could narrow to sensitive info)
- Exports/downloads
- Admin actions (role changes, retention changes)

Audit log characteristics:
- Append-only
- Tamper-resistant storage (e.g., separate DB table + WORM-style storage, or CloudTrail-like approach)
- Queryable for compliance

---

## Real issues I hit (and how I fixed them)

### 1) Timestamp filtering “worked” but didn’t actually filter
Symptoms: UI looked fine, requests were made, but results didn’t change as expected.

Root causes:
- The backend was normalizing timestamps to day boundaries even when time was provided.
- There was also some confusing behavior from caching / reusing responses during quick iteration.

Fix:
- Updated backend logic to respect time when an ISO time is present, and only apply day boundaries for date-only inputs.
- Verified behavior using the network inspector and controlled test logs.

---

### 2) TypeScript/ESLint friction (the “why is this red?” phase)
Issues like:
- `type-only import` errors (`verbatimModuleSyntax`)
- `no-explicit-any` warnings
- casing mismatch in file names (`logsApi.ts` vs `logsAPI.ts`) on macOS

Fix:
- Switched to `import type { ... }`
- Replaced `any` with safer types / `unknown` and explicit parsing
- Standardized file naming to avoid case-sensitive build failures

---

## Closing note
The biggest lesson from this project is that correctness lives at the boundaries:
- frontend ↔ backend contracts
- timestamps ↔ timezones
- privacy policies ↔ real data flows

I built the system to be safe-by-default, easy to reason about, and extendable into a production-grade service.
