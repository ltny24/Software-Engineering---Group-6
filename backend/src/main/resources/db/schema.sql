-- SQL Server schema for MyUS University Portal
-- File: src/backend/src/main/resources/db/schema.sql
SET NOCOUNT ON;

IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'myus')
BEGIN
    EXEC('CREATE SCHEMA myus');
END

GO

-- Students
CREATE TABLE myus.Student (
    studentId BIGINT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(150) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    role NVARCHAR(20) NOT NULL DEFAULT 'STUDENT',
    firstName NVARCHAR(100) NOT NULL,
    middleName NVARCHAR(100),
    lastName NVARCHAR(100) NOT NULL,
    email NVARCHAR(255) NOT NULL UNIQUE,
    phone NVARCHAR(50),
    address NVARCHAR(500),
    dateOfBirth DATE,
    studentType NVARCHAR(50),
    major NVARCHAR(255),
    enrollmentStatus NVARCHAR(50),
    registrationStatus NVARCHAR(50),
    createdAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    updatedAt DATETIME2 NULL
);

-- Administrators
CREATE TABLE myus.Administrator (
    adminId BIGINT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(150) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    role NVARCHAR(20) NOT NULL DEFAULT 'ADMINISTRATOR',
    email NVARCHAR(255) NOT NULL,
    displayName NVARCHAR(255),
    department NVARCHAR(255),
    createdAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

-- Courses
CREATE TABLE myus.Course (
    courseId BIGINT IDENTITY(1,1) PRIMARY KEY,
    courseCode NVARCHAR(50) NOT NULL UNIQUE,
    courseName NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    credits INT NOT NULL DEFAULT 0,
    prerequisites NVARCHAR(MAX),
    department NVARCHAR(255),
    semester NVARCHAR(100),
    capacity INT NULL
);

-- Course Offerings
CREATE TABLE myus.CourseOffering (
    offeringId BIGINT IDENTITY(1,1) PRIMARY KEY,
    courseId BIGINT NOT NULL,
    section NVARCHAR(50),
    term NVARCHAR(100),
    schedule NVARCHAR(500),
    instructor NVARCHAR(255),
    location NVARCHAR(255),
    room NVARCHAR(100),
    CONSTRAINT FK_CourseOffering_Course FOREIGN KEY(courseId) REFERENCES myus.Course(courseId) ON DELETE CASCADE
);

-- Course Registrations
CREATE TABLE myus.CourseRegistration (
    registrationId BIGINT IDENTITY(1,1) PRIMARY KEY,
    studentId BIGINT NOT NULL,
    offeringId BIGINT NOT NULL,
    status NVARCHAR(50) NOT NULL DEFAULT 'Requested',
    registeredAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    gradeId BIGINT NULL,
    CONSTRAINT FK_CourseRegistration_Student FOREIGN KEY(studentId) REFERENCES myus.Student(studentId) ON DELETE CASCADE,
    CONSTRAINT FK_CourseRegistration_Offering FOREIGN KEY(offeringId) REFERENCES myus.CourseOffering(offeringId) ON DELETE CASCADE
);

-- Grades
CREATE TABLE myus.Grade (
    gradeId BIGINT IDENTITY(1,1) PRIMARY KEY,
    registrationId BIGINT NULL,
    studentId BIGINT NOT NULL,
    courseId BIGINT NOT NULL,
    gradeValue NVARCHAR(10) NOT NULL,
    gradePoint DECIMAL(4,2) NULL,
    term NVARCHAR(50),
    gpaImpact DECIMAL(5,4) NULL,
    CONSTRAINT FK_Grade_Registration FOREIGN KEY(registrationId) REFERENCES myus.CourseRegistration(registrationId) ON DELETE SET NULL,
    CONSTRAINT FK_Grade_Student FOREIGN KEY(studentId) REFERENCES myus.Student(studentId) ON DELETE CASCADE,
    CONSTRAINT FK_Grade_Course FOREIGN KEY(courseId) REFERENCES myus.Course(courseId) ON DELETE CASCADE
);

-- Academic Records
CREATE TABLE myus.AcademicRecord (
    recordId BIGINT IDENTITY(1,1) PRIMARY KEY,
    studentId BIGINT NOT NULL,
    term NVARCHAR(50) NOT NULL,
    cumulativeGPA DECIMAL(4,3) NULL,
    earnedCredits INT NULL,
    CONSTRAINT FK_AcademicRecord_Student FOREIGN KEY(studentId) REFERENCES myus.Student(studentId) ON DELETE CASCADE
);

-- Appeals
CREATE TABLE myus.Appeal (
    appealId BIGINT IDENTITY(1,1) PRIMARY KEY,
    studentId BIGINT NOT NULL,
    gradeId BIGINT NULL,
    submittedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    status NVARCHAR(50) NOT NULL DEFAULT 'Submitted',
    appealReason NVARCHAR(MAX) NOT NULL,
    supportingDocumentUrl NVARCHAR(2048),
    reviewerComments NVARCHAR(MAX),
    deadline DATETIME2 NULL,
    resolvedAt DATETIME2 NULL,
    resolutionCode NVARCHAR(50),
    reviewerAdminId BIGINT NULL,
    CONSTRAINT FK_Appeal_Student FOREIGN KEY(studentId) REFERENCES myus.Student(studentId) ON DELETE CASCADE,
    CONSTRAINT FK_Appeal_Grade FOREIGN KEY(gradeId) REFERENCES myus.Grade(gradeId) ON DELETE SET NULL,
    CONSTRAINT FK_Appeal_Admin FOREIGN KEY(reviewerAdminId) REFERENCES myus.Administrator(adminId) ON DELETE SET NULL
);

-- Tuition Accounts
CREATE TABLE myus.TuitionAccount (
    accountId BIGINT IDENTITY(1,1) PRIMARY KEY,
    studentId BIGINT NOT NULL,
    term NVARCHAR(50) NOT NULL,
    totalCharges DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    payments DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    scholarshipAmount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    balance DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    financialHold BIT NOT NULL DEFAULT 0,
    CONSTRAINT FK_TuitionAccount_Student FOREIGN KEY(studentId) REFERENCES myus.Student(studentId) ON DELETE CASCADE,
    CONSTRAINT CHK_Tuition_Balance CHECK (balance = totalCharges - payments - scholarshipAmount)
);

-- Surveys
CREATE TABLE myus.Survey (
    surveyId BIGINT IDENTITY(1,1) PRIMARY KEY,
    title NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    openDate DATETIME2 NULL,
    closeDate DATETIME2 NULL,
    status NVARCHAR(50) NOT NULL DEFAULT 'Draft',
    targetAudience NVARCHAR(255)
);

-- Survey Responses
CREATE TABLE myus.SurveyResponse (
    responseId BIGINT IDENTITY(1,1) PRIMARY KEY,
    surveyId BIGINT NOT NULL,
    studentId BIGINT NOT NULL,
    submittedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    answers NVARCHAR(MAX) NOT NULL,-- JSON or structured text
    CONSTRAINT FK_SurveyResponse_Survey FOREIGN KEY(surveyId) REFERENCES myus.Survey(surveyId) ON DELETE CASCADE,
    CONSTRAINT FK_SurveyResponse_Student FOREIGN KEY(studentId) REFERENCES myus.Student(studentId) ON DELETE CASCADE
);

-- FAQ Articles
CREATE TABLE myus.FAQArticle (
    faqId BIGINT IDENTITY(1,1) PRIMARY KEY,
    question NVARCHAR(MAX) NOT NULL,
    answer NVARCHAR(MAX) NOT NULL,
    category NVARCHAR(255),
    tags NVARCHAR(500),
    updatedAt DATETIME2 NULL,
    published BIT NOT NULL DEFAULT 0
);

-- Class Transfer Requests
CREATE TABLE myus.ClassTransferRequest (
    transferId BIGINT IDENTITY(1,1) PRIMARY KEY,
    studentId BIGINT NOT NULL,
    fromOfferingId BIGINT NOT NULL,
    toOfferingId BIGINT NOT NULL,
    requestDate DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    status NVARCHAR(50) NOT NULL DEFAULT 'Requested',
    reviewerComments NVARCHAR(MAX),
    CONSTRAINT FK_Transfer_Student FOREIGN KEY(studentId) REFERENCES myus.Student(studentId) ON DELETE CASCADE,
    CONSTRAINT FK_Transfer_FromOffering FOREIGN KEY(fromOfferingId) REFERENCES myus.CourseOffering(offeringId) ON DELETE NO ACTION,
    CONSTRAINT FK_Transfer_ToOffering FOREIGN KEY(toOfferingId) REFERENCES myus.CourseOffering(offeringId) ON DELETE NO ACTION
);

-- Chatbot Sessions
CREATE TABLE myus.ChatbotSession (
    sessionId BIGINT IDENTITY(1,1) PRIMARY KEY,
    studentId BIGINT NOT NULL,
    startedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    lastActivityAt DATETIME2 NULL,
    context NVARCHAR(MAX),
    recommendations NVARCHAR(MAX),
    CONSTRAINT FK_Chatbot_Student FOREIGN KEY(studentId) REFERENCES myus.Student(studentId) ON DELETE CASCADE
);

-- Additional constraints: status enumerations
ALTER TABLE myus.CourseRegistration ADD CONSTRAINT CHK_CourseRegistration_Status CHECK (status IN ('Requested','Enrolled','Waitlisted','Dropped'));

ALTER TABLE myus.Appeal ADD CONSTRAINT CHK_Appeal_Status CHECK (status IN ('Submitted','Under Review','Approved','Denied','Withdrawn'));

ALTER TABLE myus.Survey ADD CONSTRAINT CHK_Survey_Status CHECK (status IN ('Draft','Open','Closed'));

ALTER TABLE myus.ClassTransferRequest ADD CONSTRAINT CHK_Transfer_Status CHECK (status IN ('Requested','Reviewing','Approved','Denied'));

-- Optional: ensure registration references unique student-offering combination
CREATE UNIQUE INDEX UX_CourseRegistration_Student_Offering ON myus.CourseRegistration(studentId, offeringId) WHERE status IN ('Requested','Enrolled','Waitlisted');

GO

SET NOCOUNT OFF;
