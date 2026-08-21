-- ==========================================================
-- V8 – Class Transfer audit fields, offering status, notifications
-- ==========================================================
-- 1. ClassTransferRequest: record which administrator performed the
--    transfer and whether capacity / schedule-conflict checks were overridden.
-- 2. CourseOffering: add a status column so a section can be marked Cancelled.
-- 3. Notification: in-app notifications for affected students (UC-14 3.1.7).
-- ==========================================================

IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
               WHERE TABLE_SCHEMA = 'myus' AND TABLE_NAME = 'ClassTransferRequest' AND COLUMN_NAME = 'adminUsername')
    ALTER TABLE myus.ClassTransferRequest ADD adminUsername NVARCHAR(150) NULL;
GO

IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
               WHERE TABLE_SCHEMA = 'myus' AND TABLE_NAME = 'ClassTransferRequest' AND COLUMN_NAME = 'overrideCapacity')
    ALTER TABLE myus.ClassTransferRequest ADD overrideCapacity BIT NOT NULL DEFAULT 0;
GO

IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
               WHERE TABLE_SCHEMA = 'myus' AND TABLE_NAME = 'ClassTransferRequest' AND COLUMN_NAME = 'overrideConflict')
    ALTER TABLE myus.ClassTransferRequest ADD overrideConflict BIT NOT NULL DEFAULT 0;
GO

IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
               WHERE TABLE_SCHEMA = 'myus' AND TABLE_NAME = 'CourseOffering' AND COLUMN_NAME = 'status')
    ALTER TABLE myus.CourseOffering ADD status NVARCHAR(50) NOT NULL DEFAULT 'Active';
GO

IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES
               WHERE TABLE_SCHEMA = 'myus' AND TABLE_NAME = 'Notification')
BEGIN
    CREATE TABLE myus.Notification (
        notificationId BIGINT IDENTITY(1,1) PRIMARY KEY,
        studentId BIGINT NOT NULL,
        title NVARCHAR(255) NOT NULL,
        message NVARCHAR(MAX),
        readFlag BIT NOT NULL DEFAULT 0,
        createdAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_Notification_Student FOREIGN KEY(studentId) REFERENCES myus.Student(studentId) ON DELETE CASCADE
    );
END
GO
