import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminAppealService, AdminAppealResponse } from '../../services/adminAppealService';
import { ROUTES } from '../../utils/constants';

import './AdminAppeals.css';

export default function AdminAppealDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [appeal, setAppeal] = useState<AdminAppealResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Modal states
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [showReopenModal, setShowReopenModal] = useState(false);

  // Form State - Status
  const [newStatus, setNewStatus] = useState('');
  const [processingNote, setProcessingNote] = useState('');

  // Form State - Fee
  const [deadline, setDeadline] = useState('');
  const [changeReason, setChangeReason] = useState('');

  // Form State - Reopen
  const [reopenNote, setReopenNote] = useState('');

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) fetchAppealDetails(id);
  }, [id]);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(''), 5000);
  };

  const fetchAppealDetails = async (appealId: string) => {
    try {
      setLoading(true);
      const data = await adminAppealService.getAppealById(appealId);
      setAppeal(data);
      setNewStatus(data.status);
      setProcessingNote(data.reviewerComments || '');
      setDeadline(data.deadline ? new Date(data.deadline).toISOString().slice(0, 10) : '');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load appeal details.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!appeal) return;
    try {
      setSubmitting(true);
      const payload = {
        status: newStatus,
        reviewerComments: processingNote,
      };
      const updated = await adminAppealService.reviewAppeal(appeal.appealId, payload);
      setAppeal(updated);
      setShowStatusModal(false);
      showToast(`Status updated to "${newStatus}". Student notified.`, 'success');
    } catch (err: any) {
      showToast(
        err.response?.data?.message ||
          'System Error: Failed to update appeal status. Previous information remains unchanged.',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleFeeUpdate = async () => {
    if (!appeal) return;
    try {
      setSubmitting(true);
      const payload = {
        status: appeal.status,
        reviewerComments: appeal.reviewerComments || processingNote,
        deadline: deadline ? new Date(deadline).toISOString() : undefined,
      };
      const updated = await adminAppealService.reviewAppeal(appeal.appealId, payload);
      setAppeal(updated);
      setShowFeeModal(false);
      setChangeReason('');
      showToast('Fee deadline updated successfully.', 'success');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update fee deadline.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReopen = async () => {
    if (!appeal) return;
    try {
      setSubmitting(true);
      const payload = {
        status: 'Under Review',
        reviewerComments: reopenNote,
      };
      const updated = await adminAppealService.reviewAppeal(appeal.appealId, payload);
      setAppeal(updated);
      setShowReopenModal(false);
      setReopenNote('');
      showToast('Appeal reopened and set to Under Review.', 'success');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to reopen appeal.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="appeals-loading">Loading appeal details...</div>;
  if (error || !appeal) return <div className="appeals-error">{error || 'Appeal not found'}</div>;

  const displayId = `AP-${new Date(appeal.submittedAt).getFullYear()}-${appeal.appealId.toString().padStart(3, '0')}`;
  const isTerminal =
    appeal.status === 'Approved' ||
    appeal.status === 'Denied' ||
    appeal.status === 'Rejected' ||
    appeal.status === 'Closed';

  const statusClass = appeal.status.toLowerCase().replace(' ', '-');

  return (
    <div className="admin-appeal-detail-page">
      {/* Toast */}
      {toastMsg && (
        <div className={`proto-toast proto-toast--${toastType}`}>
          <span>{toastType === 'success' ? '✓' : '●'}</span> {toastMsg}
        </div>
      )}

      {/* Breadcrumb */}
      <div className="proto-breadcrumb">
        <button className="proto-back-link" onClick={() => navigate(`${ROUTES.ADMIN}/appeals`)}>
          ← All Appeals
        </button>
        <span className="proto-breadcrumb-sep">›</span>
        <span className="proto-breadcrumb-current">{displayId}</span>
      </div>

      {/* Header Card */}
      <div className="proto-detail-header-card">
        <div className="proto-header-left">
          <div className="proto-badges">
            <span className="proto-badge-id">{displayId}</span>
            <span className={`badge-proto badge-${statusClass}`}>{appeal.status}</span>
            <span className="proto-badge-type">Grade Review</span>
          </div>
          <h2 className="proto-course-title">{appeal.courseName}</h2>
          <div className="proto-course-subtitle">
            {appeal.courseCode} · Current grade: <strong>{appeal.gradeValue}</strong>
          </div>
          <div className="proto-submitted-date">
            Submitted:{' '}
            {new Date(appeal.submittedAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </div>
        </div>

        <div className="proto-header-right">
          {isTerminal ? (
            <div className="proto-finalized-actions">
              <span className="proto-badge-final">Final decision · No further changes allowed</span>
              <button className="proto-btn-outline-yellow" onClick={() => setShowReopenModal(true)}>
                Reopen
              </button>
            </div>
          ) : (
            <>
              <button className="proto-btn-outline-yellow" onClick={() => setShowFeeModal(true)}>
                {appeal.deadline ? '$ Change Fee Deadline' : '$ Set Fee Deadline'}
              </button>
              <button className="proto-btn-solid-blue" onClick={() => setShowStatusModal(true)}>
                ● Update Status
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Layout */}
      <div className="proto-detail-layout">
        {/* Left Column */}
        <div className="proto-col-left">
          {/* Student Info */}
          <div className="proto-card">
            <h3 className="proto-card-title">Student Information</h3>
            <div className="proto-info-grid">
              <div className="proto-info-item">
                <span className="proto-label">STUDENT ID (MSSV)</span>
                <span className="proto-value">{appeal.studentUsername || appeal.studentId}</span>
              </div>
              <div className="proto-info-item">
                <span className="proto-label">FULL NAME</span>
                <span className="proto-value">{appeal.studentName}</span>
              </div>
            </div>
          </div>

          {/* Appeal Details */}
          <div className="proto-card">
            <h3 className="proto-card-title">Appeal Details</h3>
            <p className="proto-reason-text">{appeal.appealReason}</p>
          </div>

          {/* Supporting Documents */}
          <div className="proto-card">
            <h3 className="proto-card-title">Supporting Documents</h3>
            {appeal.supportingDocumentUrl &&
            !appeal.supportingDocumentUrl.startsWith('https://ktdbcl') ? (
              <div className="proto-doc-list">
                <div className="proto-doc-item">
                  <span className="proto-doc-name">Supporting Document (PDF)</span>
                  <button
                    className="proto-doc-view-btn"
                    onClick={() => {
                      const win = window.open();
                      if (win && appeal.supportingDocumentUrl) {
                        if (appeal.supportingDocumentUrl.startsWith('data:')) {
                          win.document.write(
                            `<iframe src="${appeal.supportingDocumentUrl}" width="100%" height="100%" style="border:none"></iframe>`
                          );
                        } else {
                          win.location.href = appeal.supportingDocumentUrl;
                        }
                      }
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
            ) : (
              <p className="proto-text-muted">No documents attached.</p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="proto-col-right">
          {/* Fee Status */}
          <div className="proto-card">
            <h3 className="proto-card-title">Fee Status</h3>
            <div className="proto-fee-rows">
              <div className="proto-fee-row">
                <span>Amount</span>
                <span>15.000 VNĐ</span>
              </div>
              <div className="proto-fee-row">
                <span>Status</span>
                <span className="proto-fee-unpaid">Unpaid</span>
              </div>
              {appeal.deadline && (
                <div className="proto-fee-row">
                  <span>Deadline</span>
                  <span>
                    {new Date(appeal.deadline).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              )}
            </div>
            {!appeal.deadline && (
              <div className="proto-deadline-box warning">
                No deadline set — use "Set Fee Deadline" above.
              </div>
            )}
          </div>

          {/* Appeal History */}
          <div className="proto-card">
            <h3 className="proto-card-title">Appeal History</h3>
            <div className="proto-timeline">
              {appeal.resolvedAt && (
                <div className="proto-timeline-item">
                  <div className="proto-timeline-dot bg-blue"></div>
                  <div className="proto-timeline-content">
                    <div className="title">Status → {appeal.status}</div>
                    <div className="desc">{appeal.reviewerComments || 'Appeal reviewed.'}</div>
                    <div className="time">
                      {new Date(appeal.resolvedAt).toLocaleString('en-GB')} · Admin
                    </div>
                  </div>
                </div>
              )}
              {appeal.deadline && (
                <div className="proto-timeline-item">
                  <div className="proto-timeline-dot bg-blue"></div>
                  <div className="proto-timeline-content">
                    <div className="title">Fee deadline set</div>
                    <div className="desc">
                      Deadline set to{' '}
                      {new Date(appeal.deadline).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                      .
                    </div>
                    <div className="time">· Admin</div>
                  </div>
                </div>
              )}
              {appeal.reviewerComments && !appeal.resolvedAt && (
                <div className="proto-timeline-item">
                  <div className="proto-timeline-dot bg-blue"></div>
                  <div className="proto-timeline-content">
                    <div className="title">Status → {appeal.status}</div>
                    <div className="desc">{appeal.reviewerComments}</div>
                    <div className="time">· Admin</div>
                  </div>
                </div>
              )}
              <div className="proto-timeline-item">
                <div className="proto-timeline-dot bg-gray"></div>
                <div className="proto-timeline-content">
                  <div className="title">Appeal submitted</div>
                  <div className="desc">Student submitted grade review appeal.</div>
                  <div className="time">
                    {new Date(appeal.submittedAt).toLocaleString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    · System
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ───── Modal: Update Status ───── */}
      {showStatusModal && (
        <div className="proto-modal-overlay">
          <div className="proto-modal">
            <div className="proto-modal-header">
              <h3>Update Appeal Status</h3>
              <button className="proto-close-btn" onClick={() => setShowStatusModal(false)}>
                ×
              </button>
            </div>
            <div className="proto-modal-body">
              <div className="proto-modal-current">
                <span className="label">Current:</span>
                <span className={`badge-proto badge-${statusClass}`}>{appeal.status}</span>
              </div>

              <label className="proto-label-required">
                New Status <span>*</span>
              </label>
              <div className="proto-status-pills">
                {['Pending Info', 'Pending Payment', 'Approved', 'Denied', 'Closed'].map((st) => (
                  <button
                    key={st}
                    className={`proto-status-pill ${newStatus === st ? 'selected' : ''}`}
                    onClick={() => setNewStatus(st)}
                  >
                    <span className={`dot dot-${st.toLowerCase().replace(' ', '-')}`}></span>
                    {st === 'Denied' ? 'Rejected' : st}
                  </button>
                ))}
              </div>

              {newStatus === 'Pending Info' && (
                <>
                  <label className="proto-label-required" style={{ marginTop: '1.25rem' }}>
                    Requested Information <span>*</span>
                    <span className="proto-label-hint">
                      {' '}
                      (specify what the student needs to provide)
                    </span>
                  </label>
                  <textarea
                    value={processingNote}
                    onChange={(e) => setProcessingNote(e.target.value)}
                    className="proto-input"
                    rows={3}
                    placeholder="List the specific documents or details required from the student..."
                  />
                </>
              )}

              {newStatus !== 'Pending Info' && (
                <>
                  <label className="proto-label-required" style={{ marginTop: '1.25rem' }}>
                    Processing Note <span>*</span>
                  </label>
                  <textarea
                    value={processingNote}
                    onChange={(e) => setProcessingNote(e.target.value)}
                    className="proto-input"
                    rows={4}
                    placeholder="Add a note about this status change..."
                  />
                </>
              )}
            </div>
            <div className="proto-modal-footer">
              <button
                className="proto-btn-solid-blue proto-btn-full"
                onClick={handleStatusUpdate}
                disabled={submitting}
              >
                Review Update
              </button>
              <button className="proto-btn-cancel" onClick={() => setShowStatusModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───── Modal: Set/Change Fee Deadline ───── */}
      {showFeeModal && (
        <div className="proto-modal-overlay">
          <div className="proto-modal">
            <div className="proto-modal-header">
              <h3>{appeal.deadline ? 'Change Fee Deadline' : 'Set Fee Deadline'}</h3>
              <button className="proto-close-btn" onClick={() => setShowFeeModal(false)}>
                ×
              </button>
            </div>
            <div className="proto-modal-body">
              {appeal.deadline && (
                <div className="proto-fee-info-row">
                  <span className="proto-fee-info-dot"></span>
                  Processing fee: 15.000 VNĐ · Status:{' '}
                  <strong className="proto-fee-unpaid">Unpaid</strong> · Current deadline:{' '}
                  <strong>
                    {new Date(appeal.deadline).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </strong>
                </div>
              )}

              <label
                className="proto-label-required"
                style={{ marginTop: appeal.deadline ? '1.25rem' : 0 }}
              >
                New Payment Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="proto-input"
              />

              {appeal.deadline && (
                <>
                  <label className="proto-label-required" style={{ marginTop: '1.25rem' }}>
                    Reason for Change <span>*</span>
                  </label>
                  <textarea
                    value={changeReason}
                    onChange={(e) => setChangeReason(e.target.value)}
                    className="proto-input"
                    rows={3}
                    placeholder="Explain why the deadline is being changed..."
                  />
                </>
              )}
            </div>
            <div className="proto-modal-footer">
              <button
                className="proto-btn-solid-blue proto-btn-full"
                onClick={handleFeeUpdate}
                disabled={submitting}
              >
                Review Deadline
              </button>
              <button className="proto-btn-cancel" onClick={() => setShowFeeModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───── Modal: Reopen ───── */}
      {showReopenModal && (
        <div className="proto-modal-overlay">
          <div className="proto-modal">
            <div className="proto-modal-header">
              <h3>Update Appeal Status</h3>
              <button className="proto-close-btn" onClick={() => setShowReopenModal(false)}>
                ×
              </button>
            </div>
            <div className="proto-modal-body">
              <div className="proto-modal-current">
                <span className="label">Current:</span>
                <span className={`badge-proto badge-${statusClass}`}>{appeal.status}</span>
              </div>

              <div className="proto-reopen-warning">
                <span className="proto-reopen-warning-icon">●</span>
                <span>
                  <strong>Reopening a finalized appeal</strong> — administrator permission required.
                  A reason must be provided.
                </span>
              </div>

              <label className="proto-label-required" style={{ marginTop: '1rem' }}>
                New Status <span>*</span>
              </label>
              <div className="proto-status-pills">
                <button className="proto-status-pill selected">
                  <span className="dot dot-closed"></span>Closed
                </button>
              </div>

              <label className="proto-label-required" style={{ marginTop: '1.25rem' }}>
                Processing Note <span>*</span>
              </label>
              <textarea
                value={reopenNote}
                onChange={(e) => setReopenNote(e.target.value)}
                className="proto-input"
                rows={4}
                placeholder="Add a note about this status change..."
              />
            </div>
            <div className="proto-modal-footer">
              <button
                className="proto-btn-solid-blue proto-btn-full"
                onClick={handleReopen}
                disabled={submitting}
              >
                Review Update
              </button>
              <button className="proto-btn-cancel" onClick={() => setShowReopenModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
