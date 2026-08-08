import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { evaluationService, SurveyDto } from '../../services/evaluationService';
import { ROUTES } from '../../utils/constants';
import { FaFileLines, FaLock } from 'react-icons/fa6';
import './EvaluationsPage.css';

export default function EvaluationsPage() {
  const [surveys, setSurveys] = useState<SurveyDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const data = await evaluationService.getSurveys();
      setSurveys(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load surveys');
    } finally {
      setLoading(false);
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

  const pendingSurveys = surveys.filter((s) => s.status === 'Pending' || s.status === 'Draft');
  const completedSurveys = surveys.filter((s) => s.status === 'Completed');
  const missedSurveys = surveys.filter((s) => s.status === 'Closed');

  const getCourseTag = (title: string) => {
    if (title.includes('Software Engineering')) return 'CS201';
    if (title.includes('Data Structures')) return 'CS215';
    if (title.includes('Mathematics')) return 'CS110';
    if (title.includes('Calculus')) return 'MATH101';
    if (title.includes('Facilities')) return 'GEN';
    return 'GEN';
  };

  const getLecturer = (title: string) => {
    if (title.includes('Software Engineering')) return 'Dr. Aisha Malik';
    if (title.includes('Data Structures')) return 'Prof. James Okonkwo';
    if (title.includes('Mathematics')) return 'Prof. Elena Vasquez';
    if (title.includes('Calculus')) return 'Dr. Samuel Osei';
    return 'University Administration';
  };

  const renderSurveyCard = (survey: SurveyDto, isMissed: boolean) => (
    <div
      key={survey.surveyId}
      className={`eval-card ${isMissed ? 'missed' : ''}`}
      onClick={() =>
        !isMissed && navigate(ROUTES.EVALUATIONS_DETAIL.replace(':id', survey.surveyId.toString()))
      }
    >
      <div
        className={`card-icon ${isMissed ? 'missed' : survey.status === 'Completed' ? 'completed' : 'pending'}`}
      >
        {isMissed ? <FaLock /> : <FaFileLines />}
      </div>
      <div className="card-content">
        <div className="card-tags">
          <span className="tag course">{getCourseTag(survey.title)}</span>
          <span
            className={`tag status ${isMissed ? 'missed' : survey.status === 'Completed' ? 'completed' : 'pending'}`}
          >
            • {isMissed ? 'Missed' : survey.status === 'Completed' ? 'Completed' : 'In Progress'}
          </span>
        </div>
        <h3 className="card-title">{survey.title.split(' - ')[0]}</h3>
        <p className="card-subtitle">{getLecturer(survey.title)}</p>
      </div>
      <div className="card-deadline">
        <span className="deadline-label">{isMissed ? 'Expired' : 'Deadline'}</span>
        <span className={`deadline-date ${isMissed ? 'missed' : ''}`}>
          {formatDate(survey.closeDate)}
        </span>
        {!isMissed && <span className="deadline-left">{getDaysLeft(survey.closeDate)}</span>}
      </div>
    </div>
  );

  if (loading) return <div className="eval-loading">Loading surveys...</div>;
  if (error) return <div className="eval-error">{error}</div>;

  return (
    <div className="evaluations-page">
      <header className="evaluations-header">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <h1 style={{ marginBottom: 0 }}>Evaluation Surveys</h1>
        </div>
        <p>
          Semester 2, 2025/2026 · Evaluation window closes <strong>30 August 2026</strong>
        </p>
      </header>

      <div className="eval-stats">
        <div className="stat-card pending">
          <div className="stat-num">{pendingSurveys.length}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card completed">
          <div className="stat-num">{completedSurveys.length}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card missed">
          <div className="stat-num">{missedSurveys.length}</div>
          <div className="stat-label">Missed</div>
        </div>
        <div className="stat-card total">
          <div className="stat-num">{surveys.length}</div>
          <div className="stat-label">Total</div>
        </div>
      </div>

      {pendingSurveys.length > 0 && (
        <div className="eval-group">
          <div className="group-header">
            IN PROGRESS <span className="badge">{pendingSurveys.length}</span>
          </div>
          <div className="group-list">{pendingSurveys.map((s) => renderSurveyCard(s, false))}</div>
        </div>
      )}

      {missedSurveys.length > 0 && (
        <div className="eval-group">
          <div className="group-header missed-header">
            MISSED <span className="badge">{missedSurveys.length}</span>{' '}
            <span
              style={{
                textTransform: 'none',
                color: '#94a3b8',
                fontWeight: 400,
                marginLeft: '10px',
                letterSpacing: 'normal',
              }}
            >
              — submission window closed
            </span>
          </div>
          <div className="missed-banner">
            <FaLock />
            <span>
              These surveys were not submitted before their deadline. Not completing evaluations may
              delay your grade release. Contact Academic Affairs if you have extenuating
              circumstances.
            </span>
          </div>
          <div className="group-list">{missedSurveys.map((s) => renderSurveyCard(s, true))}</div>
        </div>
      )}

      {completedSurveys.length > 0 && (
        <div className="eval-group">
          <div className="group-header">
            COMPLETED <span className="badge">{completedSurveys.length}</span>
          </div>
          <div className="group-list">
            {completedSurveys.map((s) => renderSurveyCard(s, false))}
          </div>
        </div>
      )}
    </div>
  );
}
