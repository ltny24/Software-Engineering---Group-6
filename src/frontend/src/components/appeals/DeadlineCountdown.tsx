import React, { useEffect, useState } from 'react';

interface DeadlineCountdownProps {
  deadlineStr?: string | null;
}

export const DeadlineCountdown: React.FC<DeadlineCountdownProps> = ({ deadlineStr }) => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    isOverdue: boolean;
    isUrgent: boolean;
  }>({ hours: 0, minutes: 0, seconds: 0, isOverdue: false, isUrgent: false });

  useEffect(() => {
    if (!deadlineStr) return;

    const calculate = () => {
      const target = new Date(deadlineStr).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isOverdue: true, isUrgent: false });
        return;
      }

      const totalHours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        hours: totalHours,
        minutes,
        seconds,
        isOverdue: false,
        isUrgent: totalHours < 24,
      });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [deadlineStr]);

  if (!deadlineStr) return <span style={{ color: '#94a3b8' }}>—</span>;
  if (timeLeft.isOverdue)
    return <span style={{ color: '#ef4444', fontWeight: '600' }}>Expired</span>;

  return (
    <span
      style={{
        fontWeight: '600',
        color: timeLeft.isUrgent ? '#dc2626' : '#2563eb',
        backgroundColor: timeLeft.isUrgent ? '#fef2f2' : '#eff6ff',
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        border: `1px solid ${timeLeft.isUrgent ? '#fca5a5' : '#bfdbfe'}`,
      }}
    >
      {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
    </span>
  );
};

export default DeadlineCountdown;
