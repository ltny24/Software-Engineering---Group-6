import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  evaluationService,
  SurveyDto,
  SurveyResponseRequest,
} from '../../services/evaluationService';
import { getMyRegistrations } from '../../services/courseService';
import { CourseRegistration } from '../../types';
import { ROUTES } from '../../utils/constants';
import { FaFileLines, FaLock, FaStar } from 'react-icons/fa6';
import { toast } from 'react-hot-toast';
import './SurveyFormPage.css';

const RATING_LABELS = {
  1: 'Strongly Disagree',
  2: 'Disagree',
  3: 'Neutral',
  4: 'Agree',
  5: 'Strongly Agree',
} as Record<number, string>;

const FACILITIES_QUESTIONS = [
  {
    id: 'f1',
    title: 'WIFI CONNECTION',
    text: 'The quality of the WiFi connection in classrooms and library is satisfactory.',
  },
  { id: 'f2', title: 'RESTROOMS', text: 'Cleanliness and maintenance of restrooms are adequate.' },
  {
    id: 'f3',
    title: 'STUDY AREAS',
    text: 'Availability and comfort of desks/chairs in study areas are sufficient.',
  },
  {
    id: 'f4',
    title: 'LIBRARY',
    text: 'Quality of library resources and quiet study spaces meets my needs.',
  },
  {
    id: 'f5',
    title: 'CAMPUS SAFETY',
    text: 'Overall satisfaction with campus safety and security.',
  },
];

const COURSE_QUESTIONS = [
  {
    id: 'c1',
    title: 'INSTRUCTOR PREPARATION',
    text: 'The instructor was well prepared for classes.',
  },
  { id: 'c2', title: 'CLEAR EXPLANATIONS', text: 'The instructor explained concepts clearly.' },
  {
    id: 'c3',
    title: 'COURSE MATERIALS',
    text: 'Provided materials (slides, readings) supported my learning effectively.',
  },
  { id: 'c4', title: 'WORKLOAD', text: 'The workload was appropriate for the credit hours.' },
  { id: 'c5', title: 'OVERALL SATISFACTION', text: 'Overall, I am satisfied with this course.' },
];

