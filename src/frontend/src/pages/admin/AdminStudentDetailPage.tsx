import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getStudentDetailsAdmin, StudentProfileData } from '../../services/studentAdminApi';
import { ROUTES } from '../../utils/constants';
import './AdminStudents.css';

export default function AdminStudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<StudentProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadStudent(parseInt(id));
    }
  }, [id]);

  const loadStudent = async (studentId: number) => {
    try {
      setLoading(true);
      const data = await getStudentDetailsAdmin(studentId);
      setStudent(data);
    } catch (err: any) {
      if (err.response?.status === 403) {
        toast.error('Permission denied to view this record.');
      } else {
        toast.error('Failed to load student record.');
      }
      navigate(`${ROUTES.ADMIN}/students`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-student-detail-page">
        <div className="loading-spinner">
          <span className="spinner spinner--lg" />
        </div>
      </div>
    );
  }

  if (!student) return null;

  const isRestricted = student.enrollmentStatus !== 'ACTIVE';

  return (
    <div className="admin-student-detail-page">
      <button className="back-button" onClick={() => navigate(`${ROUTES.ADMIN}/students`)}>
        ← Back to Search
      </button>

      <div className="student-profile-card">
        <div className="profile-header">
          <div>
            <h1 className="profile-name">
              {student.firstName} {student.middleName ? `${student.middleName} ` : ''}
              {student.lastName}
            </h1>
            <div className="profile-id">ID: {student.username}</div>
          </div>
          <span
            className={`status-badge ${student.enrollmentStatus === 'Enrolled' ? 'active' : 'inactive'}`}
          >
            {student.enrollmentStatus || 'UNKNOWN'}
          </span>
        </div>

        {isRestricted && (
          <div className="restricted-warning">
            <strong>Restricted Record:</strong> This student is currently marked as{' '}
            {student.enrollmentStatus}. Certain data fields may be hidden or archived.
          </div>
        )}

        <div className="profile-grid">
          <div className="profile-field">
            <label>Email</label>
            <span>{student.email}</span>
          </div>
          <div className="profile-field">
            <label>Phone</label>
            <span>{student.phone || 'N/A'}</span>
          </div>
          <div className="profile-field">
            <label>Date of Birth</label>
            <span>{student.dateOfBirth || 'N/A'}</span>
          </div>
          <div className="profile-field">
            <label>Address</label>
            <span>{student.address || 'N/A'}</span>
          </div>
          <div className="profile-field">
            <label>Program / Major</label>
            <span>{student.major || 'N/A'}</span>
          </div>
          <div className="profile-field">
            <label>Student Type</label>
            <span>{student.studentType || 'N/A'}</span>
          </div>
          <div className="profile-field">
            <label>Registration Status</label>
            <span>{student.registrationStatus || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
