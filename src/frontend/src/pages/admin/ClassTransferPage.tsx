import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  adminClassControlService,
  ClassTransferResponse,
  OfferingRosterResponse,
} from '../../services/adminClassControlService';
import type { CourseOffering } from '../../types';

import './ClassTransfer.css';

export default function ClassTransferPage() {
  const [offerings, setOfferings] = useState<CourseOffering[]>([]);
  const [offeringsLoading, setOfferingsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [sourceId, setSourceId] = useState<number | null>(null);
  const [roster, setRoster] = useState<OfferingRosterResponse | null>(null);
  const [rosterLoading, setRosterLoading] = useState(false);

  const [selectedStudents, setSelectedStudents] = useState<Set<number>>(new Set());
  const [targetId, setTargetId] = useState<number | null>(null);
  const [overrideCapacity, setOverrideCapacity] = useState(false);
  const [overrideConflict, setOverrideConflict] = useState(false);
  const [justification, setJustification] = useState('');

  const [transferring, setTransferring] = useState(false);
  const [result, setResult] = useState<ClassTransferResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await adminClassControlService.listOfferings({ page: 0, size: 500 });
        setOfferings(res.content || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load course offerings.');
      } finally {
        setOfferingsLoading(false);
      }
    })();
  }, []);

  const filteredOfferings = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return offerings;
    return offerings.filter(
      (o) =>
        o.course?.courseCode?.toLowerCase().includes(q) ||
        o.course?.courseName?.toLowerCase().includes(q) ||
        o.section?.toLowerCase().includes(q)
    );
  }, [offerings, search]);

  const selectSource = async (offeringId: number) => {
    setSourceId(offeringId);
    setRoster(null);
    setResult(null);
    setError(null);
    setSelectedStudents(new Set());
    setTargetId(null);
    setRosterLoading(true);
    try {
      const res = await adminClassControlService.getRoster(offeringId);
      setRoster(res);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load the roster.');
    } finally {
      setRosterLoading(false);
    }
  };

  const toggleStudent = (id: number) => {
    setSelectedStudents((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (!roster) return;
    setSelectedStudents((prev) => {
      if (prev.size === roster.students.length) return new Set();
      return new Set(roster.students.map((s) => s.studentId));
    });
  };

  const handleTransfer = async () => {
    if (sourceId == null || targetId == null || selectedStudents.size === 0) {
      toast.error('Select a source section, target section, and at least one student.');
      return;
    }
    try {
      setTransferring(true);
      setError(null);
      setResult(null);
      const res = await adminClassControlService.performTransfer({
        fromOfferingId: sourceId,
        toOfferingId: targetId,
        studentIds: Array.from(selectedStudents),
        justification,
        overrideCapacity,
        overrideConflict,
      });
      setResult(res);
      toast.success(`Transferred ${res.transferredCount} student(s).`);
      // Refresh the roster to reflect the new seat counts.
      await selectSource(sourceId);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Transfer failed.');
      toast.error('Transfer failed.');
    } finally {
      setTransferring(false);
    }
  };

  return (
    <div className="class-transfer-page">
      <div className="admin-header-proto">
        <h1 className="admin-title">Class Transfer Management</h1>
        <p className="admin-subtitle">
          Move one or more students from one section of a course to another section of the same
          course. Seat and schedule checks are applied automatically.
        </p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* Step 1: choose source section */}
      <div className="transfer-panel">
        <h3>1. Select a source section</h3>
        <input
          type="text"
          className="search-input"
          placeholder="Search by course code, name, or section…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {offeringsLoading ? (
          <div className="loading-state">Loading offerings…</div>
        ) : (
          <div className="offering-grid">
            {filteredOfferings.map((o) => (
              <button
                key={o.offeringId}
                className={`offering-card ${sourceId === Number(o.offeringId) ? 'active' : ''}`}
                onClick={() => selectSource(Number(o.offeringId))}
              >
                <div className="oc-code">
                  {o.course?.courseCode} · {o.section}
                </div>
                <div className="oc-name">{o.course?.courseName}</div>
                <div className="oc-meta">
                  {o.term} · {o.availableSeats} seats left
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Step 2: roster + target */}
      {rosterLoading ? (
        <div className="loading-state">Loading roster…</div>
      ) : roster ? (
        <>
          <div className="transfer-panel">
            <h3>2. Select students & target section</h3>
            <div className="source-summary">
              <strong>
                {roster.offering.course?.courseCode} — {roster.offering.section}
              </strong>{' '}
              <span className="muted">
                {roster.offering.course?.courseName} · {roster.offering.term} ·{' '}
                {roster.offering.schedule}
              </span>
            </div>

            {roster.students.length === 0 ? (
              <p className="muted">No students enrolled in this section.</p>
            ) : (
              <div className="roster-table-wrap">
                <label className="select-all">
                  <input
                    type="checkbox"
                    checked={
                      roster.students.length > 0 && selectedStudents.size === roster.students.length
                    }
                    onChange={toggleAll}
                  />{' '}
                  Select all ({roster.students.length})
                </label>
                <table className="admin-table-proto">
                  <thead>
                    <tr>
                      <th></th>
                      <th>ID</th>
                      <th>Student</th>
                      <th>Username</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roster.students.map((s) => (
                      <tr key={s.studentId}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedStudents.has(s.studentId)}
                            onChange={() => toggleStudent(s.studentId)}
                          />
                        </td>
                        <td>{s.studentId}</td>
                        <td>{s.fullName}</td>
                        <td>{s.username}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <h4>Target section</h4>
            {roster.targets.length === 0 ? (
              <p className="muted">No other sections available for this course.</p>
            ) : (
              <div className="target-list">
                {roster.targets.map((t) => (
                  <label
                    key={t.offeringId}
                    className={`target-card ${targetId === Number(t.offeringId) ? 'active' : ''}`}
                  >
                    <input
                      type="radio"
                      name="target"
                      checked={targetId === Number(t.offeringId)}
                      onChange={() => setTargetId(Number(t.offeringId))}
                    />
                    <span className="target-body">
                      <span className="oc-code">{t.section}</span>
                      <span className="oc-meta">
                        {t.schedule} · {t.instructor} · {t.availableSeats} seats left
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            )}

            <div className="override-row">
              <label>
                <input
                  type="checkbox"
                  checked={overrideCapacity}
                  onChange={(e) => setOverrideCapacity(e.target.checked)}
                />{' '}
                Override seat-capacity check
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={overrideConflict}
                  onChange={(e) => setOverrideConflict(e.target.checked)}
                />{' '}
                Override schedule-conflict check
              </label>
            </div>

            <textarea
              className="justification-input"
              placeholder="Justification (optional, recorded in the audit log)…"
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              rows={2}
            />

            <div className="action-row">
              <button
                className="btn-proto btn-primary"
                onClick={handleTransfer}
                disabled={
                  transferring ||
                  selectedStudents.size === 0 ||
                  targetId == null ||
                  roster.targets.length === 0
                }
              >
                {transferring ? 'Transferring…' : `Transfer ${selectedStudents.size} student(s)`}
              </button>
            </div>
          </div>

          {result && (
            <div className="transfer-panel result-panel">
              <h3>Transfer result</h3>
              <div className="stat-cards-row">
                <div className="stat-card-proto">
                  <div className="stat-number stat-green">{result.transferredCount}</div>
                  <div className="stat-label">Transferred</div>
                </div>
                <div className="stat-card-proto">
                  <div className="stat-number stat-orange">{result.failed.length}</div>
                  <div className="stat-label">Failed</div>
                </div>
              </div>
              {result.failed.length > 0 && (
                <ul className="error-list">
                  {result.failed.map((f) => (
                    <li key={f.studentId}>
                      {f.studentName} ({f.studentId}): {f.reason}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
