# FG06 – Support & FAQ: Centralized FAQ Access – Test Cases

## Overview

The **Centralized FAQ Access** feature provides students with a centralized interface to search and look up frequently asked questions (FAQs) on the MyUS portal. Students can search by keyword, filter by category, view detailed answers, and request further support when no suitable results are found. The system must correctly handle all search scenarios, even when there are no results.

---

## Test Cases Table

| Test Case ID | Test Scenario | Pre-conditions | Test Steps | Input Data | Expected Output | Test Type | Priority |
|---|---|---|---|---|---|---|---|
| TC_FAQ_01 | Search FAQ with valid keyword | System has FAQ data; student may or may not be logged in | 1. Go to "FAQ / Q&A" section <br>2. Enter keyword in search box <br>3. Click "Search" | Keyword: `appeal` | System displays list of FAQs related to appeal, sorted by relevance | Positive | High |
| TC_FAQ_02 | Search FAQ yielding multiple results | Multiple FAQs contain keyword | 1. Enter popular keyword <br>2. Click search | Keyword: `tuition` | System displays list of multiple related FAQs; with pagination if > 10 results | Positive | High |
| TC_FAQ_03 | Search FAQ yielding exactly 1 result | Highly specific keyword | 1. Enter highly specific keyword <br>2. Click search | Keyword: `VietinBank transaction code` | System displays exactly 1 most relevant FAQ | Positive | Medium |
| TC_FAQ_04 | Search yields no results (non-existent keyword) | System has FAQ data | 1. Enter keyword not in DB <br>2. Click search | Keyword: `xyz_khong_ton_tai_abc` | System displays message: "No results found for your keyword." Suggestion: contact support or view popular FAQs | Negative | High |
| TC_FAQ_05 | Search with empty search box | Student clicks search without input | 1. Leave search box empty <br>2. Click "Search" | Keyword: _(empty)_ | System displays all FAQs or message: "Please enter a keyword to search." | Negative | Medium |
| TC_FAQ_06 | Filter FAQ by "Tuition & Scholarships" category | FAQs are categorized | 1. Go to FAQ page <br>2. Select "Tuition & Scholarships" category from filter | Category: `Tuition & Scholarships` | System only displays FAQs belonging to "Tuition & Scholarships" category | Positive | High |
| TC_FAQ_07 | Filter FAQ by "Appeals & Complaints" category | FAQs are categorized | 1. Select "Appeals & Complaints" category | Category: `Appeals & Complaints` | Only displays FAQs related to appeals | Positive | High |
| TC_FAQ_08 | Filter FAQ by "Course Registration" category | FAQs are categorized | 1. Select "Course Registration" category | Category: `Course Registration` | Only displays FAQs about course registration | Positive | High |
| TC_FAQ_09 | Combine keyword search + category filter | Diverse FAQs exist | 1. Select "Tuition" category <br>2. Enter keyword "late payment" <br>3. Click search | Category: `Tuition`, Keyword: `late payment` | System displays FAQs satisfying both conditions: belongs to Tuition category AND relates to "late payment" | Positive | Medium |
| TC_FAQ_10 | View detailed FAQ answer | Student found needed FAQ | 1. Click on question in search results | Question: `How do I submit an appeal application?` | System displays full answer content, optionally with navigation links, illustrative images | Positive | High |
| TC_FAQ_11 | (Skipped) Search with Vietnamese accented keyword | System supports Unicode Vietnamese | 1. Enter accented keyword <br>2. Search | Keyword: `đăng ký học phần` | System searches correctly and returns related FAQs (without encoding errors) | Positive | High |
| TC_FAQ_12 | Case-insensitive search | System supports case-insensitive search | 1. Enter uppercase keyword <br>2. Search | Keyword: `TUITION` | System returns same results as searching `tuition` (ignores case) | Positive | Medium |
| TC_FAQ_13 | Search with keyword containing special characters | System must sanitize input | 1. Enter special characters in search box <br>2. Click search | Keyword: `<script>alert('xss')</script>` | System does not execute script; escapes characters safely; displays "No results found" or returns empty | Negative | High |
| TC_FAQ_14 | Paginate search results (>10 results) | >10 FAQs match keyword | 1. Search keyword returning multiple results <br>2. Navigate to page 2 | Keyword: `study` | System displays page 1 with first 10 results; pagination buttons available; page 2 displays next results | Positive | Medium |
| TC_FAQ_15 | Rate helpfulness (Like/Dislike) of FAQ answer | Student finished reading answer | 1. View FAQ details <br>2. Click "Helpful" or "Not helpful" | Feedback: `Helpful` | System records feedback, updates "Helpful" count; does not require login (anonymous) | Positive | Low |
| TC_FAQ_16 | View popular FAQs (Most Viewed) | FAQ homepage | 1. Go to FAQ page without searching | _(none)_ | System displays list of "Most Frequently Asked Questions" (Top 5 or Top 10) sorted by views | Positive | Medium |
| TC_FAQ_17 | Request additional support when not found | Search yields no results | 1. View "No results found" message <br>2. Click "Send question to support" button | Question: `I need to know more about...` | System opens support contact form or navigates to "Submit support request" page | Positive | Medium |
| TC_FAQ_18 | Boundary: Search keyword is exactly 1 character | Check minimum length | 1. Enter 1 character in search box <br>2. Click search | Keyword: `h` | System displays warning: "Keyword too short. Please enter at least 2 characters." | Boundary | Medium |
| TC_FAQ_19 | Boundary: Search keyword is 255 characters | Check maximum length | 1. Enter 255-character keyword <br>2. Click search | Keyword: _(255-character string)_ | System processes normally, no errors; returns results or "No results found" | Boundary | Low |
| TC_FAQ_20 | Category has no questions | Newly created Category with no FAQs | 1. Select category with no FAQs | Category: `Newly created (empty)` | System displays: "This category has no questions yet. Please try another category." | Negative | Low |
