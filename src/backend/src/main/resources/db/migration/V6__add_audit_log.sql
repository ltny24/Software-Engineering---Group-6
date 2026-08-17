-- V6__add_audit_log.sql
-- Creates the AuditLog table to track administrator access to student records.

CREATE TABLE myus.AuditLog (
    log_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    admin_username NVARCHAR(150) NOT NULL,
    action_type NVARCHAR(50) NOT NULL,
    target_entity NVARCHAR(100) NOT NULL,
    target_entity_id NVARCHAR(100) NOT NULL,
    details NVARCHAR(MAX),
    timestamp DATETIME2 DEFAULT GETDATE() NOT NULL
);

-- Index for faster querying
CREATE INDEX IX_AuditLog_AdminUsername ON myus.AuditLog (admin_username);
CREATE INDEX IX_AuditLog_TargetEntity ON myus.AuditLog (target_entity, target_entity_id);
