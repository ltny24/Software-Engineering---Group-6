-- V11__add_diverse_enrollment_status_students.sql
-- Adds students with Graduated, On Leave, and Suspended enrollment statuses
-- to enable filtering by these statuses in the Admin Student Data page.
SET NOCOUNT ON;

-- =====================================================
-- Suspended students (6 students)
-- =====================================================
INSERT INTO myus.Student (username, password, role, firstName, middleName, lastName, email, phone, address, dateOfBirth, studentType, major, enrollmentStatus, registrationStatus) VALUES
('24127115', '$2a$10$XRT9XKuXNdgw9LUCAXg4LuM5MFOflbODxHgK6cmEiqLz9fIjt4sBG', 'STUDENT', N'Duc', N'Minh', N'Nguyen', '24127115@student.myus.edu.vn', '0901230115', N'15 Pham Ngu Lao Street, Pham Ngu Lao Ward, District 1, Ho Chi Minh City', '2004-03-12', N'Regular', N'Software Engineering', 'Suspended', 'Inactive'),
('24127132', '$2a$10$XRT9XKuXNdgw9LUCAXg4LuM5MFOflbODxHgK6cmEiqLz9fIjt4sBG', 'STUDENT', N'Thu', N'Thi', N'Le', '24127132@student.myus.edu.vn', '0901230132', N'88 Nguyen Hue Boulevard, Ben Nghe Ward, District 1, Ho Chi Minh City', '2004-07-24', N'High Quality', N'Information Technology', 'Suspended', 'Inactive'),
('24127148', '$2a$10$XRT9XKuXNdgw9LUCAXg4LuM5MFOflbODxHgK6cmEiqLz9fIjt4sBG', 'STUDENT', N'Phat', N'Quoc', N'Tran', '24127148@student.myus.edu.vn', '0901230148', N'210 Ly Thuong Kiet Street, Ward 15, District 11, Ho Chi Minh City', '2004-11-05', N'Regular', N'Data Science', 'Suspended', 'Inactive'),
('24127165', '$2a$10$XRT9XKuXNdgw9LUCAXg4LuM5MFOflbODxHgK6cmEiqLz9fIjt4sBG', 'STUDENT', N'Mai', N'Thi', N'Pham', '24127165@student.myus.edu.vn', '0901230165', N'37 Vo Van Tan Street, Vo Thi Sau Ward, District 3, Ho Chi Minh City', '2004-05-18', N'Talented Program', N'Computer Science', 'Suspended', 'Inactive'),
('24127181', '$2a$10$XRT9XKuXNdgw9LUCAXg4LuM5MFOflbODxHgK6cmEiqLz9fIjt4sBG', 'STUDENT', N'Cuong', N'Van', N'Dinh', '24127181@student.myus.edu.vn', '0901230181', N'99 Tran Quoc Toan Street, Ward 8, District 3, Ho Chi Minh City', '2004-09-30', N'Regular - Advanced English', N'Artificial Intelligence', 'Suspended', 'Inactive'),
('24127197', '$2a$10$XRT9XKuXNdgw9LUCAXg4LuM5MFOflbODxHgK6cmEiqLz9fIjt4sBG', 'STUDENT', N'Lan', N'Ngoc', N'Hoang', '24127197@student.myus.edu.vn', '0901230197', N'54 Su Van Hanh Street, Ward 12, District 10, Ho Chi Minh City', '2004-01-22', N'High Quality', N'Information Security', 'Suspended', 'Inactive');

-- =====================================================
-- Graduated students (6 students)
-- =====================================================
INSERT INTO myus.Student (username, password, role, firstName, middleName, lastName, email, phone, address, dateOfBirth, studentType, major, enrollmentStatus, registrationStatus) VALUES
('24127121', '$2a$10$XRT9XKuXNdgw9LUCAXg4LuM5MFOflbODxHgK6cmEiqLz9fIjt4sBG', 'STUDENT', N'Hung', N'Thai', N'Bui', '24127121@student.myus.edu.vn', '0901230121', N'120 Hai Ba Trung Street, Da Kao Ward, District 1, Ho Chi Minh City', '2002-04-10', N'Regular', N'Software Engineering', 'Graduated', 'Inactive'),
('24127138', '$2a$10$XRT9XKuXNdgw9LUCAXg4LuM5MFOflbODxHgK6cmEiqLz9fIjt4sBG', 'STUDENT', N'Ngoc', N'Bich', N'Vo', '24127138@student.myus.edu.vn', '0901230138', N'333 Tran Phu Street, Ward 8, District 5, Ho Chi Minh City', '2002-08-14', N'High Quality', N'Information Technology', 'Graduated', 'Inactive'),
('24127155', '$2a$10$XRT9XKuXNdgw9LUCAXg4LuM5MFOflbODxHgK6cmEiqLz9fIjt4sBG', 'STUDENT', N'Khanh', N'Dang', N'Ngo', '24127155@student.myus.edu.vn', '0901230155', N'77 Nguyen Van Linh Boulevard, Tan Phong Ward, District 7, Ho Chi Minh City', '2002-12-01', N'Talented Program', N'Artificial Intelligence', 'Graduated', 'Inactive'),
('24127170', '$2a$10$XRT9XKuXNdgw9LUCAXg4LuM5MFOflbODxHgK6cmEiqLz9fIjt4sBG', 'STUDENT', N'Linh', N'Phuong', N'Do', '24127170@student.myus.edu.vn', '0901230170', N'45 Dong Khoi Street, Ben Nghe Ward, District 1, Ho Chi Minh City', '2002-06-28', N'Regular - Advanced English', N'Data Science', 'Graduated', 'Inactive'),
('24127185', '$2a$10$XRT9XKuXNdgw9LUCAXg4LuM5MFOflbODxHgK6cmEiqLz9fIjt4sBG', 'STUDENT', N'Trung', N'Duc', N'Vu', '24127185@student.myus.edu.vn', '0901230185', N'180 Cong Quynh Street, Pham Ngu Lao Ward, District 1, Ho Chi Minh City', '2002-02-17', N'Regular', N'Computer Science', 'Graduated', 'Inactive'),
('24127200', '$2a$10$XRT9XKuXNdgw9LUCAXg4LuM5MFOflbODxHgK6cmEiqLz9fIjt4sBG', 'STUDENT', N'Hoa', N'Thi', N'Phan', '24127200@student.myus.edu.vn', '0901230200', N'62 Ky Con Street, Nguyen Thai Binh Ward, District 1, Ho Chi Minh City', '2002-10-09', N'High Quality', N'Information Security', 'Graduated', 'Inactive');

