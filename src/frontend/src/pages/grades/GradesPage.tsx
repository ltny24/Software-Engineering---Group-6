import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import './GradesPage.css';

interface GradeDTO {
  gradeId: number;
  term: string;
  courseCode: string;
  courseName: string;
  credits: number;
  gradeValue: string;
  gradePoint: number;
  overallScore: number;
  midtermGrade?: number;
  finalGrade?: number;
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
      <div className="grades-loading">
        <span className="spinner" /> Loading grade data...
      </div>
    );
  }

  const filteredGrades = grades.filter((g) => g.term === selectedTerm);
  const totalCredits = filteredGrades.reduce((sum, g) => sum + (g.credits || 0), 0);

  const gpaLabel = gpa >= 8.5 ? 'Excellent' : gpa >= 7 ? 'Good' : 'Average';

  return (
    <div className="grades-page">
      {/* Header */}
      <div className="grades-page__header">
        <div>
          <h1 className="grades-page__title">Academic Results &amp; GPA</h1>
          <p className="grades-page__subtitle">Monitor your grades and credit progress</p>
        </div>

        <div className="grades-page__term-select">
          <label htmlFor="term-select">Term:</label>
          <select
            id="term-select"
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
          >
            {Array.from(new Set(grades.map((item) => item.term).filter(Boolean))).map((term) => (
              <option key={term} value={term}>
                {term}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grades-stats">
        <div className="grades-stat-card">
          <div className="grades-stat-label">Cumulative GPA (10-point scale)</div>
          <div className="grades-stat-value">
            <span className="grades-stat-number">{gpa.toFixed(2)}</span>
            <span className="grades-stat-badge">{gpaLabel}</span>
          </div>
        </div>

        <div className="grades-stat-card grades-stat-card--blue">
          <div className="grades-stat-label">GPA (4.0 scale)</div>
          <div className="grades-stat-value">
            <span className="grades-stat-number">{(gpa * 0.4).toFixed(2)}</span>
            <span className="grades-stat-unit">/ 4.0</span>
          </div>
        </div>

        <div className="grades-stat-card grades-stat-card--green">
          <div className="grades-stat-label">Credits This Term</div>
          <div className="grades-stat-value">
            <span className="grades-stat-number">{totalCredits}</span>
            <span className="grades-stat-unit">credits</span>
          </div>
        </div>
      </div>

      {/* Grade table */}
      <div className="grades-table-section">
        <div className="grades-table-header">
          <h2>Course Grade Details</h2>
        </div>

        <div className="grades-table-wrapper">
          <table className="grades-table">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Name</th>
                <th className="cell-center">Credits</th>
                <th className="cell-right">Mid-term Grade</th>
                <th className="cell-right">Final Grade</th>
                <th className="cell-right">Score</th>
                <th className="cell-right">Grade Point</th>
              </tr>
            </thead>
            <tbody>
              {filteredGrades.length > 0 ? (
                filteredGrades.map((item, index) => (
                  <tr key={item.gradeId}>
                    <td className="cell-code">{item.courseCode}</td>
                    <td className="cell-name">{item.courseName}</td>
                    <td className="cell-text cell-center">{item.credits}</td>
                    <td className="cell-text cell-right">
                      {item.midtermGrade != null ? item.midtermGrade.toFixed(1) : '—'}
                    </td>
                    <td className="cell-text cell-right">
                      {item.finalGrade != null ? item.finalGrade.toFixed(1) : '—'}
                    </td>
                    <td className="cell-text cell-right">{item.overallScore.toFixed(1)}</td>
                    <td className="cell-text cell-right">{item.gradePoint.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="grades-empty">
                    No course grade data is available for this term.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default GradesPage;
