import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import './ProfilePage.css'; // Lát nữa mình tạo thêm file CSS này nha

// Định nghĩa kiểu dữ liệu khớp 100% với StudentProfileResponse của Backend
interface StudentProfile {
  id: number;
  username: string;
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  studentType: string;
  major: string;
  enrollmentStatus: string;
  registrationStatus: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // State quản lý chế độ Edit
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editPhone, setEditPhone] = useState<string>('');
  const [editAddress, setEditAddress] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Gọi API lấy dữ liệu ngay khi trang vừa render
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      // Gọi GET /api/v1/profile (đã có interceptor lo phần base URL và Token)
      const data = await api.get<StudentProfile>('/v1/profile');
      setProfile(data);
      // Khởi tạo giá trị cho form edit
      setEditPhone(data.phone || '');
      setEditAddress(data.address || '');
    } catch (error) {
      toast.error('Failed to load profile data.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // Gọi PUT /api/v1/profile với 2 trường được phép sửa
      await api.put('/v1/profile', {
        phone: editPhone,
        address: editAddress,
      });
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      // Refresh lại data sau khi lưu
      fetchProfile();
    } catch (error) {
      toast.error('Failed to update profile.');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <span className="spinner" /> Loading profile...
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2> Student Profile</h2>
        {!isEditing ? (
          <button className="btn-edit" onClick={() => setIsEditing(true)}>
            Edit Contact Info
          </button>
        ) : (
          <div className="edit-actions">
            <button className="btn-cancel" onClick={() => setIsEditing(false)} disabled={isSaving}>
              Cancel
            </button>
            <button className="btn-save" onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      <div className="profile-card">
        {/* Khối thông tin Học thuật (Chỉ xem) */}
        <div className="profile-section">
          <h3>Academic Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Student ID (Username)</label>
              <p>{profile.username}</p>
            </div>
            <div className="info-item">
              <label>Major</label>
              <p>{profile.major}</p>
            </div>
            <div className="info-item">
              <label>Student Type</label>
              <p>{profile.studentType}</p>
            </div>
            <div className="info-item">
              <label>Enrollment Status</label>
              <p>
                <span className={`badge ${profile.enrollmentStatus?.toLowerCase()}`}>
                  {profile.enrollmentStatus}
                </span>
              </p>
            </div>
          </div>
        </div>

        <hr className="divider" />

        {/* Khối thông tin Cá nhân */}
        <div className="profile-section">
          <h3>Personal Details</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Full Name</label>
              <p>{`${profile.firstName} ${profile.middleName ? profile.middleName + ' ' : ''}${profile.lastName}`}</p>
            </div>
            <div className="info-item">
              <label>Date of Birth</label>
              <p>{profile.dateOfBirth}</p>
            </div>
            <div className="info-item">
              <label>Email (University)</label>
              <p>{profile.email}</p>
            </div>
          </div>
        </div>

        <hr className="divider" />

        {/* Khối thông tin Liên lạc (Có thể sửa) */}
        <div className="profile-section">
          <h3>Contact Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Phone Number</label>
              {!isEditing ? (
                <p>{profile.phone || 'Not provided'}</p>
              ) : (
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="edit-input"
                  placeholder="Enter phone number"
                />
              )}
            </div>
            <div className="info-item full-width">
              <label>Home Address</label>
              {!isEditing ? (
                <p>{profile.address || 'Not provided'}</p>
              ) : (
                <textarea
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="edit-input"
                  rows={3}
                  placeholder="Enter home address"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
