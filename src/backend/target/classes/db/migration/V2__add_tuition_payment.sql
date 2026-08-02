IF NOT EXISTS (
    SELECT 1
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA = 'myus'
      AND TABLE_NAME = 'TuitionPayment'
)
BEGIN
    CREATE TABLE myus.TuitionPayment (
        paymentId BIGINT IDENTITY(1,1) PRIMARY KEY,
        accountId BIGINT NOT NULL,
        amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
        paymentDate DATETIME2 NOT NULL,
        paymentMethod NVARCHAR(50),
        referenceNumber NVARCHAR(100),
        status NVARCHAR(50),
        CONSTRAINT FK_TuitionPayment_TuitionAccount FOREIGN KEY(accountId) REFERENCES myus.TuitionAccount(accountId) ON DELETE CASCADE
    );
END;
