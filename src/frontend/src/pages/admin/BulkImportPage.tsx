import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import {
  bulkImportService,
  CourseImportPreviewResponse,
  CourseImportResponse,
  StudentImportPreviewResponse,
  StudentImportResponse,
} from '../../services/bulkImportApi';

import './BulkImport.css';

type ImportType = 'student' | 'course';

const STUDENT_COLUMNS = [
  'username',
  'password',
  'firstName',
  'lastName',
  'email',
  'middleName',
  'phone',
  'address',
  'dateOfBirth',
  'studentType',
  'major',
  'enrollmentStatus',
  'registrationStatus',
];

const COURSE_COLUMNS = [
  'courseCode',
  'courseName',
  'description',
  'credits',
  'prerequisites',
  'department',
  'semester',
  'capacity',
];

export default function BulkImportPage() {
  const [importType, setImportType] = useState<ImportType>('student');
  const [fileName, setFileName] = useState<string | null>(null);
  const [preview, setPreview] = useState<
    StudentImportPreviewResponse | CourseImportPreviewResponse | null
  >(null);
  const [result, setResult] = useState<StudentImportResponse | CourseImportResponse | null>(null);
  const [updateExisting, setUpdateExisting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const columns = importType === 'student' ? STUDENT_COLUMNS : COURSE_COLUMNS;
  const required =
    importType === 'student' ? STUDENT_COLUMNS.slice(0, 5) : COURSE_COLUMNS.slice(0, 2);

  const handleTypeChange = (type: ImportType) => {
    setImportType(type);
    setFileName(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setUpdateExisting(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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
      toast.error('Please choose a file first.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      setResult(null);
      const res =
        importType === 'student'
          ? await bulkImportService.previewStudents(file)
          : await bulkImportService.previewCourses(file);
      setPreview(res);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to validate the uploaded file.');
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!preview || preview.validRows.length === 0) return;
    try {
      setImporting(true);
      setError(null);
      const res =
        importType === 'student'
          ? await bulkImportService.confirmStudents(
              (preview as StudentImportPreviewResponse).validRows,
              updateExisting
            )
          : await bulkImportService.confirmCourses(
              (preview as CourseImportPreviewResponse).validRows
            );
      setResult(res);
      toast.success(
        `Imported ${res.added} record(s), updated ${res.updated}, skipped ${res.skipped}.`
      );
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to import.');
      toast.error('Import failed.');
    } finally {
      setImporting(false);
    }
  };

  const handleReset = () => {
    setFileName(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setUpdateExisting(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadReport = () => {
    if (!preview || preview.invalidRows.length === 0) return;
    const lines = ['rowNumber,field,error'];
    preview.invalidRows.forEach((row) => {
      row.errors.forEach((err) => {
        const idx = err.indexOf(': ');
        const field = idx >= 0 ? err.slice(0, idx) : 'field';
        const desc = idx >= 0 ? err.slice(idx + 2) : err;
        lines.push(`"${row.rowNumber}","${field}","${desc.replace(/"/g, '""')}"`);
      });
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `validation-report-${importType}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const fullName = (row: { firstName?: string; lastName?: string }) =>
    [row.firstName, row.lastName].filter(Boolean).join(' ').trim() || '—';

  return (
    <div className="bulk-import-page">
      <div className="admin-header-proto">
        <h1 className="admin-title">Bulk Import</h1>
        <p className="admin-subtitle">
          Import student or course records in bulk from a CSV/XLSX file. Uploads are validated
          first; duplicates and invalid rows are reported before anything is written.
        </p>
      </div>

      {/* Data type selector */}
      <div className="import-type-row">
        <button
          className={`btn-proto ${importType === 'student' ? 'btn-primary' : ''}`}
          onClick={() => handleTypeChange('student')}
        >
          Students
        </button>
        <button
          className={`btn-proto ${importType === 'course' ? 'btn-primary' : ''}`}
          onClick={() => handleTypeChange('course')}
        >
          Courses
        </button>
        <span className="muted">Class/section data → use “Master Schedule Upload”.</span>
      </div>

      {/* Upload step */}
      <div className="upload-card">
        <h3>1. Choose file</h3>
        <p className="muted">
          Expected columns: <code>{columns.join(', ')}</code>
        </p>
        <p className="muted">
          Required: <code>{required.join(', ')}</code>. Supports <code>.csv</code> and{' '}
          <code>.xlsx</code>.
        </p>
        <div className="upload-row">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,text/csv"
            onChange={handleFileChange}
            data-testid="bulk-import-file-input"
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
                      {importType === 'student' ? (
                        <>
                          <th>Username</th>
                          <th>Name</th>
                          <th>Email</th>
                        </>
                      ) : (
                        <>
                          <th>Course Code</th>
                          <th>Course Name</th>
                        </>
                      )}
                      <th>Errors</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.invalidRows.map((row: any) => (
                      <tr key={row.rowNumber}>
                        <td>{row.rowNumber}</td>
                        {importType === 'student' ? (
                          <>
                            <td>{row.username || '—'}</td>
                            <td>{fullName(row)}</td>
                            <td>{row.email || '—'}</td>
                          </>
                        ) : (
                          <>
                            <td>{row.courseCode || '—'}</td>
                            <td>{row.courseName || '—'}</td>
                          </>
                        )}
                        <td>
                          <ul className="error-list">
                            {row.errors.map((err: string) => (
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
                      {importType === 'student' ? (
                        <>
                          <th>Username</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Major</th>
                          <th>Enrollment</th>
                        </>
                      ) : (
                        <>
                          <th>Course Code</th>
                          <th>Course Name</th>
                          <th>Credits</th>
                          <th>Department</th>
                          <th>Capacity</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.validRows.map((row: any, i: number) =>
                      importType === 'student' ? (
                        <tr key={i}>
                          <td>{row.username}</td>
                          <td>{fullName(row)}</td>
                          <td>{row.email}</td>
                          <td>{row.major || '—'}</td>
                          <td>{row.enrollmentStatus || '—'}</td>
                        </tr>
                      ) : (
                        <tr key={i}>
                          <td>{row.courseCode}</td>
                          <td>{row.courseName}</td>
                          <td>{row.credits || '—'}</td>
                          <td>{row.department || '—'}</td>
                          <td>{row.capacity || '—'}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {importType === 'student' && (
              <label className="update-existing">
                <input
                  type="checkbox"
                  checked={updateExisting}
                  onChange={(e) => setUpdateExisting(e.target.checked)}
                />{' '}
                Update existing students (overwrite instead of skip)
              </label>
            )}

            <div className="action-row">
              <button
                className="btn-proto btn-primary"
                onClick={handleConfirm}
                disabled={importing || preview.validRows.length === 0}
              >
                {importing ? 'Importing…' : `Confirm Import (${preview.validRows.length})`}
              </button>
              <button
                className="btn-proto btn-ghost"
                onClick={downloadReport}
                disabled={preview.invalidRows.length === 0}
              >
                Download Validation Report
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
              <div className="stat-number stat-blue">{result.updated}</div>
              <div className="stat-label">Updated</div>
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
