import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  getMyAppeals,
  getAppealById,
  submitAppeal,
  withdrawAppeal,
} from '../../services/appealService';
import type { AppealResponse } from '../../services/appealService';
import api from '../../services/api';
import './AppealsPage.css';

// ============================================================
// Local types
// ============================================================

interface GradeOption {
  gradeId: number;
  courseCode: string;
  courseName: string;
  gradeValue: string;
  term: string;
}

// ============================================================
// Helpers
// ============================================================

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

function getStatusBadgeClass(status: string): string {
  const s = status.toLowerCase();
  if (s === 'submitted') return 'badge badge--submitted';
  if (s === 'under review') return 'badge badge--under-review';
  if (s === 'approved') return 'badge badge--approved';
  if (s === 'denied') return 'badge badge--denied';
  if (s === 'withdrawn') return 'badge badge--withdrawn';
  return 'badge badge--neutral';
}

function getStatusLabel(status: string): string {
  const s = status.toLowerCase();
  if (s === 'submitted') return 'Submitted';
  if (s === 'under review') return 'Under Review';
  if (s === 'approved') return 'Approved';
  if (s === 'denied') return 'Denied';
  if (s === 'withdrawn') return 'Withdrawn';
  return status;
}

// ============================================================
// Component
// ============================================================

