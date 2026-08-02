# FG01 – Student Profile Update: Test Cases

## Overview

The **Student Profile Update** feature allows students to update their personal information on the MyUS portal, including: phone number, email address, permanent/temporary residence address, and emergency contact information. The system must validate the input data format and ensure that mandatory fields are not left blank before saving changes.

---

## Test Cases Table

| Test Case ID | Test Scenario | Pre-conditions | Test Steps | Input Data | Expected Output | Test Type | Priority |
|---|---|---|---|---|---|---|---|
| TC_PROF_01 | Update valid phone number (Skipped - UI/API mismatch) | Student is logged in; Profile page is open | 1. Go to "Update Profile" <br>2. Clear old phone number, enter new phone number <br>3. Click "Save changes" | Phone: `0912345678` | System displays "Update successful" message, new phone number is saved to DB and displayed on Profile page | Positive | High |
| TC_PROF_02 | Update valid email address | Student is logged in | 1. Go to "Update Profile" <br>2. Enter new email in Email field <br>3. Click "Save changes" | Email: `nguyenvana@gmail.com` | System successfully saves new email, displays "Update successful" message | Positive | High |
| TC_PROF_03 | Update permanent residence address | Student is logged in | 1. Go to "Update Profile" <br>2. Enter new address in "Permanent Address" field <br>3. Click "Save changes" | Address: `123 Le Loi, District 1, HCMC` | System successfully saves new address | Positive | Medium |
| TC_PROF_04 | Update emergency contact information | Student is logged in | 1. Go to "Emergency Contact" section <br>2. Enter name, relationship, phone number of contact <br>3. Click "Save changes" | Name: `Nguyen Thi B`, Relationship: `Mother`, Phone: `0987654321` | Emergency contact information is saved and displayed correctly | Positive | High |
| TC_PROF_05 | Enter invalid phone format (Skipped) (contains letters) | Student is logged in | 1. Go to "Phone number" field <br>2. Enter phone number containing letters <br>3. Click "Save changes" | Phone: `09abc12345` | System displays error: "Invalid phone number. Please enter numbers only." Data is not saved | Negative | High |
| TC_PROF_06 | Enter invalid phone format (Skipped) (missing digits) | Student is logged in | 1. Go to "Phone number" field <br>2. Enter phone number with less than 10 digits <br>3. Click "Save changes" | Phone: `09123` | System displays error: "Phone number must have 10 digits." | Negative | High |
| TC_PROF_07 | Enter invalid email format (missing @) | Student is logged in | 1. Go to "Email" field <br>2. Enter email without `@` character <br>3. Click "Save changes" | Email: `nguyenvangmail.com` | System displays error: "Invalid email address." | Negative | High |
| TC_PROF_08 | Enter invalid email format (missing domain) | Student is logged in | 1. Go to "Email" field <br>2. Enter email missing domain part <br>3. Click "Save changes" | Email: `nguyenvan@` | System displays error: "Invalid email address." | Negative | High |
| TC_PROF_09 | Leave Email field blank (mandatory) | Student is logged in | 1. Clear entire "Email" field <br>2. Click "Save changes" | Email: _(empty)_ | System displays error: "Email cannot be empty." Data is not saved | Negative | High |
| TC_PROF_10 | Leave Phone number field blank (Skipped) (mandatory) | Student is logged in | 1. Clear entire "Phone number" field <br>2. Click "Save changes" | Phone: _(empty)_ | System displays error: "Phone number cannot be empty." | Negative | High |
| TC_PROF_11 | Leave emergency contact name field blank | Student is logged in | 1. Clear "Emergency contact name" field <br>2. Click "Save changes" | Name: _(empty)_ | System displays error: "Emergency contact name cannot be empty." | Negative | Medium |
| TC_PROF_12 | Enter exactly 10 digits for phone (Skipped) (boundary min) | Student is logged in | 1. Enter exactly 10-digit phone number <br>2. Click "Save changes" | Phone: `0123456789` | System accepts and saves successfully | Boundary | High |
| TC_PROF_13 | Enter 11 digits for phone (Skipped) (boundary max) | Student is logged in | 1. Enter 11-digit phone number <br>2. Click "Save changes" | Phone: `01234567891` | System displays error: "Invalid phone number (maximum 10 digits)." | Boundary | Medium |
| TC_PROF_14 | Email length maximum 255 characters (boundary) | Student is logged in | 1. Enter email with exactly 255 characters <br>2. Click "Save changes" | Email: _(valid 255-character string)_ | System accepts and saves successfully | Boundary | Low |
| TC_PROF_15 | Email length exceeds 255 characters (boundary) | Student is logged in | 1. Enter email with length > 255 characters <br>2. Click "Save changes" | Email: _(256+ character string)_ | System displays error: "Email cannot exceed 255 characters." | Boundary | Low |
| TC_PROF_16 | Update temporary address with special characters | Student is logged in | 1. Enter address with valid special characters <br>2. Click "Save changes" | Address: `Ward 10, Binh Thanh Dist - HCMC` | System accepts and saves successfully | Positive | Low |
| TC_PROF_17 | Update multiple fields simultaneously (Skipped phone testing) | Student is logged in | 1. Enter new Phone, Email, Address simultaneously <br>2. Click "Save changes" | Phone: `0911223344`, Email: `test@stu.edu.vn`, Address: `456 Nguyen Trai` | All changes saved successfully, displays "Update successful" message | Positive | High |
| TC_PROF_18 | Cancel changes after data entry | Student is logged in, currently entering new data | 1. Enter new information in fields <br>2. Click "Cancel" | Any new data | System does not save changes, reverts to old data | Positive | Medium |
