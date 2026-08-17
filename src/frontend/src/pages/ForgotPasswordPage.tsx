import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPaperPlane, FaKey, FaCircleCheck } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import { forgotPassword, resetPassword } from '../auth';
import { ROUTES } from '../utils/constants';
import './ForgotPasswordPage.css';

type Step = 'username' | 'reset' | 'success';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  // Step tracking
  const [step, setStep] = useState<Step>('username');

  // Form state
  const [username, setUsername] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [demoCode, setDemoCode] = useState(''); // The code returned from API for demo
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Request verification code
  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error('Please enter your student ID.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await forgotPassword(username.trim());
      setMaskedEmail(response.maskedEmail);
      setDemoCode(response.verificationCode);
      setStep('reset');
      toast.success('Verification code sent! Check the demo code below.');
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        'Failed to send verification code. Please try again.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Reset password with verification code
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!verificationCode.trim()) {
      toast.error('Please enter the verification code.');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(username.trim(), verificationCode.trim(), newPassword);
      setStep('success');
      toast.success('Password reset successful!');
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        'Failed to reset password. The code may be invalid or expired.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        {/* Header */}
        <div className="forgot-card__header">
          <img src="/hcmus-logo.png" alt="HCMUS Logo" className="forgot-card__logo" />
          <h1 className="forgot-card__title">Reset Your Password</h1>
          <p className="forgot-card__subtitle">
            {step === 'username' &&
              "Enter your student ID and we'll send a verification code to your registered email."}
            {step === 'reset' &&
              `A verification code has been sent to ${maskedEmail}. Enter the code and your new password.`}
            {step === 'success' && 'Your password has been reset successfully.'}
          </p>
        </div>

        {/* Step 1: Enter username */}
        {step === 'username' && (
          <form className="forgot-card__form" onSubmit={handleRequestCode} noValidate>
            <div className="form-group">
              <label htmlFor="forgot-username" className="form-label">
                Student ID (Username)
              </label>
              <input
                id="forgot-username"
                type="text"
                className="form-input"
                placeholder="e.g., 24127192"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className="btn btn--primary btn--full"
              disabled={isLoading || !username.trim()}
            >
              <FaPaperPlane /> {isLoading ? 'Sending Code...' : 'Send Reset Code'}
            </button>

            <Link to={ROUTES.LOGIN} className="forgot-card__back-link">
              <FaArrowLeft /> Back to Login
            </Link>
          </form>
        )}

        {/* Step 2: Enter verification code + new password */}
        {step === 'reset' && (
          <form className="forgot-card__form" onSubmit={handleResetPassword} noValidate>
            {/* Demo code display */}
            {demoCode && (
              <div className="forgot-card__demo-code">
                <strong>Demo Mode:</strong> Your verification code is{' '}
                <span className="forgot-card__code-value">{demoCode}</span>
                <br />
                <small>In production, this would be sent to {maskedEmail}</small>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="forgot-code" className="form-label">
                Verification Code
              </label>
              <input
                id="forgot-code"
                type="text"
                className="form-input forgot-card__code-input"
                placeholder="000000"
                maxLength={6}
                autoComplete="one-time-code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="forgot-new-password" className="form-label">
                New Password
              </label>
              <input
                id="forgot-new-password"
                type="password"
                className="form-input"
                placeholder="At least 6 characters"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="forgot-confirm-password" className="form-label">
                Confirm New Password
              </label>
              <input
                id="forgot-confirm-password"
                type="password"
                className="form-input"
                placeholder="Re-enter your new password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className="btn btn--primary btn--full"
              disabled={
                isLoading ||
                !verificationCode.trim() ||
                newPassword.length < 6 ||
                newPassword !== confirmPassword
              }
            >
              <FaKey /> {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>

            <button
              type="button"
              className="forgot-card__resend-btn"
              onClick={handleRequestCode}
              disabled={isLoading}
            >
              Didn&apos;t receive the code? <span>Send again</span>
            </button>

            <Link to={ROUTES.LOGIN} className="forgot-card__back-link">
              <FaArrowLeft /> Back to Login
            </Link>
          </form>
        )}

        {/* Step 3: Success */}
        {step === 'success' && (
          <div className="forgot-card__success">
            <FaCircleCheck className="forgot-card__success-icon" />
            <p>You can now sign in with your new password.</p>
            <button className="btn btn--primary btn--full" onClick={handleBackToLogin}>
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
