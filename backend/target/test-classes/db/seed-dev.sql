-- H2-compatible seed data for dev (matches JPA entity column names)
INSERT INTO myus.Administrator (adminId, username, password, role, email, displayName, department) VALUES
(1, 'admin', 'admin', 'ADMINISTRATOR', 'admin@myus.edu.vn', 'Admin User', 'Academic Affairs');

INSERT INTO myus.Student (studentId, username, password, role, firstName, lastName, email, studentType, major, enrollmentStatus, registrationStatus) VALUES
(1, 'student', 'student', 'STUDENT', 'Test', 'User', 'student@myus.edu.vn', 'Regular', 'Software Engineering', 'Enrolled', 'Active');
