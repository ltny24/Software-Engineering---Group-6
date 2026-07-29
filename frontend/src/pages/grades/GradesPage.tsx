import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';

interface GradeDTO {
  gradeId: number;
  term: string;
  courseCode: string;
  courseName: string;
  credits: number;
  gradeValue: string;
  gradePoint: number;
  overallScore: number;
}

function GradesPage() {
  const [grades, setGrades] = useState<GradeDTO[]>([]);
  const [gpa, setGpa] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTerm, setSelectedTerm] = useState<string>('2024-2025-HK2');

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setLoading(true);
        const data = await api.get<GradeDTO[]>('/api/v1/grades/me');
        const normalized = (data || []).map((item) => ({
          ...item,
          gradePoint: Number(item.gradePoint || 0),
          overallScore: Number(item.overallScore || 0),
          credits: Number(item.credits || 0),
        }));

        setGrades(normalized);
        const terms = normalized.map((item) => item.term).filter(Boolean) as string[];
        if (terms.length > 0) {
          setSelectedTerm(terms[0]);
        }

        const validGrades = normalized.filter((item) => Number(item.gradePoint) > 0);
        const totalCredits = validGrades.reduce((sum, item) => sum + (item.credits || 0), 0);
        const weighted = validGrades.reduce(
          (sum, item) => sum + (item.gradePoint || 0) * (item.credits || 0),
          0
        );
        setGpa(totalCredits > 0 ? weighted / totalCredits : 0);
      } catch (error) {
        toast.error('Unable to load grade data from the server.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);

  if (loading) {
    return (
      <div
        style={{ padding: '40px', textAlign: 'center', color: '#64748b', fontFamily: 'sans-serif' }}
      >
        Loading grade data...
      </div>
    );
  }

  const filteredGrades = grades.filter((g) => g.term === selectedTerm);
  const totalCredits = filteredGrades.reduce((sum, g) => sum + (g.credits || 0), 0);

  return (
    <div
      style={{
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        padding: '32px 24px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        width: '100%',
      }}
    >
      <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: '20px',
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <h1
              style={{ fontSize: '24px', fontWeight: '600', color: '#1e293b', margin: '0 0 4px 0' }}
            >
              Academic Results & GPA
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
              Monitor your grades and credit progress
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              padding: '6px 12px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            }}
          >
            <label
              htmlFor="term-select"
              style={{ fontSize: '14px', fontWeight: '500', color: '#475569', marginRight: '8px' }}
            >
              Term:
            </label>
            <select
              id="term-select"
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: '14px',
                fontWeight: '500',
                color: '#1e293b',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {Array.from(new Set(grades.map((item) => item.term).filter(Boolean))).map((term) => (
                <option key={term} value={term}>
                  {term}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <div
            style={{
              flex: '1',
              minWidth: '250px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              borderTop: '4px solid #6366f1',
              border: '1px solid #e2e8f0',
            }}
          >
            <div
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px',
              }}
            >
              Cumulative GPA (10-point scale)
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
              <span style={{ fontSize: '30px', fontWeight: '700', color: '#1e293b' }}>
                {gpa.toFixed(2)}
              </span>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#4f46e5',
                  backgroundColor: '#eef2ff',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}
              >
                {gpa >= 8.5 ? 'Excellent' : gpa >= 7 ? 'Good' : 'Average'}
              </span>
            </div>
          </div>

          <div
            style={{
              flex: '1',
              minWidth: '250px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              border: '1px solid #e2e8f0',
              borderTop: '4px solid #0ea5e9',
            }}
          >
            <div
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px',
              }}
            >
              GPA (4.0 scale)
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '30px', fontWeight: '700', color: '#1e293b' }}>
                {(gpa * 0.4).toFixed(2)}
              </span>
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#94a3b8' }}>/ 4.0</span>
            </div>
          </div>

          <div
            style={{
              flex: '1',
              minWidth: '250px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              border: '1px solid #e2e8f0',
              borderTop: '4px solid #10b981',
            }}
          >
            <div
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px',
              }}
            >
              Credits This Term
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '30px', fontWeight: '700', color: '#1e293b' }}>
                {totalCredits}
              </span>
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#64748b' }}>credits</span>
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            border: '1px solid #e2e8f0',
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
            <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#334155', margin: 0 }}>
              Course Grade Details
            </h2>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '14px',
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: '#ffffff',
                    borderBottom: '2px solid #e2e8f0',
                    color: '#64748b',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                  }}
                >
                  <th style={{ padding: '14px 24px', fontWeight: '600' }}>Course Code</th>
                  <th style={{ padding: '14px 24px', fontWeight: '600' }}>Course Name</th>
                  <th style={{ padding: '14px 24px', fontWeight: '600', textAlign: 'center' }}>
                    Credits
                  </th>
                  <th style={{ padding: '14px 24px', fontWeight: '600', textAlign: 'right' }}>
                    Score
                  </th>
                  <th style={{ padding: '14px 24px', fontWeight: '600', textAlign: 'right' }}>
                    Grade Point
                  </th>
                  <th style={{ padding: '14px 24px', fontWeight: '600', textAlign: 'center' }}>
                    Letter Grade
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredGrades.length > 0 ? (
                  filteredGrades.map((item, index) => (
                    <tr
                      key={item.gradeId}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#fcfcfd',
                      }}
                    >
                      <td
                        style={{
                          padding: '16px 24px',
                          fontFamily: 'monospace',
                          color: '#475569',
                          fontWeight: '500',
                        }}
                      >
                        {item.courseCode}
                      </td>
                      <td style={{ padding: '16px 24px', fontWeight: '600', color: '#1e293b' }}>
                        {item.courseName}
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'center', color: '#475569' }}>
                        {item.credits}
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right', color: '#475569' }}>
                        {item.overallScore.toFixed(1)}
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right', color: '#475569' }}>
                        {item.gradePoint.toFixed(2)}
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontWeight: '600',
                            fontSize: '13px',
                            backgroundColor: '#f1f5f9',
                            color: '#334155',
                            border: '1px solid #e2e8f0',
                          }}
                        >
                          {item.gradeValue}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}
                    >
                      No course grade data is available for this term.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GradesPage;