export default function SurveyFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [survey, setSurvey] = useState<SurveyDto | null>(null);
  const [courses, setCourses] = useState<CourseRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});

  const [formData, setFormData] = useState<SurveyResponseRequest>({
    responses: {},
    comments: '',
  });

  const isInitialMount = useRef(true);
  const isDirtyRef = useRef(false);
  const submittingRef = useRef(false);

  const surveyRef = useRef<SurveyDto | null>(null);
  const formDataRef = useRef<SurveyResponseRequest>(formData);

  useEffect(() => {
    surveyRef.current = survey;
  }, [survey]);

  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  useEffect(() => {
    if (!id) return;
    const fetchSurveyAndData = async () => {
      try {
        setLoading(true);
        const data = await evaluationService.getSurveyById(parseInt(id, 10));
        setSurvey(data);

        if (data.title.toLowerCase().includes('course')) {
          const regs = await getMyRegistrations();
          const hk2Courses = regs.filter(
            (r) => r.offering.term === 'HKII 2025-2026' && r.status.toUpperCase() === 'ENROLLED'
          );
          setCourses(hk2Courses);
        }

        if (data.submittedAnswers) {
          try {
            const parsed = JSON.parse(data.submittedAnswers);
            if (parsed.responses) {
              setFormData(parsed);
            } else {
              // Backward compatibility for old format
              const legacyResponses = {
                legacy: {
                  content: parsed.contentRating,
                  delivery: parsed.deliveryRating,
                  materials: parsed.materialsRating,
                  facilities: parsed.facilitiesRating,
                },
              };
              setFormData({ responses: legacyResponses, comments: parsed.comments || '' });
            }
          } catch (e) {
            console.error('Failed to parse saved answers', e);
          }
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load survey');
      } finally {
        setLoading(false);
      }
    };
    fetchSurveyAndData();
  }, [id]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    return () => {
      if (
        isDirtyRef.current &&
        !submittingRef.current &&
        surveyRef.current &&
        surveyRef.current.status !== 'Completed' &&
        surveyRef.current.status !== 'Closed'
      ) {
        const payload = formDataRef.current;
        evaluationService
          .submitSurvey(surveyRef.current.surveyId, payload)
          .catch((err) => console.error('Auto-save failed', err));
        toast.success('Progress automatically saved', { icon: '💾' });
      }
    };
  }, []);

  const handleRatingSelect = (sectionId: string, questionId: string, value: number) => {
    setFormData((prev) => {
      const newResponses = { ...prev.responses };
      if (!newResponses[sectionId]) newResponses[sectionId] = {};
      newResponses[sectionId][questionId] = value;
      return { ...prev, responses: newResponses };
    });
    isDirtyRef.current = true;
    if (validationErrors[`${sectionId}_${questionId}`]) {
      setValidationErrors((prev) => {
        const newErrs = { ...prev };
        delete newErrs[`${sectionId}_${questionId}`];
        return newErrs;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, boolean> = {};
    const isFacilities = survey?.title.toLowerCase().includes('facilities');

    if (isFacilities) {
      FACILITIES_QUESTIONS.forEach((q) => {
        if (!formData.responses['facilities']?.[q.id]) {
          errors[`facilities_${q.id}`] = true;
        }
      });
    } else {
      courses.forEach((c) => {
        const cCode = c.offering.course.courseCode;
        COURSE_QUESTIONS.forEach((q) => {
          if (!formData.responses[cCode]?.[q.id]) {
            errors[`${cCode}_${q.id}`] = true;
          }
        });
      });
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!survey) return;

    if (!validateForm()) {
      toast.error('Please answer all required questions before submitting');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      submittingRef.current = true;
      setSubmitting(true);
      setError(null);
      await evaluationService.submitSurvey(survey.surveyId, formData);
      toast.success('Survey submitted successfully!');
      navigate(ROUTES.EVALUATIONS);
    } catch (err: any) {
      submittingRef.current = false;
      setError(err.response?.data?.message || 'Failed to submit survey');
      toast.error('Failed to submit survey');
    } finally {
      setSubmitting(false);
    }
  };

  const getDaysLeft = (closeDate: string) => {
    const msDiff = new Date(closeDate).getTime() - new Date().getTime();
    const days = Math.ceil(msDiff / (1000 * 3600 * 24));
    return days > 0 ? `${days}d left` : 'Expired';
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear() === new Date().getFullYear() ? '' : d.getFullYear()}`.trim();
  };

  const calculateProgress = () => {
    let answered = 0;
    let total = 0;

    if (survey?.title.toLowerCase().includes('facilities')) {
      total = FACILITIES_QUESTIONS.length;
      FACILITIES_QUESTIONS.forEach((q) => {
        if (formData.responses['facilities']?.[q.id]) answered++;
      });
    } else {
      total = courses.length * COURSE_QUESTIONS.length;
      courses.forEach((c) => {
        COURSE_QUESTIONS.forEach((q) => {
          if (formData.responses[c.offering.course.courseCode]?.[q.id]) answered++;
        });
      });
    }
    const percent = total > 0 ? (answered / total) * 100 : 0;
    return { answered, total, percent };
  };

  const renderQuestion = (sectionId: string, questionId: string, title: string, text: string) => {
    const val = formData.responses[sectionId]?.[questionId] || 0;
    const errorKey = `${sectionId}_${questionId}`;
    const hasError = validationErrors[errorKey];
    const isReadOnly = survey?.status === 'Completed' || survey?.status === 'Closed';

    return (
      <div key={errorKey} className={`question-card ${hasError ? 'error' : ''}`}>
        <div className={`question-title ${hasError ? 'error' : ''}`}>
          {title} <span style={{ color: '#dc2626' }}>*</span>
        </div>
        <div className="question-body">
          <div className="question-text">{text}</div>
          <div className="rating-buttons">
            {[1, 2, 3, 4, 5].map((v) => (
              <button
                key={v}
                type="button"
                className={`rating-btn ${val === v ? 'active' : ''}`}
                onClick={() => handleRatingSelect(sectionId, questionId, v)}
                disabled={isReadOnly}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
        {val > 0 && !hasError && (
          <div className="rating-label">{RATING_LABELS[val as keyof typeof RATING_LABELS]}</div>
        )}
        {hasError && <div className="rating-error-text">Please select a rating.</div>}
      </div>
    );
  };

  if (loading) return <div className="survey-loading">Loading survey...</div>;
  if (!survey) return <div className="survey-error">Survey not found</div>;

  const isMissed = survey.status === 'Closed';
  const progress = calculateProgress();
  const isFacilities = survey.title.toLowerCase().includes('facilities');

  return (
    <div className="survey-page">
      <button className="survey-back-btn" onClick={() => navigate(ROUTES.EVALUATIONS)}>
        &lt; All Surveys
      </button>

      {isMissed && (
        <div className="missed-banner">
          <FaLock />
          <span>
            These surveys were not submitted before their deadline. Not completing evaluations may
            delay your grade release. Contact Academic Affairs if you have extenuating
            circumstances.
          </span>
        </div>
      )}

      <div className="survey-header-card">
        <div className="survey-header-top">
          <div
            className={`card-icon ${isMissed ? 'missed' : survey.status === 'Completed' ? 'completed' : 'pending'}`}
          >
            {isMissed ? <FaLock /> : <FaFileLines />}
          </div>
          <div className="survey-header-info">
            <div className="card-tags">
              <span className="tag course">{isFacilities ? 'GEN' : 'HKII'}</span>
              <span
                className={`tag status ${isMissed ? 'missed' : survey.status === 'Completed' ? 'completed' : 'pending'}`}
              >
                ?{' '}
                {isMissed ? 'Missed' : survey.status === 'Completed' ? 'Completed' : 'In Progress'}
              </span>
            </div>
            <h2>{survey.title.split(' - ')[0]}</h2>
            <p>{isFacilities ? 'University Administration' : 'Course Evaluations'}</p>
          </div>
          <div className="card-deadline">
            <span className="deadline-label">{isMissed ? 'Expired' : 'Deadline'}</span>
            <span className={`deadline-date ${isMissed ? 'missed' : ''}`}>
              {isMissed
                ? formatDate(survey.closeDate)
                : `${new Date(survey.closeDate).getDate()} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][new Date(survey.closeDate).getMonth()]} 2026`}
            </span>
            {!isMissed && <span className="deadline-left">{getDaysLeft(survey.closeDate)}</span>}
          </div>
        </div>
        <div className="survey-progress">
          <div className="progress-text">
            <span>Completion progress</span>
            <span className="progress-stats">
              {progress.answered}/{progress.total} ratings ? {progress.percent.toFixed(0)}%
            </span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progress.percent}%` }}></div>
          </div>
        </div>
      </div>

      <div className="rating-scale-card">
        <FaStar color="#1d4ed8" />
        <span className="scale-title">Rating Scale</span>
        <span className="scale-desc">1 = Strongly Disagree A 5 = Strongly Agree</span>
      </div>

      <form onSubmit={handleSubmit} className="survey-form">
        {isFacilities ? (
          <div className="survey-section" style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', color: '#1e293b' }}>Facilities Evaluation</h3>
            {FACILITIES_QUESTIONS.map((q) => renderQuestion('facilities', q.id, q.title, q.text))}
          </div>
        ) : (
          courses.map((c) => (
            <div
              key={c.offering.course.courseCode}
              className="survey-section"
              style={{ marginBottom: '2.5rem' }}
            >
              <h3
                style={{
                  marginBottom: '1rem',
                  color: '#1e293b',
                  borderBottom: '2px solid #e2e8f0',
                  paddingBottom: '0.5rem',
                }}
              >
                {c.offering.course.courseCode} - {c.offering.course.courseName}
              </h3>
              {COURSE_QUESTIONS.map((q) =>
                renderQuestion(c.offering.course.courseCode, q.id, q.title, q.text)
              )}
            </div>
          ))
        )}

        <div
          className="question-card"
          style={{
            padding: '1.5rem',
            marginBottom: '1rem',
            background: 'white',
            borderRadius: '12px',
            border: 'none',
            boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
          }}
        >
          <div className="question-title">ADDITIONAL COMMENTS</div>
          <textarea
            className="textarea-field"
            placeholder="Provide any specific feedback or suggestions here..."
            value={formData.comments}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, comments: e.target.value }));
              isDirtyRef.current = true;
            }}
            disabled={survey.status === 'Completed' || isMissed}
          />
        </div>

        {error && (
          <div className="survey-error" style={{ marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        {survey.status !== 'Completed' && !isMissed && (
          <div className="survey-form__actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate(ROUTES.EVALUATIONS)}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
