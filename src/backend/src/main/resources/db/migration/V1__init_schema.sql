-- ==========================================================
-- V1 – Full Initial Schema for MyUS University Portal
-- ==========================================================
-- Creates the 'myus' schema and all base tables required
-- by the application. Subsequent migrations extend this.
-- ==========================================================

-- 1. Schema
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'myus')
BEGIN
    EXEC('CREATE SCHEMA myus');
END
GO

-- 2. Student
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'myus' AND TABLE_NAME = 'Student')
BEGIN
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
END
GO

-- 3. Administrator
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'myus' AND TABLE_NAME = 'Administrator')
BEGIN
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
END
GO

-- 4. Course
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'myus' AND TABLE_NAME = 'Course')
BEGIN
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
END
GO

-- 5. CourseOffering
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'myus' AND TABLE_NAME = 'CourseOffering')
BEGIN
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
END
GO

-- 6. CourseRegistration
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'myus' AND TABLE_NAME = 'CourseRegistration')
BEGIN
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
END
GO

-- 7. Grade
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'myus' AND TABLE_NAME = 'Grade')
BEGIN
    CREATE TABLE myus.Grade (
        gradeId BIGINT IDENTITY(1,1) PRIMARY KEY,
        registrationId BIGINT NULL,
        studentId BIGINT NOT NULL,
        courseId BIGINT NOT NULL,
        gradeValue NVARCHAR(10) NOT NULL,
        gradePoint DECIMAL(4,2) NULL,
        term NVARCHAR(50),
        gpaImpact DECIMAL(5,4) NULL,
        midtermGrade DECIMAL(4,2) NULL,
        finalGrade DECIMAL(4,2) NULL,
        CONSTRAINT FK_Grade_Registration FOREIGN KEY(registrationId) REFERENCES myus.CourseRegistration(registrationId) ON DELETE SET NULL,
        CONSTRAINT FK_Grade_Student FOREIGN KEY(studentId) REFERENCES myus.Student(studentId) ON DELETE NO ACTION,
        CONSTRAINT FK_Grade_Course FOREIGN KEY(courseId) REFERENCES myus.Course(courseId) ON DELETE NO ACTION
    );
END
GO

-- 8. AcademicRecord
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'myus' AND TABLE_NAME = 'AcademicRecord')
BEGIN
    CREATE TABLE myus.AcademicRecord (
        recordId BIGINT IDENTITY(1,1) PRIMARY KEY,
        studentId BIGINT NOT NULL,
        term NVARCHAR(50) NOT NULL,
        cumulativeGPA DECIMAL(4,3) NULL,
        earnedCredits INT NULL,
        CONSTRAINT FK_AcademicRecord_Student FOREIGN KEY(studentId) REFERENCES myus.Student(studentId) ON DELETE CASCADE
    );
END
GO

-- 9. Appeal
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'myus' AND TABLE_NAME = 'Appeal')
BEGIN
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
        expectedGrade DECIMAL(4,2) NULL,
        CONSTRAINT FK_Appeal_Student FOREIGN KEY(studentId) REFERENCES myus.Student(studentId) ON DELETE CASCADE,
        CONSTRAINT FK_Appeal_Grade FOREIGN KEY(gradeId) REFERENCES myus.Grade(gradeId) ON DELETE SET NULL,
        CONSTRAINT FK_Appeal_Admin FOREIGN KEY(reviewerAdminId) REFERENCES myus.Administrator(adminId) ON DELETE SET NULL
    );
END
GO

-- 10. TuitionAccount
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'myus' AND TABLE_NAME = 'TuitionAccount')
BEGIN
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
END
GO

-- 11. Survey
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'myus' AND TABLE_NAME = 'Survey')
BEGIN
    CREATE TABLE myus.Survey (
        surveyId BIGINT IDENTITY(1,1) PRIMARY KEY,
        title NVARCHAR(255) NOT NULL,
        description NVARCHAR(MAX),
        openDate DATETIME2 NULL,
        closeDate DATETIME2 NULL,
        status NVARCHAR(50) NOT NULL DEFAULT 'Draft',
        targetAudience NVARCHAR(255)
    );
END
GO

-- 12. SurveyResponse
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'myus' AND TABLE_NAME = 'SurveyResponse')
BEGIN
    CREATE TABLE myus.SurveyResponse (
        responseId BIGINT IDENTITY(1,1) PRIMARY KEY,
        surveyId BIGINT NOT NULL,
        studentId BIGINT NOT NULL,
        submittedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        answers NVARCHAR(MAX) NOT NULL,
        CONSTRAINT FK_SurveyResponse_Survey FOREIGN KEY(surveyId) REFERENCES myus.Survey(surveyId) ON DELETE CASCADE,
        CONSTRAINT FK_SurveyResponse_Student FOREIGN KEY(studentId) REFERENCES myus.Student(studentId) ON DELETE CASCADE
    );
END
GO

-- 13. FAQArticle
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'myus' AND TABLE_NAME = 'FAQArticle')
BEGIN
    CREATE TABLE myus.FAQArticle (
        faqId BIGINT IDENTITY(1,1) PRIMARY KEY,
        question NVARCHAR(MAX) NOT NULL,
        answer NVARCHAR(MAX) NOT NULL,
        category NVARCHAR(255),
        tags NVARCHAR(500),
        updatedAt DATETIME2 NULL,
        published BIT NOT NULL DEFAULT 0
    );
END
GO

-- 14. ClassTransferRequest
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'myus' AND TABLE_NAME = 'ClassTransferRequest')
BEGIN
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
END
GO

-- 15. ChatbotSession
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'myus' AND TABLE_NAME = 'ChatbotSession')
BEGIN
    CREATE TABLE myus.ChatbotSession (
        sessionId BIGINT IDENTITY(1,1) PRIMARY KEY,
        studentId BIGINT NOT NULL,
        startedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        lastActivityAt DATETIME2 NULL,
        context NVARCHAR(MAX),
        recommendations NVARCHAR(MAX),
        CONSTRAINT FK_Chatbot_Student FOREIGN KEY(studentId) REFERENCES myus.Student(studentId) ON DELETE CASCADE
    );
END
GO

-- ==========================================================
-- Constraints (idempotent — skipped if already present)
-- ==========================================================

-- Status CHECK constraints
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CHK_CourseRegistration_Status')
    ALTER TABLE myus.CourseRegistration ADD CONSTRAINT CHK_CourseRegistration_Status CHECK (status IN ('Requested','Enrolled','Waitlisted','Dropped'));

IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CHK_Appeal_Status')
    ALTER TABLE myus.Appeal ADD CONSTRAINT CHK_Appeal_Status CHECK (status IN ('Submitted','Under Review','Approved','Denied','Withdrawn','CANCELED'));

IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CHK_Survey_Status')
    ALTER TABLE myus.Survey ADD CONSTRAINT CHK_Survey_Status CHECK (status IN ('Draft','Open','Closed'));

IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CHK_Transfer_Status')
    ALTER TABLE myus.ClassTransferRequest ADD CONSTRAINT CHK_Transfer_Status CHECK (status IN ('Requested','Reviewing','Approved','Denied'));

-- Unique index for course registrations
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'UX_CourseRegistration_Student_Offering')
    CREATE UNIQUE INDEX UX_CourseRegistration_Student_Offering ON myus.CourseRegistration(studentId, offeringId) WHERE status IN ('Requested','Enrolled','Waitlisted');
GO
