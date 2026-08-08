# FG03 – Course Enrollment: AI Learning Path Chatbot – Test Cases

## Overview

The **AI Learning Path Chatbot** feature (UC-03b) acts as an extension to standard course registration. It allows students to consult an AI advisor that analyzes their completed credits and major requirements to suggest courses. These suggestions can be accepted to auto-fill the registration cart.

---

## Test Cases Table

| Test Case ID | Test Scenario | Pre-conditions | Test Steps | Input Data | Expected Output | Test Type | Priority |
|---|---|---|---|---|---|---|---|
| TC_AIL_01 | Open AI Chatbot during registration | Student is on the Course Registration screen | 1. Click "AI Course Advisor" icon | _(none)_ | System opens the AI chatbot interface | Positive | High |
| TC_AIL_02 | Receive course recommendations | Student opens chatbot | 1. Ask "What should I take next semester?" | "What should I take next semester?" | AI analyzes transcript/major requirements and suggests a list of relevant courses | Positive | High |
| TC_AIL_03 | Accept AI course suggestion | AI has suggested courses | 1. Click "Accept" next to a suggested course | Course: `Data Structures` | Course is automatically added to the registration cart (triggers UC-03a prerequisites check) | Positive | High |
| TC_AIL_04 | Decline AI course suggestion | AI has suggested courses | 1. Click "Decline" next to a suggested course | Course: `Data Structures` | Course is dismissed from suggestions; AI may offer an alternative | Alternative | Medium |
| TC_AIL_05 | Accepted suggestion violates prerequisite | Student accepts a course they aren't eligible for | 1. Click "Accept" | Course: `Advanced ML` (Prereqs unmet) | Cart validation fails; student is returned to chatbot with error message for a revised suggestion | Negative | High |
| TC_AIL_06 | Accepted suggestion causes schedule conflict | Student accepts a course overlapping with cart | 1. Click "Accept" | Course with overlapping time | System flags conflict; student is prompted to resolve it or ask AI for a different schedule | Negative | High |
| TC_AIL_07 | Graceful degradation if AI is down | AI API is unreachable/timeout | 1. Open chatbot / Request suggestion | _(API failure)_ | System displays friendly error: "AI Advisor is currently unavailable"; allows manual registration to continue | Negative | High |
