# AI Learning Path Chatbot Feature Implementation Plan
**Author:** Lê Thị Như Ý | **Reviewer:** Trần Tường Vi | **Editor:** Lê Thị Như Ý

---

# Objective

Create a responsive, intelligent academic counseling assistant that combines a rule-based degree audit engine with an LLM-powered conversational interface. The system enables undergraduate students to receive personalized course recommendations, graduation progress analysis, and academic planning support at any time.

---

# Technical Approach

- Build the conversational interface using React functional components such as:
  - `AIChatbotPage`
  - `ChatMessageBubble`
  - `CourseSuggestionCard`
- Manage chat history, loading states, and typing indicators using React state management.
- Develop a hybrid recommendation engine in Spring Boot consisting of:

### Rule-Based Degree Audit Engine

- Execute SQL Server queries to evaluate:
  - prerequisite relationships
  - corequisite requirements
  - earned credits
  - curriculum completion
- Determine student eligibility for future courses.

### LLM Orchestration Layer

- Integrate Google Gemini Flash 2.5 through LangChain4j or a custom REST client.
- Construct contextual prompts using transcript and degree audit data (RAG approach).
- Generate personalized, natural-language academic guidance.

- Prepare mock transcript data and predefined chatbot responses during UI prototyping to validate chat interactions without requiring a live LLM connection.

---

# Frontend & Backend Responsibility Split

## Frontend (React / TypeScript)

Responsibilities include:

- Manage chat history and conversation state.
- Auto-scroll the conversation window.
- Validate user input.
- Display typing indicators and loading skeletons.
- Render Markdown responses.
- Display interactive UI components inside chat messages:
  - Course Suggestion Cards
  - Graduation Progress Cards
- Trigger API requests through quick-action chips.
- Simulate streaming AI responses and mock recommendation cards during UI development.

---

## Backend (Spring Boot / Java)

Responsibilities include:

- Enforce JWT authentication with `ROLE_STUDENT`.
- Protect transcript privacy by extracting the authenticated student ID.
- Implement `ProfileAnalysisService` to retrieve:
  - completed courses
  - grades
  - curriculum information
- Implement `CourseRecommendationService` to:
  - evaluate prerequisite graphs
  - filter unavailable courses
  - prioritize bottleneck subjects
- Implement `ChatbotService` to:
  - build contextual prompts
  - invoke the external LLM
  - return structured JSON containing conversational text and recommendation metadata

---

# MVP Scope & Architecture Framing

## Core Scope

This sprint delivers the complete AI academic counseling workflow, including:

- Transcript retrieval
- Degree audit analysis
- Prerequisite validation
- Smart course recommendations
- Graduation progress calculation
- Conversational question answering

---

## Out of Scope

The following capabilities are excluded from this sprint:

- One-click course enrollment directly from chat
- Automatic multi-semester schedule generation
- Four-year study planning automation
- Voice-to-text interaction
- Speech synthesis

The objective is to establish a reliable degree audit engine and conversational recommendation system before introducing advanced planning and voice features.

---

# UI Prototype Flow

1. Student opens the **AI Learning Path Chatbot** from the Support or Course Enrollment menu.
2. The chatbot displays a welcome message summarizing:
   - Major
   - Completed credits
   - Current academic standing
3. Student selects the **Suggest next term courses** quick-action chip.
4. A typing indicator appears while transcript analysis and prerequisite validation are performed.
5. The chatbot responds with:
   - A conversational explanation
   - Three interactive Course Suggestion Cards
6. Student clicks **Save to Wishlist** on one of the recommended courses.
7. The selected course is stored for future enrollment planning.

---

# Visual Design Guidelines

## Color Palette

| Element | Color |
|---------|-------|
| Page Background | `#f8fafc` |
| Chat Container | `#ffffff` |
| Chat Border | `#e2e8f0` |

---

## Chat Bubbles

### Student Messages

- Background: `#1e3a8a`
- Text: `#ffffff`
- Alignment: Right

### AI Messages

- Background: `#f1f5f9`
- Text: `#0f172a`
- Alignment: Left

---

## Course Suggestion Cards

Available course:

- White background
- Left border: `#3b82f6`

Prerequisite warning:

- White background
- Left border: `#f59e0b`

---

## UI Style

Use Tailwind CSS utility classes with:

- Consistent spacing
- Rounded corners (`rounded-2xl`)
- Smooth hover and transition effects
- Responsive layouts for desktop, tablet, and mobile devices

---

# Data Model

```ts
interface CourseSuggestionDTO {
  courseOfferingId: number;
  courseCode: string;
  courseName: string;
  credits: number;
  prerequisiteCleared: boolean;
  reasonForRecommendation: string;
}

interface GraduationProgressDTO {
  totalRequiredCredits: number;
  completedCredits: number;
  remainingCredits: number;
  estimatedSemestersLeft: number;
  criticalMilestonesPending: string[];
}

interface ChatRequestDTO {
  studentId?: string;
  message: string;
  contextType:
    | "GENERAL"
    | "COURSE_SUGGESTION"
    | "GRADUATION_AUDIT";
}

interface ChatResponseDTO {
  responseId: string;
  replyText: string;
  timestamp: string;
  suggestedCourses?: CourseSuggestionDTO[];
  graduationProgress?: GraduationProgressDTO;
}
```

---

# REST API Contracts

| Method | Endpoint | Description | Request | Response |
|---------|----------|-------------|---------|----------|
| POST | `/api/v1/chatbot/chat` | Process a natural language query using transcript context | `ChatRequestDTO` | `200 OK` + `ChatResponseDTO` |
| GET | `/api/v1/chatbot/recommendations` | Retrieve recommended courses for the next semester | JWT Authentication | `200 OK` + `CourseSuggestionDTO[]` |
| GET | `/api/v1/chatbot/progress` | Retrieve degree audit information and graduation projection | JWT Authentication | `200 OK` + `GraduationProgressDTO` |

---

# Notes

- The AI Learning Path Chatbot is accessible from the Student Support and Course Enrollment navigation menu.
- Mock datasets should include multiple academic scenarios, including:
  - Students close to graduation
  - Students with many remaining credits
  - Students missing prerequisite courses
  - Students repeating failed subjects
- Mock conversations should cover:
  - Course recommendations
  - Graduation timeline estimation
  - Prerequisite eligibility checks
  - General academic FAQs
- The chatbot interface should remain fully functional using mock responses before backend and LLM integration.
- The final UI should be responsive, polished, and optimized for desktop, tablet, and mobile devices.
- Structured response cards should render independently of plain text responses, allowing future support for streaming AI output and additional recommendation widgets.
