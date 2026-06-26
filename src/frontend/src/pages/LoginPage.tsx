import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { login, useAuth } from '../auth';
import { ROUTES } from '../utils/constants';
import './LoginPage.css';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? ROUTES.DASHBOARD;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const response = await login(data);
      setUser(response.user);
      toast.success(`Welcome back, ${response.user.displayName}!`);
      navigate(from, { replace: true });
    } catch {
      toast.error('Invalid username or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__header">
          <span className="login-card__logo">🎓</span>
          <h1 className="login-card__title">MyUS University Portal</h1>
          <p className="login-card__subtitle">Sign in to access your academic workspace</p>
        </div>

        <form
          id="login-form"
          className="login-card__form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="form-group">
            <label htmlFor="login-username" className="form-label">Username</label>
            <input
              id="login-username"
              type="text"
              className={`form-input${errors.username ? ' form-input--error' : ''}`}
              placeholder="Enter your university username"
              autoComplete="username"
              {...register('username')}
            />
            {errors.username && (
              <span className="form-error">{errors.username.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="login-password" className="form-label">Password</label>
            <input
              id="login-password"
              type="password"
              className={`form-input${errors.password ? ' form-input--error' : ''}`}
              placeholder="Enter your password"
              autoComplete="current-password"
              {...register('password')}
            />
            {errors.password && (
              <span className="form-error">{errors.password.message}</span>
            )}
          </div>

          <button
            id="btn-login-submit"
            type="submit"
            className="btn btn--primary btn--full"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="login-card__help">
          Having trouble? Contact your academic office or IT support.
        </p>
      </div>
    </div>
  );
}
