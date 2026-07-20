# Mock Data Guide & Credentials - MyUS University Portal

The SQL script `mock_data_myus.sql` is ready for the SQL Server database of the **MyUS University Portal** system.

---

## 1. Login Credentials & Naming Conventions

### Administrator Accounts
- **Quantity**: 15 accounts (`admin001` to `admin015`).
- **Username**: `admin001`, `admin002`, ..., `admin015`
- **Password**: Matches Username exactly (`admin001`, `admin002`, ...)
- **Email Format**: `admin001@hcmus.edu.vn`
- **Sample Credentials**:
  - Username: `admin001` | Password: `admin001` | Email: `admin001@hcmus.edu.vn`
  - Username: `admin002` | Password: `admin002` | Email: `admin002@hcmus.edu.vn`

---

### Student Accounts (HCMUS)
- **Quantity**: 2,000 students.
- **Student ID (MSSV)**: Ranging from `24127001` to `24129000`
- **Username**: Student ID (e.g., `24127001`)
- **Password**: `<Student_ID>123` (e.g., `24127001123`)
- **Email Format**: `<Student_ID>@student.hcmus.edu.vn`
- **Sample Credentials**:
  - MSSV: `24127001` | Password: `24127001123` | Email: `24127001@student.hcmus.edu.vn`
  - MSSV: `24127002` | Password: `24127002123` | Email: `24127002@student.hcmus.edu.vn`
  - MSSV: `24127586` | Password: `24127586123` | Email: `24127586@student.hcmus.edu.vn`

---

## 2. Seeded Data Overview

1. **Course**: Standard HCMUS curriculum courses (Calculus 1, Linear Algebra, Intro to Programming, Data Structures & Algorithms, Operating Systems, Computer Networks, Artificial Intelligence, Marxist-Leninist Philosophy, etc.).
2. **CourseOffering**: Offered sections assigned to terms (`2024-2025-HK1`, `2024-2025-HK2`, `2025-2026-HK1`) at the 227 Nguyen Van Cu campus.
3. **CourseRegistration & Grade**: Sample course enrollments and academic transcript records.
4. **TuitionAccount & TuitionPayment**: Tuition fee structures (12,000,000 VND), scholarship details, and completed bank transfer transactions.
5. **FAQArticle**: FAQ articles covering online course registration, grade appeals, and tuition payment procedures.

---

## 3. How to Import Data into SQL Server

1. Ensure `schema.sql` has been executed to create all tables inside the `myus` schema.
2. Open `mock_data_myus.sql` in SQL Server Management Studio (SSMS), Azure Data Studio, or IntelliJ Database Tool.
3. Run/Execute the script (`Ctrl + Shift + E`).