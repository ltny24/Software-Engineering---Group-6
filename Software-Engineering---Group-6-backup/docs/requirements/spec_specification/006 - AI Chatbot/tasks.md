# Tasks: Functional Group 3 — AI Learning Path Chatbot
**Author:** Lê Thị Như Ý | **Reviewer:** Trần Tường Vi | **Editor:** Lê Thị Như Ý
**Input:** `spec.md`, `plan.md`  


---

## Phase A: Backend Degree Audit & Prerequisite Rule Engines

**Purpose:** Develop core algorithmic services to analyze student transcripts, evaluate prerequisite graphs, and compute graduation timelines without LLM dependency.

- [ ] T033-01 [P] [US2] [AI] Create DTO classes (`CourseSuggestionDTO.java`, `GraduationProgressDTO.java`, `ChatRequestDTO.java`, `ChatResponseDTO.java`) in `backend/src/main/java/com/myus/dto/ai/`
- [ ] T033-02 [P] [US2] [AI] Create repository custom query methods in `CourseRepository.java` and `EnrollmentRepository.java` to fetch completed student coursework and prerequisite mappings in `backend/src/main/java/com/myus/repository/`
- [ ] T033-03 [P] [US2] [AI] Implement `ProfileAnalysisService.java` to retrieve student transcript history, calculate accumulated credits, and compare against major curriculum standards in `backend/src/main/java/com/myus/service/ai/ProfileAnalysisService.java`
- [ ] T033-04 [P] [US2] [AI] Implement `CourseRecommendationService.java` to filter locked subjects via prerequisite checking algorithms and rank top courses for next-semester enrollment in `backend/src/main/java/com/myus/service/ai/CourseRecommendationService.java`
- [ ] T033-05 [P] [US2] [AI] Implement `GraduationTrackingService.java` to calculate remaining credits, project required semesters, and flag unfulfilled milestone requirements in `backend/src/main/java/com/myus/service/ai/GraduationTrackingService.java`

---

## Phase B: Backend AI Orchestration & REST Endpoints

**Purpose:** Integrate external LLM capabilities (e.g., Gemini API) with the algorithmic degree audit data to generate natural conversational counseling and expose secure REST endpoints.

- [ ] T034-01 [P] [US2] [AI] Configure LLM client properties (API keys, model selection e.g., `gemini-2.5-flash`, timeout settings) in `backend/src/main/resources/application.yml` and `AiConfig.java`
- [ ] T034-02 [P] [US2] [AI] Implement prompt engineering templates and context injection logic (RAG) in `ChatbotServiceImpl.java`, combining student transcript summary with natural language prompts in `backend/src/main/java/com/myus/service/ai/impl/ChatbotServiceImpl.java`
- [ ] T034-03 [P] [US2] [AI] Implement error handling and fallback responses in `ChatbotService` to gracefully return rule-based recommendations if the external LLM API experiences latency or downtime in `backend/src/main/java/com/myus/service/ai/impl/ChatbotServiceImpl.java`
- [ ] T034-04 [P] [US2] [AI] Implement REST controller `ChatbotController.java` with endpoints `POST /chat`, `GET /recommendations`, and `GET /progress` secured with `@PreAuthorize("hasRole('STUDENT')")` in `backend/src/main/java/com/myus/controller/ChatbotController.java`

---

## Phase C: Frontend UI & Interactive Chat Components (React + TypeScript)

**Purpose:** Build responsive conversational interface, message history containers, quick-action prompts, and structured rich-text recommendation cards.

- [ ] T035-01 [P] [US2] [AI] Define TypeScript interfaces for chat payloads, recommendation cards, and graduation progress in `frontend/src/types/chatbot.types.ts`
- [ ] T035-02 [P] [US2] [AI] Implement Axios API connector methods (`sendChatMessage`, `getCourseRecommendations`, `getGraduationProgress`) in `frontend/src/services/chatbotService.ts`
- [ ] T035-03 [US2] [AI] Build reusable chat message bubble component `ChatMessageBubble.tsx` supporting Markdown text rendering and distinct student/AI styling in `frontend/src/components/chatbot/`
- [ ] T035-04 [US2] [AI] Build structured recommendation component `CourseSuggestionCard.tsx` displaying course metadata, prerequisite status badges, and "Save to Wishlist" action button in `frontend/src/components/chatbot/`
- [ ] T035-05 [US2] [AI] Build visual progress widget `GraduationRoadmapCard.tsx` rendering credit completion progress bars and pending milestone alerts in `frontend/src/components/chatbot/`
- [ ] T035-06 [US2] [AI] Build horizontal scrollable quick-action prompt chips component `QuickActionChips.tsx` to trigger common counseling queries instantly in `frontend/src/components/chatbot/`
- [ ] T035-07 [US2] [AI] Implement main virtual assistant page `AIChatbotPage.tsx` combining message history auto-scrolling, typing loading skeletons, input textarea, and card rendering in `frontend/src/pages/support/AIChatbotPage.tsx`

---

## Phase D: Verification & Quality Assurance

**Purpose:** Execute unit tests for prerequisite algorithms, MockMvc integration tests for AI controllers, and end-to-end UI verification.

- [ ] T036-01 [P] [US2] [AI] Write Spring Boot JUnit 5 unit tests for `CourseRecommendationService` verifying correct filtering of locked prerequisite courses and ranking logic in `backend/src/test/java/com/myus/service/ai/CourseRecommendationServiceTest.java`
- [ ] T036-02 [P] [US2] [AI] Write MockMvc integration tests for `ChatbotController` verifying JWT authentication, correct JSON payload parsing, and fallback execution in `backend/src/test/java/com/myus/controller/ChatbotControllerTest.java`
- [ ] T036-03 [US2] [AI] Write React Testing Library unit tests for `AIChatbotPage.tsx` verifying quick-action chip clicks dispatch correct requests and render `CourseSuggestionCard` components in `frontend/src/tests/pages/support/AIChatbotPage.test.tsx`
- [ ] T036-04 [US2] [AI] Perform manual end-to-end acceptance testing: Login as student (`24127595`) -> Open AI Chatbot -> Click "Suggest next term courses" -> Verify suggested courses match passed prerequisites -> Click "Save to Wishlist" -> Verify wishlist update in database.