-- =====================================================
-- On Leave students (7 students)
-- =====================================================
INSERT INTO myus.Student (username, password, role, firstName, middleName, lastName, email, phone, address, dateOfBirth, studentType, major, enrollmentStatus, registrationStatus) VALUES
('24127127', '$2a$10$XRT9XKuXNdgw9LUCAXg4LuM5MFOflbODxHgK6cmEiqLz9fIjt4sBG', 'STUDENT', N'Tien', N'Phat', N'Lam', '24127127@student.myus.edu.vn', '0901230127', N'28 Bui Vien Street, Pham Ngu Lao Ward, District 1, Ho Chi Minh City', '2005-03-08', N'Regular', N'Software Engineering', 'On Leave', 'Inactive'),
('24127143', '$2a$10$XRT9XKuXNdgw9LUCAXg4LuM5MFOflbODxHgK6cmEiqLz9fIjt4sBG', 'STUDENT', N'Nhi', N'Bao', N'Truong', '24127143@student.myus.edu.vn', '0901230143', N'156 Nguyen Dinh Chieu Street, Ward 6, District 3, Ho Chi Minh City', '2005-07-21', N'High Quality', N'Information Technology', 'On Leave', 'Inactive'),
('24127160', '$2a$10$XRT9XKuXNdgw9LUCAXg4LuM5MFOflbODxHgK6cmEiqLz9fIjt4sBG', 'STUDENT', N'Nam', N'Xuan', N'Ly', '24127160@student.myus.edu.vn', '0901230160', N'300 Le Van Sy Street, Ward 1, Tan Binh District, Ho Chi Minh City', '2005-11-15', N'Talented Program', N'Artificial Intelligence', 'On Leave', 'Inactive'),
('24127176', '$2a$10$XRT9XKuXNdgw9LUCAXg4LuM5MFOflbODxHgK6cmEiqLz9fIjt4sBG', 'STUDENT', N'Yen', N'Kim', N'Dang', '24127176@student.myus.edu.vn', '0901230176', N'19 Nguyen Cu Trinh Street, Nguyen Cu Trinh Ward, District 1, Ho Chi Minh City', '2005-04-03', N'Regular - Advanced English', N'Data Science', 'On Leave', 'Inactive'),
('24127193', '$2a$10$XRT9XKuXNdgw9LUCAXg4LuM5MFOflbODxHgK6cmEiqLz9fIjt4sBG', 'STUDENT', N'An', N'Minh', N'Ha', '24127193@student.myus.edu.vn', '0901230193', N'74 Tran Hung Dao Street, Co Giang Ward, District 1, Ho Chi Minh City', '2005-09-11', N'Regular', N'Computer Science', 'On Leave', 'Inactive'),
('24127205', '$2a$10$XRT9XKuXNdgw9LUCAXg4LuM5MFOflbODxHgK6cmEiqLz9fIjt4sBG', 'STUDENT', N'Quynh', N'Thi', N'Nguyen', '24127205@student.myus.edu.vn', '0901230205', N'500 Dien Bien Phu Street, Ward 21, Binh Thanh District, Ho Chi Minh City', '2005-01-27', N'High Quality', N'Information Security', 'On Leave', 'Inactive'),
('24127218', '$2a$10$XRT9XKuXNdgw9LUCAXg4LuM5MFOflbODxHgK6cmEiqLz9fIjt4sBG', 'STUDENT', N'Hieu', N'Van', N'Cao', '24127218@student.myus.edu.vn', '0901230218', N'88 Ngo Gia Tu Street, Ward 2, District 10, Ho Chi Minh City', '2005-06-06', N'Regular', N'Software Engineering', 'On Leave', 'Inactive');

PRINT 'Added 19 students with diverse enrollment statuses (Suspended, Graduated, On Leave).';
