import React, { useEffect, useMemo, useState } from 'react';

interface GradeRecord {
  gradeId: number;
  term: string;
  gradeValue: string;
  gradePoint: number;
  midtermScore: number;
  finalScore: number;
  overallScore: number;
  course: {
    courseId: number;
    courseCode: string;
    courseName: string;
    credits: number;
  };
}

const GradesPage: React.FC = () => {
  const [grades, setGrades] = useState<GradeRecord[]>([]);
  const [selectedTerm, setSelectedTerm] = useState('2024-2025-HK2');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockGrades: GradeRecord[] = [
      {
        gradeId: 1,
        term: '2024-2025-HK2',
        gradeValue: 'A',
        gradePoint: 4.0,
        midtermScore: 8.5,
        finalScore: 8.5,
        overallScore: 8.5,
        course: {
          courseId: 101,
          courseCode: 'CSC10009',
          courseName: 'Computer Systems',
          credits: 4,
        },
      },
      {
        gradeId: 2,
        term: '2024-2025-HK2',
        gradeValue: 'A',
        gradePoint: 4.0,
        midtermScore: 9.0,
        finalScore: 8.5,
        overallScore: 8.7,
        course: {
          courseId: 102,
          courseCode: 'CSC10004',
          courseName: 'Data Structures',
          credits: 4,
        },
      },
      {
        gradeId: 3,
        term: '2024-2025-HK2',
        gradeValue: 'B+',
        gradePoint: 3.5,
        midtermScore: 8.0,
        finalScore: 8.5,
        overallScore: 8.3,
        course: {
          courseId: 103,
          courseCode: 'CSC10006',
          courseName: 'Database Systems',
          credits: 4,
        },
      },
      {
        gradeId: 4,
        term: '2024-2025-HK1',
        gradeValue: 'A',
        gradePoint: 4.0,
        midtermScore: 8.5,
        finalScore: 9.0,
        overallScore: 8.8,
        course: {
          courseId: 104,
          courseCode: 'CSC10001',
          courseName: 'Introduction to Programming',
          credits: 4,
        },
      },
    ];

    window.setTimeout(() => {
      setGrades(mockGrades);
      setLoading(false);
    }, 120);
  }, []);

  const filteredGrades = useMemo(
    () => grades.filter((item) => item.term === selectedTerm),
    [grades, selectedTerm]
  );
  const totalCredits = filteredGrades.reduce((sum, item) => sum + item.course.credits, 0);
  const gpa =
    filteredGrades.reduce((sum, item) => sum + item.gradePoint, 0) /
    Math.max(filteredGrades.length, 1);

  if (loading) {
    return <div style={{ padding: 40, color: '#64748b' }}>Loading grade data…</div>;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        padding: '32px 24px',
      }}
    >
      <div style={{ maxWidth: 1152, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 28,
              fontWeight: 700,
              color: '#0f172a',
            }}
          >
            Academic Results
          </h1>
          <p style={{ marginTop: 8, color: '#64748b' }}>
            Review your grades and track your cumulative performance.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              flex: '1 1 240px',
              backgroundColor: '#fff',
              borderRadius: 12,
              padding: 20,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
          >
            <div
              style={{
                color: '#64748b',
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              Cumulative GPA
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: 28,
                fontWeight: 700,
                color: '#0f172a',
              }}
            >
              {gpa.toFixed(2)}
            </div>
          </div>
          <div
            style={{
              flex: '1 1 240px',
              backgroundColor: '#fff',
              borderRadius: 12,
              padding: 20,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
          >
            <div
              style={{
                color: '#64748b',
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              Credits
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: 28,
                fontWeight: 700,
                color: '#0f172a',
              }}
            >
              {totalCredits}
            </div>
          </div>
          <div
            style={{
              flex: '1 1 240px',
              backgroundColor: '#fff',
              borderRadius: 12,
              padding: 20,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
          >
            <div
              style={{
                color: '#64748b',
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              Selected term
            </div>
            <div style={{ marginTop: 8 }}>
              <select
                value={selectedTerm}
                onChange={(event) => setSelectedTerm(event.target.value)}
                style={{
                  border: '1px solid #cbd5e1',
                  borderRadius: 8,
                  padding: '8px 10px',
                }}
              >
                <option value="2024-2025-HK2">2024-2025 HK2</option>
                <option value="2024-2025-HK1">2024-2025 HK1</option>
              </select>
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '16px 24px',
              borderBottom: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 700,
                color: '#334155',
              }}
            >
              Grade details
            </h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr
                  style={{
                    backgroundColor: '#fff',
                    color: '#64748b',
                    textTransform: 'uppercase',
                    fontSize: 12,
                  }}
                >
                  <th style={{ padding: '14px 24px', textAlign: 'left' }}>Course</th>
                  <th style={{ padding: '14px 24px', textAlign: 'center' }}>Credits</th>
                  <th style={{ padding: '14px 24px', textAlign: 'right' }}>Midterm</th>
                  <th style={{ padding: '14px 24px', textAlign: 'right' }}>Final</th>
                  <th style={{ padding: '14px 24px', textAlign: 'right' }}>Overall</th>
                  <th style={{ padding: '14px 24px', textAlign: 'center' }}>Letter</th>
                </tr>
              </thead>
              <tbody>
                {filteredGrades.map((item, index) => (
                  <tr
                    key={item.gradeId}
                    style={{
                      borderTop: index === 0 ? '1px solid #e2e8f0' : 'none',
                      backgroundColor: index % 2 === 0 ? '#fff' : '#f8fafc',
                    }}
                  >
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>
                        {item.course.courseName}
                      </div>
                      <div style={{ marginTop: 4, color: '#64748b', fontSize: 13 }}>
                        {item.course.courseCode}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: '16px 24px',
                        textAlign: 'center',
                        color: '#334155',
                      }}
                    >
                      {item.course.credits}
                    </td>
                    <td
                      style={{
                        padding: '16px 24px',
                        textAlign: 'right',
                        color: '#334155',
                      }}
                    >
                      {item.midtermScore.toFixed(1)}
                    </td>
                    <td
                      style={{
                        padding: '16px 24px',
                        textAlign: 'right',
                        color: '#334155',
                      }}
                    >
                      {item.finalScore.toFixed(1)}
                    </td>
                    <td
                      style={{
                        padding: '16px 24px',
                        textAlign: 'right',
                        color: '#334155',
                        fontWeight: 700,
                      }}
                    >
                      {item.overallScore.toFixed(1)}
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: 999,
                          backgroundColor: '#eef2ff',
                          color: '#4338ca',
                          fontWeight: 700,
                        }}
                      >
                        {item.gradeValue}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradesPage;
