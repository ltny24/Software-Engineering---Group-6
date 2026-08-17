import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import {
  adminClassControlService,
  SchedulePreviewResponse,
  ScheduleRow,
} from '../../services/adminClassControlService';

import './ScheduleUpload.css';

const CSV_COLUMNS = ['courseCode', 'section', 'term', 'schedule', 'instructor', 'location', 'room'];

export default function ScheduleUploadPage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [preview, setPreview] = useState<SchedulePreviewResponse | null>(null);
  const [validRows, setValidRows] = useState<ScheduleRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{
    added: number;
    skipped: number;
    messages: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  const handlePreview = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast.error('Please choose a CSV file first.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      setResult(null);
      const res = await adminClassControlService.previewScheduleUpload(file);
      setPreview(res);
      setValidRows(res.validRows);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to validate the uploaded file.');
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (validRows.length === 0) return;
    try {
      setImporting(true);
      setError(null);
      const res = await adminClassControlService.confirmScheduleImport(validRows);
      setResult(res);
      toast.success(`Imported ${res.added} offering(s).`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to import the schedule.');
      toast.error('Import failed.');
    } finally {
      setImporting(false);
    }
  };

  const handleReset = () => {
    setFileName(null);
    setPreview(null);
    setValidRows([]);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="schedule-upload-page">
      <div className="admin-header-proto">
        <h1 className="admin-title">Master Schedule Upload</h1>
        <p className="admin-subtitle">
          Import course offerings (sections, schedule, instructor, room) from a CSV file. Review and
          validate before committing.
        </p>
      </div>

      {/* Upload step */}
      <div className="upload-card">
        <h3>1. Choose CSV file</h3>
        <p className="muted">
          Expected columns: <code>{CSV_COLUMNS.join(', ')}</code>
        </p>
        <div className="upload-row">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            data-testid="schedule-file-input"
          />
          <button className="btn-proto" onClick={handlePreview} disabled={loading}>
            {loading ? 'Validating…' : 'Validate & Preview'}
          </button>
        </div>
        {fileName && <p className="file-name">Selected: {fileName}</p>}
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* Preview step */}
      {preview && !result && (
        <>
          <div className="stat-cards-row">
            <div className="stat-card-proto">
              <div className="stat-number stat-blue">{preview.totalRows}</div>
              <div className="stat-label">Total Rows</div>
            </div>
            <div className="stat-card-proto">
              <div className="stat-number stat-green">{preview.validCount}</div>
              <div className="stat-label">Valid</div>
            </div>
            <div className="stat-card-proto">
              <div className="stat-number stat-orange">{preview.invalidCount}</div>
              <div className="stat-label">Invalid</div>
            </div>
          </div>

          <div className="upload-card">
            <h3>2. Review & confirm</h3>
            {preview.invalidRows.length > 0 && (
              <div className="invalid-table-wrap">
                <h4>Rejected rows</h4>
                <table className="admin-table-proto">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Course Code</th>
                      <th>Section</th>
                      <th>Term</th>
                      <th>Errors</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.invalidRows.map((row) => (
                      <tr key={row.rowNumber}>
                        <td>{row.rowNumber}</td>
                        <td>{row.courseCode || '—'}</td>
                        <td>{row.section || '—'}</td>
                        <td>{row.term || '—'}</td>
                        <td>
                          <ul className="error-list">
                            {row.errors.map((err) => (
                              <li key={err}>{err}</li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {preview.validRows.length > 0 && (
              <div className="valid-table-wrap">
                <h4>Ready to import ({preview.validRows.length} rows)</h4>
                <table className="admin-table-proto">
                  <thead>
                    <tr>
                      <th>Course Code</th>
                      <th>Section</th>
                      <th>Term</th>
                      <th>Schedule</th>
                      <th>Instructor</th>
                      <th>Room</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.validRows.map((row, i) => (
                      <tr key={i}>
                        <td>{row.courseCode}</td>
                        <td>{row.section}</td>
                        <td>{row.term}</td>
                        <td>{row.schedule}</td>
                        <td>{row.instructor || '—'}</td>
                        <td>{row.room || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="action-row">
              <button
                className="btn-proto btn-primary"
                onClick={handleConfirm}
                disabled={importing || validRows.length === 0}
              >
                {importing ? 'Importing…' : `Confirm Import (${validRows.length})`}
              </button>
              <button className="btn-proto btn-ghost" onClick={handleReset}>
                Reset
              </button>
            </div>
          </div>
        </>
      )}

      {/* Result step */}
      {result && (
        <div className="upload-card result-card">
          <h3>Import complete</h3>
          <div className="stat-cards-row">
            <div className="stat-card-proto">
              <div className="stat-number stat-green">{result.added}</div>
              <div className="stat-label">Added</div>
            </div>
            <div className="stat-card-proto">
              <div className="stat-number stat-orange">{result.skipped}</div>
              <div className="stat-label">Skipped</div>
            </div>
          </div>
          {result.messages.length > 0 && (
            <ul className="error-list">
              {result.messages.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          )}
          <button className="btn-proto btn-primary" onClick={handleReset}>
            Upload Another File
          </button>
        </div>
      )}
    </div>
  );
}
