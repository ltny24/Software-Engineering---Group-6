IF NOT EXISTS (
    SELECT 1
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA = 'myus'
      AND TABLE_NAME = 'TuitionAccount'
)
BEGIN
    CREATE TABLE myus.TuitionAccount (
        accountId BIGINT IDENTITY(1,1) PRIMARY KEY,
        studentId BIGINT NOT NULL,
        term NVARCHAR(50) NOT NULL,
        totalCharges DECIMAL(12,2) NOT NULL DEFAULT 0.00,
        payments DECIMAL(12,2) NOT NULL DEFAULT 0.00,
        scholarshipAmount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
        balance DECIMAL(12,2) NOT NULL DEFAULT 0.00,
        financialHold BIT NOT NULL DEFAULT 0
    );
END;
