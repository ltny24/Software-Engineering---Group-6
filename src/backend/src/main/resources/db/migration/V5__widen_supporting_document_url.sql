-- V5: Alter supportingDocumentUrl column to NVARCHAR(MAX) to support base64-encoded file uploads
IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'myus'
      AND TABLE_NAME = 'Appeal'
      AND COLUMN_NAME = 'supportingDocumentUrl')
BEGIN
    ALTER TABLE myus.Appeal
        ALTER COLUMN supportingDocumentUrl NVARCHAR(MAX);
END
