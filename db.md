# MyUS Database Connection Guide

## Public Database Access (bore TCP Tunnel)

### Connection Details

| Parameter | Value |
|-----------|-------|
| **Host** | `bore.pub` |
| **Port** | `31438` |
| **Database** | `MyUS` |
| **Schema** | `myus` |
| **Username** | `sa` |
| **Password** | `Khoidmh1106` |

### JDBC Connection String

```
jdbc:sqlserver://bore.pub:31438;databaseName=MyUS;encrypt=false;trustServerCertificate=true
```

### Spring Boot `application.properties`

```properties
spring.datasource.url=jdbc:sqlserver://bore.pub:31438;databaseName=MyUS;encrypt=false;trustServerCertificate=true
spring.datasource.username=sa
spring.datasource.password=Khoidmh1106
spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver
spring.jpa.database-platform=org.hibernate.dialect.SQLServerDialect
```

### GUI Tools

| Tool | Host | Port | Auth |
|------|------|------|------|
| Azure Data Studio | `bore.pub` | `31438` | SQL Login |
| DBeaver | `bore.pub` | `31438` | SQL Server (jTDS) |
| SQL Server Management Studio | `bore.pub,31438` | — | SQL Server Authentication |
| DataGrip | `bore.pub` | `31438` | SQL Server (Microsoft) |
| TablePlus | `bore.pub` | `31438` | SQL Server |

### Command Line

```bash
# Test connection
sqlcmd -S bore.pub,31438 -U sa -P "Khoidmh1106" -Q "SELECT DB_NAME()"

# List all tables
sqlcmd -S bore.pub,31438 -U sa -P "Khoidmh1106" -d MyUS -Q "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='myus'"

# Check Student table
sqlcmd -S bore.pub,31438 -U sa -P "Khoidmh1106" -d MyUS -Q "SELECT studentId, username, firstName, lastName, major FROM myus.Student"
```

### Python

```python
import pyodbc

conn = pyodbc.connect(
    "DRIVER={ODBC Driver 18 for SQL Server};"
    "SERVER=bore.pub,31438;"
    "DATABASE=MyUS;"
    "UID=sa;"
    "PWD=Khoidmh1106;"
    "Encrypt=no;"
    "TrustServerCertificate=yes"
)
cursor = conn.cursor()
cursor.execute("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='myus'")
for row in cursor:
    print(row[0])
```

### Node.js

```javascript
const sql = require('mssql');

const config = {
  server: 'bore.pub',
  port: 31438,
  database: 'MyUS',
  user: 'sa',
  password: 'Khoidmh1106',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

sql.connect(config).then(pool => {
  return pool.request().query("SELECT * FROM myus.FAQArticle");
}).then(result => {
  console.log(result.recordset);
});
```

### Database Schema Overview

```
myus schema - 14 tables:

├── Student              (studentId, username, firstName, lastName, email, major, ...)
├── Administrator        (adminId, username, email, department, ...)
├── Course               (courseId, courseCode, courseName, credits, prerequisites, ...)
├── CourseOffering       (offeringId, section, term, schedule, instructor, ...)
├── CourseRegistration   (registrationId, status, registeredAt, ...)
├── Grade                (gradeId, gradeValue, gradePoint, term, ...)
├── AcademicRecord       (recordId, cumulativeGPA, earnedCredits, term)
├── Appeal               (appealId, status, appealReason, supportingDocumentUrl, ...)
├── TuitionAccount       (accountId, totalCharges, payments, balance, ...)
├── TuitionPayment       (paymentId, amount, paymentDate, paymentMethod, ...)
├── FAQArticle           (faqId, question, answer, category, tags, ...)
├── ChatbotSession       (sessionId, context, recommendations, ...)
├── ClassTransferRequest (transferId, status, ...)
├── Survey               (surveyId, title, description, status, ...)
└── SurveyResponse       (responseId, answers, ...)
```

---

## Starting the Tunnel

The database is hosted in a Docker container locally and exposed via `bore`:

```bash
# Ensure Docker SQL Server is running
docker start myus-sqlserver

# Start bore tunnel (run in background)
bore local 1433 --to bore.pub --port 0 &

# Note: Port number changes each restart unless fixed with --port <number>
```

To use a **fixed port**, replace `--port 0` with your desired port number (e.g., `--port 31438`), then update this document accordingly.

---

## Security Note

⚠️ This configuration exposes the database publicly. For production use:
- Use strong, unique passwords
- Enable encryption (`encrypt=true`)
- Restrict access with firewall rules
- Consider using a VPN instead of a public tunnel