export default function AppealsPage() {
  // ── Data ──────────────────────────────────────────────
  const [appeals, setAppeals] = useState<AppealResponse[]>([]);
  const [grades, setGrades] = useState<GradeOption[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Form state ────────────────────────────────────────
  const [selectedGradeId, setSelectedGradeId] = useState('');
  const [appealReason, setAppealReason] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // ── Modal state ───────────────────────────────────────
  const [modalAppeal, setModalAppeal] = useState<AppealResponse | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  // ── Fetch data on mount ───────────────────────────────
  const fetchAppeals = useCallback(async () => {
    try {
      const data = await getMyAppeals();
      setAppeals(data);
    } catch (error) {
      toast.error('Unable to load appeals. Please try again.');
      console.error(error);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Fetch grades for the dropdown
        const gradesData = await api.get<GradeOption[]>('/api/v1/grades/me');
        const unique = (gradesData || []).filter(
          (g, i, arr) => arr.findIndex((x) => x.gradeId === g.gradeId) === i
        );
        setGrades(unique);
        // Fetch appeals
        await fetchAppeals();
      } catch (error) {
        toast.error('Unable to load data from the server.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [fetchAppeals]);

  // ── Form validation ───────────────────────────────────
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!selectedGradeId) {
      errors.gradeId = 'Please select a grade to appeal.';
    }
    if (!appealReason || appealReason.trim().length < 10) {
      errors.appealReason = 'Reason must be at least 10 characters.';
    }
    if (appealReason.length > 2000) {
      errors.appealReason = 'Reason must not exceed 2000 characters.';
    }
    if (documentUrl && documentUrl.length > 2048) {
      errors.documentUrl = 'URL must not exceed 2048 characters.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ── Submit handler ────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await submitAppeal({
        gradeId: Number(selectedGradeId),
        appealReason: appealReason.trim(),
        supportingDocumentUrl: documentUrl.trim() || undefined,
      });
      toast.success('Appeal submitted successfully!');
      // Reset form
      setSelectedGradeId('');
      setAppealReason('');
      setDocumentUrl('');
      setFormErrors({});
      // Refresh list
      await fetchAppeals();
    } catch (error: unknown) {
      const err = error as {
        response?: {
          data?: { message?: string; errors?: Array<{ field: string; message: string }> };
        };
      };
      const backendMsg = err?.response?.data?.message;
      const fieldErrors = err?.response?.data?.errors;
      if (fieldErrors && Array.isArray(fieldErrors)) {
        const mapped: Record<string, string> = {};
        fieldErrors.forEach((fe) => {
          mapped[fe.field] = fe.message;
        });
        setFormErrors(mapped);
      }
      toast.error(backendMsg || 'Failed to submit appeal. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── View detail ───────────────────────────────────────
  const handleView = async (appealId: number) => {
    setModalOpen(true);
    setModalLoading(true);
    try {
      const detail = await getAppealById(appealId);
      setModalAppeal(detail);
    } catch (error) {
      toast.error('Unable to load appeal detail.');
      console.error(error);
      setModalOpen(false);
    } finally {
      setModalLoading(false);
    }
  };

  // ── Withdraw ──────────────────────────────────────────
  const handleWithdraw = async (appealId: number, fromModal: boolean) => {
    if (
      !window.confirm(
        'Are you sure you want to withdraw this appeal? This action cannot be undone.'
      )
    ) {
      return;
    }
    setWithdrawing(true);
    try {
      const updated = await withdrawAppeal(appealId);
      toast.success('Appeal withdrawn successfully.');
      if (fromModal && modalAppeal) {
        setModalAppeal(updated);
      }
      await fetchAppeals();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Failed to withdraw appeal.');
      console.error(error);
    } finally {
      setWithdrawing(false);
    }
  };

  // ── Close modal ───────────────────────────────────────
  const handleCloseModal = () => {
    setModalOpen(false);
    setModalAppeal(null);
  };

  // ── Loading state ─────────────────────────────────────
  if (loading) {
    return (
      <div className="appeals-container">
        <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
          <span className="spinner spinner--lg" aria-label="Loading appeals…" />
          <p style={{ marginTop: '1rem' }}>Loading appeal data…</p>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────
  return (
    <div className="appeals-container">
      {/* ── Header ──────────────────────────────────── */}
      <div className="appeals-header">
        <h1>📝 Grade Appeals</h1>
        <p>Submit a new grade appeal or track the status of your existing appeals.</p>
      </div>

      {/* ── Submit Form ─────────────────────────────── */}
      <div className="appeals-card">
        <div className="appeals-card__title">Submit New Appeal</div>
        <div className="appeals-card__subtitle">
          Select a course grade you wish to appeal, provide a reason, and optionally attach a
          supporting document URL.
        </div>

        <form className="appeal-form" onSubmit={handleSubmit} noValidate>
          {/* Grade dropdown */}
          <div className="form-group">
            <label htmlFor="appeal-grade" className="form-label form-label--required">
              Course Grade
            </label>
            <select
              id="appeal-grade"
              className={`form-select${formErrors.gradeId ? ' form-select--error' : ''}`}
              value={selectedGradeId}
              onChange={(e) => {
                setSelectedGradeId(e.target.value);
                if (formErrors.gradeId) setFormErrors((prev) => ({ ...prev, gradeId: '' }));
              }}
            >
              <option value="">-- Select a grade to appeal --</option>
              {grades.map((g) => (
                <option key={g.gradeId} value={g.gradeId}>
                  {g.courseCode} — {g.courseName} ({g.gradeValue}) — {g.term}
                </option>
              ))}
            </select>
            {formErrors.gradeId && <span className="form-error">{formErrors.gradeId}</span>}
            {grades.length === 0 && (
              <span className="form-hint">
                No grades available. You must have graded courses to submit an appeal.
              </span>
            )}
          </div>

          {/* Reason */}
          <div className="form-group">
            <label htmlFor="appeal-reason" className="form-label form-label--required">
              Appeal Reason
            </label>
            <textarea
              id="appeal-reason"
              className={`form-textarea${formErrors.appealReason ? ' form-textarea--error' : ''}`}
              rows={4}
              placeholder="Explain why you believe this grade should be reviewed (min. 10 characters)..."
              value={appealReason}
              onChange={(e) => {
                setAppealReason(e.target.value);
                if (formErrors.appealReason)
                  setFormErrors((prev) => ({ ...prev, appealReason: '' }));
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {formErrors.appealReason && (
                <span className="form-error">{formErrors.appealReason}</span>
              )}
              <span className="form-hint" style={{ marginLeft: 'auto' }}>
                {appealReason.length}/2000
              </span>
            </div>
          </div>

          {/* Document URL */}
          <div className="form-group">
            <label htmlFor="appeal-doc-url" className="form-label">
              Supporting Document URL
            </label>
            <input
              id="appeal-doc-url"
              type="url"
              className={`form-input${formErrors.documentUrl ? ' form-input--error' : ''}`}
              placeholder="https://drive.google.com/... (optional)"
              value={documentUrl}
              onChange={(e) => {
                setDocumentUrl(e.target.value);
                if (formErrors.documentUrl) setFormErrors((prev) => ({ ...prev, documentUrl: '' }));
              }}
            />
            {formErrors.documentUrl && <span className="form-error">{formErrors.documentUrl}</span>}
            <span className="form-hint">
              Link to any supporting evidence (scanned exam, email, etc.).
            </span>
          </div>

          {/* Submit button */}
          <div className="appeal-form-actions">
            <button
              type="submit"
              className="btn btn--primary"
              disabled={submitting || grades.length === 0}
            >
              {submitting ? 'Submitting…' : 'Submit Appeal'}
            </button>
          </div>
        </form>
      </div>

      {/* ── My Appeals Table ────────────────────────── */}
      <div className="appeals-card">
        <div className="appeals-card__title">My Appeals</div>
        <div className="appeals-card__subtitle">
          {appeals.length} appeal{appeals.length !== 1 ? 's' : ''} submitted
        </div>

        {appeals.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">📭</div>
            <p className="empty-state__text">
              No appeals submitted yet. Use the form above to submit your first appeal.
            </p>
          </div>
        ) : (
          <div className="appeals-table-wrapper">
            <table className="appeals-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Course</th>
                  <th>Grade</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appeals.map((a) => (
                  <tr key={a.appealId}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                      #{a.appealId}
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{a.courseCode || '—'}</span>
                      <br />
                      <span
                        style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}
                      >
                        {a.courseName || 'Unknown Course'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{a.gradeValue || '—'}</td>
                    <td>
                      <span className={getStatusBadgeClass(a.status)}>
                        {getStatusLabel(a.status)}
                      </span>
                    </td>
                    <td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                      {formatDate(a.submittedAt)}
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button
                          className="btn btn--view btn--sm"
                          onClick={() => handleView(a.appealId)}
                        >
                          View
                        </button>
                        {(a.status === 'Submitted' || a.status.toLowerCase() === 'submitted') && (
                          <button
                            className="btn btn--withdraw btn--sm"
                            onClick={() => handleWithdraw(a.appealId, false)}
                            disabled={withdrawing}
                          >
                            Withdraw
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Detail Modal ────────────────────────────── */}
      {modalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Appeal #{modalAppeal?.appealId || '—'}</h2>
              <button className="modal-close" onClick={handleCloseModal} aria-label="Close">
                ✕
              </button>
            </div>

            <div className="modal-body">
              {modalLoading ? (
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                  <span className="spinner" />
                  <p style={{ marginTop: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Loading detail…
                  </p>
                </div>
              ) : modalAppeal ? (
                <dl className="detail-grid">
                  <div>
                    <dt>Appeal ID</dt>
                    <dd>#{modalAppeal.appealId}</dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd>
                      <span className={getStatusBadgeClass(modalAppeal.status)}>
                        {getStatusLabel(modalAppeal.status)}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt>Course</dt>
                    <dd>
                      {modalAppeal.courseCode} — {modalAppeal.courseName}
                    </dd>
                  </div>
                  <div>
                    <dt>Current Grade</dt>
                    <dd style={{ fontWeight: 600 }}>{modalAppeal.gradeValue || '—'}</dd>
                  </div>
                  <div>
                    <dt>Submitted</dt>
                    <dd>{formatDate(modalAppeal.submittedAt)}</dd>
                  </div>
                  <div>
                    <dt>Student</dt>
                    <dd>{modalAppeal.studentName || `#${modalAppeal.studentId}`}</dd>
                  </div>
                  <div className="full-width">
                    <dt>Appeal Reason</dt>
                    <dd style={{ whiteSpace: 'pre-wrap' }}>
                      {modalAppeal.appealReason || 'No reason provided.'}
                    </dd>
                  </div>
                  {modalAppeal.supportingDocumentUrl && (
                    <div className="full-width">
                      <dt>Supporting Document</dt>
                      <dd>
                        <a
                          href={modalAppeal.supportingDocumentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          📎 View Document
                        </a>
                      </dd>
                    </div>
                  )}
                  {modalAppeal.reviewerComments && (
                    <div className="full-width">
                      <dt>Reviewer Comments</dt>
                      <dd style={{ whiteSpace: 'pre-wrap' }}>{modalAppeal.reviewerComments}</dd>
                    </div>
                  )}
                  {modalAppeal.deadline && (
                    <div>
                      <dt>Deadline</dt>
                      <dd>{formatDate(modalAppeal.deadline)}</dd>
                    </div>
                  )}
                  {modalAppeal.resolvedAt && (
                    <div>
                      <dt>Resolved</dt>
                      <dd>{formatDate(modalAppeal.resolvedAt)}</dd>
                    </div>
                  )}
                  {modalAppeal.resolutionCode && (
                    <div>
                      <dt>Resolution Code</dt>
                      <dd style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
                        {modalAppeal.resolutionCode}
                      </dd>
                    </div>
                  )}
                </dl>
              ) : (
                <p style={{ color: 'var(--color-text-muted)' }}>Unable to load appeal detail.</p>
              )}
            </div>

            <div className="modal-footer">
              {(modalAppeal?.status === 'Submitted' ||
                modalAppeal?.status?.toLowerCase() === 'submitted') && (
                <button
                  className="btn btn--withdraw"
                  onClick={() => handleWithdraw(modalAppeal!.appealId, true)}
                  disabled={withdrawing}
                >
                  {withdrawing ? 'Withdrawing…' : 'Withdraw Appeal'}
                </button>
              )}
              <button className="btn btn--secondary" onClick={handleCloseModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
