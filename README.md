# MyUS — Hệ Thống Cổng Thông Tin Sinh Viên (University Portal)

MyUS là hệ thống cổng thông tin sinh viên được xây dựng cho Trường Đại học Khoa học Tự nhiên, ĐHQG-HCM. Hệ thống cung cấp nền tảng tập trung để sinh viên đăng ký học phần, xem điểm, nộp đơn khiếu nại điểm, quản lý học phí, tham gia khảo sát, tra cứu FAQ và tương tác với chatbot AI hỗ trợ.

---

## Mục Lục

- [Tính Năng](#tính-năng)
- [Công Nghệ Sử Dụng](#công-nghệ-sử-dụng)
- [Cấu Trúc Dự Án](#cấu-trúc-dự-án)
- [Yêu Cầu Hệ Thống](#yêu-cầu-hệ-thống)
- [Hướng Dẫn Cài Đặt & Chạy](#hướng-dẫn-cài-đặt--chạy)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Thiết Lập Database](#2-thiết-lập-database)
  - [3. Cấu Hình Backend](#3-cấu-hình-backend)
  - [4. Chạy Backend](#4-chạy-backend)
  - [5. Chạy Frontend](#5-chạy-frontend)
- [Hướng Dẫn Sử Dụng Database](#hướng-dẫn-sử-dụng-database)
  - [Cấu Trúc Database](#cấu-trúc-database)
  - [Sơ Đồ Quan Hệ (ERD)](#sơ-đồ-quan-hệ-erd)
  - [Kết Nối Database](#kết-nối-database)
  - [Các Thao Tác Database Thường Dùng](#các-thao-tác-database-thường-dùng)
- [Tài Khoản Mẫu](#tài-khoản-mẫu)
- [API Documentation](#api-documentation)
- [Xử Lý Sự Cố](#xử-lý-sự-cố)
- [Nhóm Phát Triển](#nhóm-phát-triển)

---

## Tính Năng

| Module | Mô Tả |
|--------|-------|
| 🔐 **Xác Thực & Phân Quyền** | Đăng nhập JWT, vai trò Student / Administrator, BCrypt mã hóa mật khẩu |
| 📚 **Quản Lý Khóa Học** | Xem danh sách môn học, học phần, đăng ký / hủy đăng ký |
| 📊 **Xem Điểm & GPA** | Bảng điểm, điểm GPA tích lũy, hồ sơ học tập theo học kỳ |
| ⚖️ **Khiếu Nại Điểm** | Nộp đơn khiếu nại điểm, theo dõi trạng thái xử lý |
| 💰 **Học Phí** | Xem số dư học phí, lịch sử thanh toán, học bổng |
| 📝 **Khảo Sát** | Tham gia khảo sát sinh viên, xem kết quả |
| ❓ **FAQ** | Tra cứu câu hỏi thường gặp, đánh giá hữu ích |
| 🔄 **Chuyển Lớp** | Yêu cầu chuyển lớp học phần |
| 🤖 **Chatbot AI** | Trợ lý ảo Gemini AI hỗ trợ sinh viên |

---

## Công Nghệ Sử Dụng

### Backend
- **Java** + **Spring Boot** (REST API)
- **Spring Security** + **JWT** (Xác thực & phân quyền)
- **Spring Data JPA** + **Hibernate** (ORM)
- **Flyway** (Database migration)
- **Microsoft SQL Server** (Database chính)
- **Gemini AI API** (Chatbot)

### Frontend
- **React 18** + **TypeScript**
- **React Router** (Điều hướng)
- **Axios** (HTTP client)
- **React Hook Form** + **Zod** (Form & validation)
- **Zustand** (State management)
- **Recharts** (Biểu đồ)
- **React Hot Toast** (Thông báo)

---

## Cấu Trúc Dự Án

```
.
├── docs/                           # Tài liệu dự án
│   ├── analysis-and-design/        # Phân tích & thiết kế
│   ├── management/                 # Quản lý dự án (hợp đồng, báo cáo, kế hoạch)
│   ├── requirements/               # Đặc tả yêu cầu, vision, use case
│   ├── survey/                     # Dữ liệu khảo sát người dùng
│   └── test/                       # Test plan, scripts, reports
├── src/
│   ├── backend/                    # Spring Boot backend
│   │   └── src/main/resources/
│   │       ├── db/
│   │       │   ├── schema.sql      # Schema database
│   │       │   ├── mock_data_myus.sql # Dữ liệu mẫu
│   │       │   └── migration/      # Flyway migration scripts
│   │       └── application.properties # Cấu hình ứng dụng
│   ├── frontend/                   # React frontend
│   └── tests/                      # Kiểm thử tự động
│   └── SpecKit/                    # Tài liệu SpecKit
└── README.md
```

---

## Yêu Cầu Hệ Thống

| Phần Mềm | Phiên Bản | Ghi Chú |
|----------|-----------|---------|
| Java JDK | 17 hoặc 21 | `java -version` để kiểm tra |
| Node.js | ≥ 18.x | `node -v` để kiểm tra |
| npm | ≥ 9.x | Đi kèm Node.js |
| Maven | 3.8+ | Dự án đã có Maven Wrapper (`mvnw`) |
| SQL Server | 2019+ | Hoặc MySQL 8.0+ |
| Git | — | Quản lý mã nguồn |

---

## Hướng Dẫn Cài Đặt & Chạy

### 1. Clone Repository

```bash
git clone <repository-url>
cd Software-Engineering---Group-6
```

### 2. Thiết Lập Database

#### Bước 2.1: Tạo Database

Mở SQL Server Management Studio (SSMS) hoặc công cụ quản lý database bạn dùng và tạo database mới:

```sql
CREATE DATABASE MyUS;
GO
```

#### Bước 2.2: Chạy Script Schema

Chạy file schema để tạo tất cả các bảng:

```
src/backend/src/main/resources/db/schema.sql
```

Script này sẽ tạo schema `myus` và tất cả các bảng cần thiết.

#### Bước 2.3: Chạy Script Dữ Liệu Mẫu

Chạy file dữ liệu mẫu để có tài khoản test và dữ liệu demo:

```
src/backend/src/main/resources/db/mock_data_myus.sql
```

### 3. Cấu Hình Backend

Mở file `src/backend/src/main/resources/application.properties` và cập nhật thông tin kết nối database:

```properties
# SQL Server connection
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=MyUS;encrypt=false;trustServerCertificate=true
spring.datasource.username=sa
spring.datasource.password=YourPasswordHere
```

> **Lưu ý:** Mật khẩu được lưu trong `application.properties` dưới dạng plain text. KHÔNG commit mật khẩu thật lên repository. Sử dụng biến môi trường (`SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`) cho môi trường production.

### 4. Chạy Backend

Mở terminal, điều hướng vào thư mục backend:

```bash
cd src/backend

# macOS / Linux
./mvnw clean install -DskipTests
./mvnw spring-boot:run -DskipTests

# Windows
mvnw.cmd clean install -DskipTests
mvnw.cmd spring-boot:run -DskipTests
```

Backend sẽ chạy tại: **http://localhost:8080**

API docs (Swagger UI): **http://localhost:8080/swagger-ui.html**

### 5. Chạy Frontend

Mở một terminal mới (giữ backend đang chạy):

```bash
cd src/frontend

# Cài đặt dependencies
npm install

# Chạy development server
npm start
```

Frontend sẽ chạy tại: **http://localhost:3000**

---

## Hướng Dẫn Sử Dụng Database

### Cấu Trúc Database

Database **MyUS** sử dụng schema `myus` để tổ chức tất cả các bảng. Dưới đây là danh sách đầy đủ các bảng và mô tả:

| Bảng | Mô Tả | Khóa Chính |
|------|-------|------------|
| `myus.Student` | Thông tin sinh viên, tài khoản đăng nhập | `studentId` |
| `myus.Administrator` | Tài khoản quản trị viên | `adminId` |
| `myus.Course` | Danh sách môn học | `courseId` |
| `myus.CourseOffering` | Học phần được mở trong từng học kỳ | `offeringId` |
| `myus.CourseRegistration` | Đăng ký học phần của sinh viên | `registrationId` |
| `myus.Grade` | Điểm số của sinh viên theo môn học | `gradeId` |
| `myus.AcademicRecord` | Hồ sơ học tập (GPA tích lũy, tín chỉ) | `recordId` |
| `myus.Appeal` | Đơn khiếu nại điểm | `appealId` |
| `myus.TuitionAccount` | Tài khoản học phí theo học kỳ | `accountId` |
| `myus.TuitionPayment` | Lịch sử thanh toán học phí | `paymentId` |
| `myus.Survey` | Khảo sát sinh viên | `surveyId` |
| `myus.SurveyResponse` | Phản hồi khảo sát của sinh viên | `responseId` |
| `myus.FAQArticle` | Bài viết FAQ | `faqId` |
| `myus.ClassTransferRequest` | Yêu cầu chuyển lớp học phần | `transferId` |
| `myus.ChatbotSession` | Phiên trò chuyện chatbot | `sessionId` |

### Sơ Đồ Quan Hệ (ERD)

```
┌─────────────────────┐     ┌──────────────────────┐
│    Administrator    │     │       Student        │
│  ├─ adminId (PK)    │     │  ├─ studentId (PK)   │
│  ├─ username        │     │  ├─ username         │
│  ├─ password        │     │  ├─ password         │
│  ├─ role            │     │  ├─ role             │
│  ├─ email           │     │  ├─ firstName        │
│  ├─ displayName     │     │  ├─ lastName         │
│  └─ department      │     │  ├─ email            │
└─────────┬───────────┘     │  ├─ major            │
          │                 │  └─ enrollmentStatus │
          │ reviews         └──────────┬───────────┘
          ▼                            │
┌─────────────────────┐                │
│       Appeal        │                │
│  ├─ appealId (PK)   │◄──────────────┤ submits
│  ├─ studentId (FK)  │                │
│  ├─ gradeId (FK)    │                │
│  ├─ status          │                │
│  └─ appealReason    │                │
└─────────────────────┘                │
                                       │
          ┌────────────────────────────┼────────────────────────────┐
          │                            │                            │
          ▼                            ▼                            ▼
┌──────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐
│ AcademicRecord   │    │ CourseRegistration   │    │   TuitionAccount     │
│ ├─ recordId (PK) │    │ ├─ registrationId(PK)│    │  ├─ accountId (PK)   │
│ ├─ studentId(FK) │    │ ├─ studentId (FK)    │    │  ├─ studentId (FK)   │
│ ├─ term          │    │ ├─ offeringId (FK)   │    │  ├─ term             │
│ ├─ cumulativeGPA │    │ └─ status            │    │  ├─ totalCharges     │
│ └─ earnedCredits │    └──────────┬───────────┘    │  ├─ balance         │
└──────────────────┘               │                │  └─ financialHold   │
                                   │                └──────────┬───────────┘
                                   ▼                           │
┌──────────────────┐    ┌──────────────────────┐               │
│     Grade        │    │   CourseOffering     │               ▼
│ ├─ gradeId (PK)  │    │  ├─ offeringId (PK)  │    ┌──────────────────────┐
│ ├─ registrationId│    │  ├─ courseId (FK)    │    │   TuitionPayment     │
│ ├─ studentId(FK) │    │  ├─ section          │    │  ├─ paymentId (PK)   │
│ ├─ courseId (FK) │    │  ├─ term             │    │  ├─ accountId (FK)   │
│ ├─ gradeValue    │    │  └─ instructor       │    │  ├─ amount           │
│ └─ gradePoint    │    └──────────┬───────────┘    │  └─ paymentMethod   │
└──────────────────┘               │                └──────────────────────┘
                                   ▼
                        ┌──────────────────────┐
                        │       Course         │
                        │  ├─ courseId (PK)    │
                        │  ├─ courseCode       │
                        │  ├─ courseName       │
                        │  ├─ credits          │
                        │  └─ department       │
                        └──────────────────────┘
```

### Kết Nối Database

#### Qua Ứng Dụng (Spring Boot)

Kết nối được cấu hình trong `application.properties`:

```properties
# SQL Server
spring.datasource.url=jdbc:sqlserver://<HOST>:<PORT>;databaseName=MyUS;encrypt=false;trustServerCertificate=true
spring.datasource.username=<USERNAME>
spring.datasource.password=<PASSWORD>
spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver

# JPA / Hibernate
spring.jpa.database-platform=org.hibernate.dialect.SQLServerDialect
spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=false
```

> **Hỗ trợ MySQL:** Nếu dùng MySQL, đổi driver và dialect:
> ```properties
> spring.datasource.url=jdbc:mysql://localhost:3306/MyUS?useSSL=false&allowPublicKeyRetrieval=true
> spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
> spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
> ```

#### Qua Công Cụ Quản Lý (SSMS / DBeaver)

| Tham Số | Giá Trị |
|---------|---------|
| Server Type | Database Engine (SQL Server) |
| Server Name | `localhost` (hoặc `127.0.0.1`) |
| Authentication | SQL Server Authentication |
| Login | `sa` (hoặc username của bạn) |
| Password | Mật khẩu đã thiết lập khi cài SQL Server |

### Các Thao Tác Database Thường Dùng

#### Xem danh sách sinh viên

```sql
SELECT studentId, username, firstName, lastName, email, major, enrollmentStatus
FROM myus.Student
ORDER BY lastName;
```

#### Xem đăng ký học phần của một sinh viên

```sql
SELECT
    cr.registrationId,
    cr.status,
    co.section,
    co.term,
    co.instructor,
    c.courseCode,
    c.courseName,
    c.credits
FROM myus.CourseRegistration cr
JOIN myus.CourseOffering co ON cr.offeringId = co.offeringId
JOIN myus.Course c ON co.courseId = c.courseId
WHERE cr.studentId = 1
ORDER BY co.term DESC;
```

#### Xem bảng điểm sinh viên

```sql
SELECT
    c.courseCode,
    c.courseName,
    g.gradeValue,
    g.gradePoint,
    g.term
FROM myus.Grade g
JOIN myus.Course c ON g.courseId = c.courseId
WHERE g.studentId = 1
ORDER BY g.term DESC;
```

#### Xem GPA tích lũy

```sql
SELECT
    ar.term,
    ar.cumulativeGPA,
    ar.earnedCredits
FROM myus.AcademicRecord ar
WHERE ar.studentId = 1
ORDER BY ar.term;
```

#### Xem đơn khiếu nại đang chờ xử lý

```sql
SELECT
    a.appealId,
    s.firstName,
    s.lastName,
    a.appealReason,
    a.status,
    a.submittedAt,
    a.deadline
FROM myus.Appeal a
JOIN myus.Student s ON a.studentId = s.studentId
WHERE a.status IN ('Submitted', 'Under Review')
ORDER BY a.submittedAt;
```

#### Xem học phí còn nợ

```sql
SELECT
    s.studentId,
    s.firstName,
    s.lastName,
    ta.term,
    ta.totalCharges,
    ta.payments,
    ta.scholarshipAmount,
    ta.balance,
    ta.financialHold
FROM myus.TuitionAccount ta
JOIN myus.Student s ON ta.studentId = s.studentId
WHERE ta.balance > 0
ORDER BY ta.term DESC;
```

#### Xem lịch sử thanh toán

```sql
SELECT
    tp.paymentId,
    s.firstName,
    s.lastName,
    tp.amount,
    tp.paymentDate,
    tp.paymentMethod,
    tp.status
FROM myus.TuitionPayment tp
JOIN myus.TuitionAccount ta ON tp.accountId = ta.accountId
JOIN myus.Student s ON ta.studentId = s.studentId
ORDER BY tp.paymentDate DESC;
```

#### Thống kê số lượng đăng ký theo môn học

```sql
SELECT
    c.courseCode,
    c.courseName,
    COUNT(cr.registrationId) AS totalRegistrations,
    SUM(CASE WHEN cr.status = 'Enrolled' THEN 1 ELSE 0 END) AS enrolled
FROM myus.Course c
JOIN myus.CourseOffering co ON c.courseId = co.courseId
JOIN myus.CourseRegistration cr ON co.offeringId = cr.offeringId
GROUP BY c.courseCode, c.courseName
ORDER BY totalRegistrations DESC;
```

#### Xem các khảo sát đang mở

```sql
SELECT
    surveyId,
    title,
    description,
    openDate,
    closeDate,
    status,
    targetAudience
FROM myus.Survey
WHERE status = 'Open'
ORDER BY closeDate;
```

#### Xem FAQ phổ biến

```sql
SELECT
    faqId,
    question,
    category,
    helpfulCount,
    notHelpfulCount
FROM myus.FAQArticle
WHERE published = 1
ORDER BY helpfulCount DESC;
```

#### Reset dữ liệu database

```sql
-- Xóa tất cả dữ liệu (giữ cấu trúc bảng)
DELETE FROM myus.ChatbotSession;
DELETE FROM myus.SurveyResponse;
DELETE FROM myus.TuitionPayment;
DELETE FROM myus.TuitionAccount;
DELETE FROM myus.ClassTransferRequest;
DELETE FROM myus.Appeal;
DELETE FROM myus.Grade;
DELETE FROM myus.AcademicRecord;
DELETE FROM myus.CourseRegistration;
DELETE FROM myus.CourseOffering;
DELETE FROM myus.FAQArticle;
DELETE FROM myus.Survey;
DELETE FROM myus.Course;
DELETE FROM myus.Administrator;
DELETE FROM myus.Student;
```

> **Sau khi reset**, chạy lại file `mock_data_myus.sql` để có dữ liệu mẫu.

---

## Tài Khoản Mẫu

Tài khoản được tạo tự động khi chạy `mock_data_myus.sql`:

| Vai Trò | Username | Mật Khẩu | Mô Tả |
|---------|----------|----------|-------|
| Sinh viên | `24127002` | `24127002123` | Đăng ký học phần, xem điểm, xem TKB |

> **Quan trọng:** Mật khẩu trong database được mã hóa bằng **BCrypt**. Không tự ý INSERT mật khẩu plain text — Spring Security sẽ từ chối xác thực.

---

## API Documentation

API documentation (Swagger UI) có sẵn khi backend đang chạy:

```
http://localhost:8080/swagger-ui.html
```

OpenAPI spec (JSON):

```
http://localhost:8080/api-docs
```

---

## Xử Lý Sự Cố

### Port 8080 đã được sử dụng

Đổi port backend trong `application.properties`:

```properties
server.port=8081
```

Sau đó cập nhật proxy trong `src/frontend/package.json`:

```json
"proxy": "http://localhost:8081"
```

### Trang đăng nhập bị bỏ qua (vào thẳng Dashboard)

Nguyên nhân: JWT token cũ trong Local Storage.

**Cách khắc phục:** F12 → Application → Local Storage → `http://localhost:3000` → Clear All → Refresh.

### Lỗi DataSource khi khởi động backend

Kiểm tra:
- SQL Server service đang chạy
- Tên database trong connection string đúng
- Username và password đúng
- Port SQL Server đúng (mặc định: 1433)

### `mvn` command not found

Sử dụng Maven Wrapper đi kèm:
- **macOS/Linux:** `./mvnw`
- **Windows:** `mvnw.cmd`

### `node_modules` bị thiếu hoặc lỗi

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Thứ Tự Chạy Hệ Thống

1. ⚙️ Khởi động SQL Server service
2. 🗄️ Chạy script `schema.sql` để tạo bảng
3. 📥 Chạy script `mock_data_myus.sql` để import dữ liệu mẫu
4. 🔧 Cấu hình `application.properties` với thông tin database
5. 🚀 Chạy backend (`./mvnw spring-boot:run`)
6. 🎨 Chạy frontend (`npm start`)
7. 🌐 Truy cập `http://localhost:3000` và đăng nhập

---

## Nhóm Phát Triển

**MyUS Portal Development Team**

Khoa Công Nghệ Thông Tin — Trường Đại học Khoa học Tự nhiên, ĐHQG-HCM

---

*Dự án được phát triển trong khuôn khổ môn học **Software Engineering**.*
