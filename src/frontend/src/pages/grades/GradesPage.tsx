import React, { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';

interface GradeRecord {
  gradeId: number | string;
  term: string;
  gradeValue: string;
  gradePoint: number;
  midtermGrade: number;
  finalGrade: number;
  overallScore: number;
  course: {
    courseId: number | string;
    courseCode: string;
    courseName: string;
    credits: number;
  };
}

const DEFAULT_GRADES: GradeRecord[] = [
  // HKI 2025-2026
  {
    gradeId: 1,
    term: 'HKI 2025-2026',
    gradeValue: '8.70',
    gradePoint: 4.0,
    midtermGrade: 8.5,
    finalGrade: 8.8,
    overallScore: 8.7,
    course: {
      courseId: 1,
      courseCode: 'BAA00005',
      courseName: 'General Economics',
      credits: 2,
    },
  },
  {
    gradeId: 2,
    term: 'HKI 2025-2026',
    gradeValue: '9.10',
    gradePoint: 4.0,
    midtermGrade: 9.0,
    finalGrade: 9.2,
    overallScore: 9.1,
    course: {
      courseId: 2,
      courseCode: 'BAA00030',
      courseName: 'National Defense Education',
      credits: 4,
    },
  },
  {
    gradeId: 3,
    term: 'HKI 2025-2026',
    gradeValue: '8.40',
    gradePoint: 3.5,
    midtermGrade: 8.0,
    finalGrade: 8.7,
    overallScore: 8.4,
    course: {
      courseId: 3,
      courseCode: 'CSC10009',
      courseName: 'Computer Systems',
      credits: 2,
    },
  },
  {
    gradeId: 4,
    term: 'HKI 2025-2026',
    gradeValue: '9.30',
    gradePoint: 4.0,
    midtermGrade: 9.5,
    finalGrade: 9.2,
    overallScore: 9.3,
    course: {
      courseId: 4,
      courseCode: 'CSC10014',
      courseName: 'Computational Thinking',
      credits: 4,
    },
  },
  {
    gradeId: 5,
    term: 'HKI 2025-2026',
    gradeValue: '8.50',
    gradePoint: 4.0,
    midtermGrade: 8.5,
    finalGrade: 8.5,
    overallScore: 8.5,
    course: {
      courseId: 5,
      courseCode: 'MTH00006',
      courseName: 'Calculus 2',
      credits: 4,
    },
  },

  // HKII 2025-2026
  {
    gradeId: 6,
    term: 'HKII 2025-2026',
    gradeValue: '9.00',
    gradePoint: 4.0,
    midtermGrade: 9.0,
    finalGrade: 9.0,
    overallScore: 9.0,
    course: {
      courseId: 6,
      courseCode: 'BAA00021',
      courseName: 'Physical Education 1',
      credits: 2,
    },
  },
  {
    gradeId: 7,
    term: 'HKII 2025-2026',
    gradeValue: '8.30',
    gradePoint: 3.5,
    midtermGrade: 8.0,
    finalGrade: 8.5,
    overallScore: 8.3,
    course: {
      courseId: 7,
      courseCode: 'BAA00101',
      courseName: 'Marxist-Leninist Philosophy',
      credits: 3,
    },
  },
  {
    gradeId: 8,
    term: 'HKII 2025-2026',
    gradeValue: '8.80',
    gradePoint: 4.0,
    midtermGrade: 8.5,
    finalGrade: 9.0,
    overallScore: 8.8,
    course: {
      courseId: 8,
      courseCode: 'CSC10007',
      courseName: 'Operating Systems',
      credits: 4,
    },
  },
  {
    gradeId: 9,
    term: 'HKII 2025-2026',
    gradeValue: '9.20',
    gradePoint: 4.0,
    midtermGrade: 9.0,
    finalGrade: 9.3,
    overallScore: 9.2,
    course: {
      courseId: 9,
      courseCode: 'CSC14003',
      courseName: 'Introduction to Artificial Intelligence',
      credits: 4,
    },
  },
  {
    gradeId: 10,
    term: 'HKII 2025-2026',
    gradeValue: '8.60',
    gradePoint: 4.0,
    midtermGrade: 8.5,
    finalGrade: 8.7,
    overallScore: 8.6,
    course: {
      courseId: 10,
      courseCode: 'MTH00007',
      courseName: 'Probability and Statistics',
      credits: 4,
    },
  },
];

const GradesPage: React.FC = () => {
  const [grades, setGrades] = useState<GradeRecord[]>([]);
  const [selectedTerm, setSelectedTerm] = useState('HKI 2025-2026');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt to fetch from Backend API, fallback to DEFAULT_GRADES
    api
      .get('/grades/me')
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          const mapped: GradeRecord[] = res.data.map((item: any) => ({
            gradeId: item.gradeId,
            term: item.term || 'HKI 2025-2026',
            gradeValue: item.currentGrade || 'N/A',
            gradePoint: item.gradePoint || 4.0,
            midtermGrade: item.midtermGrade ?? 8.5,
            finalGrade: item.finalGrade ?? 8.5,
            overallScore: item.gradePoint ?? 8.5,
            course: {
              courseId: item.gradeId,
              courseCode: item.courseCode || 'N/A',
              courseName: item.courseName || 'Course',
              credits: 4,
            },
          }));
          setGrades(mapped);
        } else {
          setGrades(DEFAULT_GRADES);
        }
      })
      .catch(() => {
        setGrades(DEFAULT_GRADES);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredGrades = useMemo(
    () => grades.filter((item) => item.term === selectedTerm),
    [grades, selectedTerm]
  );
  const totalCredits = filteredGrades.reduce((sum, item) => sum + item.course.credits, 0);
  const gpa =
    filteredGrades.length > 0
      ? filteredGrades.reduce((sum, item) => sum + item.gradePoint, 0) / filteredGrades.length
      : 0;

  if (loading) {
    return <div style={{ padding: 40, color: '#64748b' }}>Loading academic results…</div>;
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
            Review your grades and track your cumulative performance for the 2025-2026 academic
            year.
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
              Term GPA
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: 28,
                fontWeight: 700,
                color: '#0f172a',
              }}
            >
              {gpa > 0 ? gpa.toFixed(2) : 'N/A'}
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
              Earned Credits
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
              Selected Semester
            </div>
            <div style={{ marginTop: 8 }}>
              <select
                value={selectedTerm}
                onChange={(event) => setSelectedTerm(event.target.value)}
                style={{
                  border: '1px solid #cbd5e1',
                  borderRadius: 8,
                  padding: '8px 12px',
                  fontWeight: 600,
                  color: '#0f172a',
                  width: '100%',
                }}
              >
                <option value="HKI 2025-2026">HKI 2025-2026</option>
                <option value="HKII 2025-2026">HKII 2025-2026</option>
                <option value="HKIII 2025-2026">HKIII 2025-2026</option>
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
              Grade details ({selectedTerm})
            </h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            {filteredGrades.length === 0 ? (
              <div style={{ padding: '32px 24px', textAlign: 'center', color: '#64748b' }}>
                No grade records found for <strong>{selectedTerm}</strong>. (New Semester Course
                Registration in progress).
              </div>
            ) : (
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
                    <th style={{ padding: '14px 24px', textAlign: 'right' }}>Midterm Grade</th>
                    <th style={{ padding: '14px 24px', textAlign: 'right' }}>Final Grade</th>
                    <th style={{ padding: '14px 24px', textAlign: 'right' }}>Overall Grade</th>
                    <th style={{ padding: '14px 24px', textAlign: 'center' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGrades.map((item, index) => (
                    <tr
                      key={item.gradeId}
                      style={{
                        borderTop: index === 0 ? '1px solid #e2e8f0' : '1px solid #f1f5f9',
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
                          fontWeight: 600,
                        }}
                      >
                        {item.midtermGrade !== undefined
                          ? Number(item.midtermGrade).toFixed(1)
                          : 'N/A'}
                      </td>
                      <td
                        style={{
                          padding: '16px 24px',
                          textAlign: 'right',
                          color: '#334155',
                          fontWeight: 600,
                        }}
                      >
                        {item.finalGrade !== undefined ? Number(item.finalGrade).toFixed(1) : 'N/A'}
                      </td>
                      <td
                        style={{
                          padding: '16px 24px',
                          textAlign: 'right',
                          color: '#0f172a',
                          fontWeight: 700,
                        }}
                      >
                        {item.gradeValue}
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
                            fontSize: 12,
                          }}
                        >
                          Finalized
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradesPage;
