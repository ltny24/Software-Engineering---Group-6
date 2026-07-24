-- V3__seed_accounts.sql
-- Seed default student and administrator accounts for development/testing.
-- Passwords: both accounts use "010106" (BCrypt-hashed).

-- ============================================================
-- Student account (username: student / password: 010106)
-- ============================================================
IF NOT EXISTS (SELECT 1 FROM myus.Student WHERE username = N'student')
BEGIN
    INSERT INTO myus.Student (
        username,
        password,
        role,
        firstName,
        lastName,
        email,
        major,
        enrollmentStatus,
        registrationStatus,
        createdAt
    ) VALUES (
        N'student',
        N'$2b$10$VNiTssTWqVNpOebIe.cBbOLYnGFKXqg/ms1fWhvZT1Y/aYELwu9Wq',
        N'STUDENT',
        N'Test',
        N'Student',
        N'student@myus.edu.vn',
        N'Computer Science',
        N'ACTIVE',
        N'OPEN',
        SYSUTCDATETIME()
    );
    PRINT 'Inserted student account: student / 010106';
END
ELSE
BEGIN
    PRINT 'Student account "student" already exists — skipping.';
END

-- ============================================================
-- Administrator account (username: admin123 / password: 010106)
-- ============================================================
IF NOT EXISTS (SELECT 1 FROM myus.Administrator WHERE username = N'admin123')
BEGIN
    INSERT INTO myus.Administrator (
        username,
        password,
        role,
        email,
        displayName,
        department,
        createdAt
    ) VALUES (
        N'admin123',
        N'$2b$10$VNiTssTWqVNpOebIe.cBbOLYnGFKXqg/ms1fWhvZT1Y/aYELwu9Wq',
        N'ADMINISTRATOR',
        N'admin@myus.edu.vn',
        N'System Administrator',
        N'IT Department',
        SYSUTCDATETIME()
    );
    PRINT 'Inserted admin account: admin123 / 010106';
END
ELSE
BEGIN
    PRINT 'Admin account "admin123" already exists — skipping.';
END
