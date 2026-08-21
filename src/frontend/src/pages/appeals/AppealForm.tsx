import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { FaPaperPlane } from 'react-icons/fa6';
import api from '../../services/api';
import { getAppealErrorMessage, validateSupportingFile } from './appealSubmissionUtils';
import type { AppealConfigResponse, AppealFormValues } from './types';

interface AppealFormProps {
  onSubmitted?: () => void;
}

const MIN_REASON_LENGTH = 50;

const getFallbackDeadline = () => {
  const fallback = new Date();
  fallback.setDate(fallback.getDate() + 14);
  return fallback;
};

const formatDeadline = (value: Date) =>
  value.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid var(--color-border, rgba(100,140,200,0.2))',
  borderRadius: 8,
  padding: '10px 12px',
  fontSize: 14,
  color: 'var(--color-text, #334155)',
  backgroundColor: 'var(--color-surface, #fff)',
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: 8,
  fontSize: 14,
  fontWeight: 600,
  color: 'var(--color-text, #1e293b)',
};

const helperTextStyle: React.CSSProperties = {
  marginTop: 8,
  fontSize: 13,
  color: 'var(--color-text-secondary, #64748b)',
};

const AppealForm: React.FC<AppealFormProps> = ({ onSubmitted }) => {
  const [config, setConfig] = useState<AppealConfigResponse | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [configLoaded, setConfigLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof AppealFormValues | 'file', string>>>(
    {}
  );
  const [form, setForm] = useState<AppealFormValues>({
    gradeId: '',
    currentGrade: '',
    expectedGrade: '',
    reason: '',
  });
  const [gradeOptions, setGradeOptions] = useState<
    Array<{
      gradeId: number;
      courseCode?: string;
      courseName?: string;
      currentGrade: string;
      term?: string;
      isFinalized?: boolean;
      isEligibleForAppeal?: boolean;
    }>
  >([]);
  const eligibleGradeOptions = useMemo(
    () =>
      gradeOptions.filter(
        (option) => option.isFinalized !== false && option.isEligibleForAppeal !== false
      ),
    [gradeOptions]
  );

  useEffect(() => {
    void loadConfig();
    void loadGradeOptions();
  }, []);

  const loadConfig = async () => {
    try {
      setLoadingConfig(true);
      const res: any = await api.get('/appeals/config').catch(() => api.get('/api/appeals/config'));
      const data = res?.data ?? res;
      setConfig(data);
      setConfigLoaded(true);
    } catch {
      setConfig(null);
      setConfigLoaded(false);
    } finally {
      setLoadingConfig(false);
    }
  };

  const loadGradeOptions = async () => {
    try {
      const res: any = await api
        .get('/appeals/grades')
        .catch(() => api.get('/api/v1/grades/me'))
        .catch(() => api.get('/api/appeals/grades'));
      const rawList = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
      const mapped = rawList.map((item: any) => ({
        gradeId: item.gradeId,
        courseCode: item.courseCode || 'N/A',
        courseName: item.courseName || 'N/A',
        currentGrade:
          item.currentGrade != null
            ? String(item.currentGrade)
            : item.gradeValue != null
              ? String(item.gradeValue)
              : item.gradePoint != null
                ? String(item.gradePoint)
                : item.overallScore != null
                  ? String(item.overallScore)
                  : 'N/A',
        term: item.term,
        isFinalized: item.isFinalized !== false,
        isEligibleForAppeal: item.isEligibleForAppeal !== false,
      }));
      setGradeOptions(mapped);
    } catch {
      setGradeOptions([]);
    }
  };

  const effectiveDeadline = useMemo(() => {
    const deadlineValue = config?.submissionDeadline ?? config?.deadline;
    if (deadlineValue) {
      const parsed = new Date(deadlineValue);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }

    return getFallbackDeadline();
  }, [config]);

  const deadlinePassed = useMemo(
    () =>
      config?.submissionDeadline || config?.deadline
        ? effectiveDeadline.getTime() < Date.now()
        : false,
    [config, effectiveDeadline]
  );
  const deadlineLabel = useMemo(() => formatDeadline(effectiveDeadline), [effectiveDeadline]);

  const hasEligibleGrade = eligibleGradeOptions.length > 0;
  const blockedByEligibility = !hasEligibleGrade;
  const blockedByDeadline = !loadingConfig && deadlinePassed;
  const formDisabled =
    loadingConfig ||
    blockedByEligibility ||
    blockedByDeadline ||
    Boolean(config?.allowSubmission === false);
  const showDeadlineNotice = configLoaded && !loadingConfig;
  const blockingMessage = blockedByEligibility
    ? 'Không có môn học nào đủ điều kiện phúc khảo'
    : blockedByDeadline
      ? 'Hạn nộp đơn phúc khảo đã kết thúc. Không thể gửi đơn mới.'
      : null;

  const validate = () => {
    const nextErrors: Partial<Record<keyof AppealFormValues | 'file', string>> = {};

    if (!form.gradeId.trim()) {
      nextErrors.gradeId = 'Please choose a course / grade to appeal.';
    }

    if (!form.currentGrade.trim()) {
      nextErrors.currentGrade = 'Please enter your current grade.';
    }

    if (!form.expectedGrade.trim() || Number.isNaN(Number(form.expectedGrade))) {
      nextErrors.expectedGrade = 'Please enter a valid expected grade (0.0 - 10.0).';
    }

    if (form.reason.trim().length < MIN_REASON_LENGTH) {
      nextErrors.reason = `Please enter at least ${MIN_REASON_LENGTH} characters explaining the issue.`;
    }

    const fileError = validateSupportingFile(selectedFile);
    if (fileError) {
      nextErrors.file = fileError;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setSubmitError(null);

    if (!validate()) {
      toast.error('Please fix the highlighted validation issues.');
      return;
    }

    if (formDisabled) {
      return;
    }

    const selectedGrade = eligibleGradeOptions.find(
      (option) => option.gradeId === Number(form.gradeId)
    );

    if (!selectedGrade) {
      toast.error('Please choose a grade that belongs to you.');
      return;
    }

    // Convert file to base64 Data URL so admin can view the actual document
    let documentUrl = 'https://ktdbcl.hcmus.edu.vn/';
    if (selectedFile) {
      try {
        documentUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(selectedFile);
        });
      } catch {
        // Fallback to filename if conversion fails
        documentUrl = selectedFile.name;
      }
    }

    const payload = {
      gradeId: Number(form.gradeId),
      appealReason: form.reason,
      expectedGrade: Number(form.expectedGrade),
      supportingDocumentUrl: documentUrl,
    };

    try {
      setSubmitting(true);
      await api.post('/api/appeals', payload);
      toast.success('Your appeal was submitted successfully.');
      setForm({ gradeId: '', currentGrade: '', expectedGrade: '', reason: '' });
      setSelectedFile(null);
      setErrors({});
      onSubmitted?.();
    } catch (error) {
      const message = getAppealErrorMessage(error);
      setSubmitError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div
        style={{
          marginBottom: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '16px 18px',
          borderRadius: 12,
          border: '1px solid var(--color-border, rgba(100,140,200,0.2))',
          backgroundColor: 'var(--color-surface-elevated, #F0F4F9)',
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 700,
              color: 'var(--color-text, #0F172A)',
            }}
          >
            Submit a grade appeal
          </h3>
          <p
            style={{
              margin: '6px 0 0',
              color: 'var(--color-text-secondary, #475569)',
              fontSize: 14,
            }}
          >
            Submit an appeal for one of your own finalized grades and attach supporting evidence.
          </p>
        </div>
        {showDeadlineNotice && (
          <div
            style={{
              padding: '8px 12px',
              borderRadius: 999,
              border: '1px solid #fde68a',
              backgroundColor: '#fef3c7',
              color: '#92400e',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Deadline / Hạn nộp đơn phúc khảo: {deadlineLabel}
          </div>
        )}
      </div>

      {showDeadlineNotice && deadlinePassed && (
        <div
          style={{
            marginBottom: 20,
            padding: '10px 12px',
            borderRadius: 8,
            border: '1px solid #fcd34d',
            backgroundColor: '#fef3c7',
            color: '#92400e',
            fontSize: 14,
          }}
        >
          {config?.warning || config?.message || `Hạn phúc khảo dự kiến đến ${deadlineLabel}.`}
        </div>
      )}

      <div
        style={{
          marginBottom: 20,
          padding: 16,
          borderRadius: 12,
          border: '1px solid var(--color-border, rgba(100,140,200,0.15))',
          backgroundColor: 'var(--color-surface-elevated, #EBF3FA)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            justifyContent: 'space-between',
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 700,
                color: 'var(--color-text, #0F172A)',
              }}
            >
              What to include in your appeal
            </p>
            <p
              style={{
                margin: '6px 0 0',
                fontSize: 13,
                color: 'var(--color-text-secondary, #475569)',
              }}
            >
              Choose one of your own grades, explain the issue clearly, and attach a supporting
              document when possible.
            </p>
          </div>
          <div
            style={{
              alignSelf: 'flex-start',
              padding: '6px 10px',
              borderRadius: 999,
              backgroundColor: 'var(--color-surface, #fff)',
              color: 'var(--color-text, #1e293b)',
              fontSize: 13,
              fontWeight: 600,
              border: '1px solid var(--color-border, rgba(100,140,200,0.2))',
            }}
          >
            {form.reason.trim().length < 50 ? 'Drafting' : 'Ready to submit'}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {submitError && (
          <div
            role="alert"
            style={{
              border: '1px solid #fecaca',
              backgroundColor: '#fef2f2',
              color: '#991b1b',
              borderRadius: 8,
              padding: '10px 12px',
              fontSize: 14,
            }}
          >
            {submitError}
          </div>
        )}

        {blockingMessage && (
          <div
            role="alert"
            style={{
              border: '1px solid #fcd34d',
              backgroundColor: '#fff7ed',
              color: '#9a2c00',
              borderRadius: 8,
              padding: '10px 12px',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {blockingMessage}
          </div>
        )}

        <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
          <div>
            <label style={labelStyle} htmlFor="gradeId">
              Your grade
            </label>
            <select
              id="gradeId"
              style={{ ...inputStyle, cursor: formDisabled ? 'not-allowed' : 'pointer' }}
              value={form.gradeId}
              onChange={(event) => {
                const nextGradeId = event.target.value;
                const selectedGrade = eligibleGradeOptions.find(
                  (option) => String(option.gradeId) === nextGradeId
                );
                setSubmitError(null);
                setForm((current) => ({
                  ...current,
                  gradeId: nextGradeId,
                  currentGrade: selectedGrade ? selectedGrade.currentGrade : '',
                }));
              }}
              disabled={formDisabled}
            >
              <option value="">Select one of your grades</option>
              {eligibleGradeOptions.map((option) => (
                <option key={option.gradeId} value={option.gradeId}>
                  {option.courseCode} – {option.courseName} ({option.currentGrade})
                </option>
              ))}
            </select>
            <p style={helperTextStyle}>Only grades that belong to your account are shown here.</p>
            {errors.gradeId && (
              <p style={{ marginTop: 8, fontSize: 13, color: '#dc2626' }}>{errors.gradeId}</p>
            )}
          </div>

          <div>
            <label style={labelStyle} htmlFor="currentGrade">
              Current grade
            </label>
            <input
              id="currentGrade"
              type="text"
              style={{
                ...inputStyle,
                cursor: 'not-allowed',
                backgroundColor: 'rgba(100,140,200,0.1)',
              }}
              placeholder="Auto-filled when course is selected"
              value={form.currentGrade}
              readOnly
            />
            {errors.currentGrade && (
              <p style={{ marginTop: 8, fontSize: 13, color: '#dc2626' }}>{errors.currentGrade}</p>
            )}
          </div>

          <div>
            <label style={labelStyle} htmlFor="expectedGrade">
              Expected grade <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              id="expectedGrade"
              type="number"
              min="0.0"
              max="10.0"
              step="0.1"
              style={{ ...inputStyle, cursor: formDisabled ? 'not-allowed' : 'text' }}
              placeholder="e.g. 9.0"
              value={form.expectedGrade}
              onChange={(event) => {
                setSubmitError(null);
                setForm((current) => ({ ...current, expectedGrade: event.target.value }));
              }}
              disabled={formDisabled}
            />
            {errors.expectedGrade && (
              <p style={{ marginTop: 8, fontSize: 13, color: '#dc2626' }}>{errors.expectedGrade}</p>
            )}
          </div>
        </div>

        <div>
          <label style={labelStyle} htmlFor="reason">
            Reason for the appeal
          </label>
          <textarea
            id="reason"
            rows={5}
            style={{ ...inputStyle, minHeight: 132, resize: 'vertical' }}
            placeholder="Example: I believe my final score for Computer Systems should be reviewed because I was marked 7.5 while my coursework and exam performance were higher."
            value={form.reason}
            onChange={(event) => {
              setSubmitError(null);
              setForm((current) => ({ ...current, reason: event.target.value }));
            }}
            disabled={formDisabled}
          />
          <div
            style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: 13 }}
          >
            <span style={{ color: '#64748b' }}>Minimum 50 characters.</span>
            <span
              style={{
                color: form.reason.trim().length < MIN_REASON_LENGTH ? '#64748b' : '#16a34a',
              }}
            >
              {form.reason.trim().length}/{MIN_REASON_LENGTH}+
            </span>
          </div>
          {errors.reason && (
            <p style={{ marginTop: 8, fontSize: 13, color: '#dc2626' }}>{errors.reason}</p>
          )}
        </div>

        <div>
          <label style={labelStyle} htmlFor="supporting-file">
            Supporting document
          </label>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid rgba(100,140,200,0.2)',
              borderRadius: 8,
              padding: '6px 12px',
              backgroundColor: 'rgba(15,23,50,0.3)',
              opacity: formDisabled ? 0.6 : 1,
            }}
          >
            <label
              htmlFor="supporting-file"
              style={{
                display: 'inline-block',
                padding: '6px 12px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 4,
                cursor: formDisabled ? 'not-allowed' : 'pointer',
                marginRight: 12,
                fontSize: 14,
                color: '#E2E8F0',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) => {
                if (!formDisabled) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                }
              }}
              onMouseOut={(e) => {
                if (!formDisabled) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }
              }}
            >
              Choose File
            </label>
            <span style={{ fontSize: 14, color: selectedFile ? '#E2E8F0' : '#94a3b8' }}>
              {selectedFile ? selectedFile.name : 'No file chosen'}
            </span>
            <input
              id="supporting-file"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              style={{ display: 'none' }}
              onChange={(event) => {
                setSubmitError(null);
                setSelectedFile(event.target.files?.[0] ?? null);
              }}
              disabled={formDisabled}
            />
          </div>
          <p style={helperTextStyle}>
            Optional. Accepted formats: PDF, JPG, PNG. Maximum size: 5MB.
          </p>
          {errors.file && (
            <p style={{ marginTop: 8, fontSize: 13, color: '#dc2626' }}>{errors.file}</p>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            borderTop: '1px solid rgba(100,140,200,0.15)',
            paddingTop: 16,
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
            {config?.message || 'Your appeal will be reviewed by the relevant academic team.'}
          </p>
          <button
            type="submit"
            style={{
              border: 'none',
              borderRadius: 8,
              backgroundColor: '#4DA8FF',
              color: '#fff',
              padding: '10px 16px',
              fontSize: 14,
              fontWeight: 700,
              cursor: formDisabled || submitting ? 'not-allowed' : 'pointer',
              opacity: formDisabled || submitting ? 0.7 : 1,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
            disabled={formDisabled || submitting}
          >
            <FaPaperPlane />
            {submitting ? 'Submitting…' : 'Submit New Appeal'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppealForm;
