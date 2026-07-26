# Appeal Status Tracking Feature Implementation Plan

**Author:** Lê Thị Như Ý  | **Reviewer:** Trần Tường Vi   | **Editor:** Lê Thị Như Ý

---

# Objective

Create a responsive, data-driven status tracking dashboard and detail inspection drawer that enables undergraduate students to monitor real-time grade appeal progression, track mandatory fee payment deadlines, and view official administrative feedback. The feature is designed for seamless full-stack integration across the Frontend, Backend, and Database layers.

---

# Technical Approach

- Build the status dashboard and slide-over detail drawer as React functional components using `useState`, `useEffect`, and `useMemo` for efficient client-side filtering and sorting.
- Implement a real-time countdown calculation utility in TypeScript to evaluate remaining business hours for unpaid pending appeals.
- Provide comprehensive mock appeal history records covering every processing state so the UI can be fully validated before backend integration.
- Structure Axios service modules to retrieve appeal summary lists and detailed appeal information on demand.
- Design Spring Boot REST controllers and JPA repository queries to securely retrieve authenticated student appeal records from SQL Server.

---

# Frontend & Backend Responsibility Split

## Frontend (React / TypeScript)

Responsibilities include:

- Render the dashboard summary cards.
- Render the interactive appeal data table.
- Implement search and status filtering.
- Calculate live countdown timers for unpaid appeals.
- Highlight rows in red when less than 24 hours remain before the payment deadline.
- Control slide-over drawer animations and state.
- Render different information based on appeal status.
- Simulate loading indicators, empty states, and API failures using mock data during UI prototyping.

---

## Backend (Spring Boot / Java)

Responsibilities include:

- Enforce JWT authentication and `ROLE_STUDENT` authorization.
- Ensure students can access only their own appeal records.
- Execute optimized JPA queries for summary lists without eagerly loading attachments.
- Automatically mark expired unpaid appeals as `CANCELED` using Spring `@Scheduled` tasks or query-time evaluation.
- Stream attachment files securely or generate signed cloud storage URLs when requested.

---

# MVP Scope & Architecture Framing

## Core Scope

This sprint focuses on implementing the complete tracking workflow:

- Dashboard summary cards
- Status badge rendering
- Search functionality
- Status filtering
- Countdown timer calculation
- Appeal detail drawer
- REST API integration

---

## Out of Scope

The following features are intentionally excluded from this sprint:

- WebSocket real-time updates
- Email notifications
- SMS reminders
- In-app dispute chat
- Push notifications

The goal is to establish a reliable REST-based architecture before introducing real-time communication features.

---

# UI Prototype Flow

1. Student navigates to the **Appeal Status Dashboard**.
2. Dashboard loads metric summary cards and the historical appeal table.
3. Student filters by **Processing** status or searches using a course code.
4. Student notices a highlighted countdown indicating that fee payment is due tomorrow.
5. Student selects **View Details** on a resolved appeal.
6. A slide-over drawer opens showing:
   - Faculty comments
   - Appeal history
   - Updated final grade

---

# Visual Design Guidelines

## Color Palette

| Element | Color |
|----------|-------|
| Page Background | `#f8fafc` |
| Primary Text | `#1e293b` |
| Secondary Text | `#64748b` |

---

## Typography & Layout

- Use Tailwind CSS utility classes.
- Maintain consistent spacing and alignment.
- Ensure responsive layouts for desktop and laptop screens.

---

## Status Badge Colors

| Status | Background | Text |
|---------|------------|------|
| **PENDING** | `#fef9c3` | `#854d0e` |
| **PROCESSING** | `#dbeafe` | `#1e40af` |
| **RESOLVED** | `#dcfce7` | `#166534` |
| **REJECTED** | `#fee2e2` | `#991b1b` |
| **CANCELED** | `#fee2e2` | `#991b1b` |

---

## Table Styling

Alternate row colors should improve readability:

- Odd rows: `#ffffff`
- Even rows: `#f8fafc`

---

# Data Model

```ts
interface AppealAttachmentDTO {
  attachmentId: number;
  fileName: string;
  fileUrl: string;
  fileSizeBytes: number;
  contentType: string;
}

interface AppealSummaryDTO {
  appealId: number;
  trackingCode: string;
  courseOfferingId: number;
  courseCode: string;
  courseName: string;
  examType: string;
  currentGrade: number;
  expectedGrade: number;
  status:
    | "PENDING"
    | "PROCESSING"
    | "RESOLVED"
    | "REJECTED"
    | "CANCELED";
  feeStatus:
    | "UNPAID"
    | "PAID"
    | "WAIVED";
  feePaymentDeadline: string;
  createdAt: string;
}

interface AppealDetailDTO extends AppealSummaryDTO {
  reason: string;
  adminResponse?: string;
  updatedGrade?: number;
  processedAt?: string;
  attachments: AppealAttachmentDTO[];
}
```

---

# REST API Contracts

| Method | Endpoint | Description | Request | Response |
|---------|----------|-------------|---------|----------|
| GET | `/api/v1/appeals/my-appeals` | Retrieve all appeal summaries for the authenticated student | JWT Authentication | `200 OK` + `AppealSummaryDTO[]` |
| GET | `/api/v1/appeals/{trackingCode}` | Retrieve complete appeal details, attachments, and administrative feedback | JWT Authentication | `200 OK` + `AppealDetailDTO` |

---

# Notes

- The dashboard belongs within the Student Academic → Appeals section.
- It should be directly accessible after successfully submitting a new appeal.
- Mock data should include at least one appeal in every status:
  - `PENDING`
  - `PROCESSING`
  - `RESOLVED`
  - `REJECTED`
  - `CANCELED`
- The UI should appear polished and fully responsive on desktop and laptop devices even before backend integration.
- Attachment data should be loaded lazily to minimize unnecessary network traffic.
- Countdown timers should update automatically without requiring a full page refresh.
