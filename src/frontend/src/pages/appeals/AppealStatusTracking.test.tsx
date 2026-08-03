import { render, screen } from '@testing-library/react';
import React from 'react';
import AppealStatusTracking from './AppealStatusTracking';
import api from '../../services/api';

jest.mock('../../services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockResolvedValue([]),
    put: jest.fn().mockResolvedValue({}),
  },
}));

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe('AppealStatusTracking', () => {
  it('shows the withdrawn submission message without a deadline column', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: [
        {
          appealId: 1,
          courseCode: 'CSC10001',
          courseName: 'Algorithms',
          gradeValue: '8.5',
          status: 'Withdrawn',
          appealReason: 'I want to review my grade.',
          submittedAt: '2026-07-01T10:00:00Z',
        },
        {
          appealId: 2,
          courseCode: 'CSC10002',
          courseName: 'Databases',
          gradeValue: '7.0',
          status: 'Submitted',
          appealReason: 'I want to review my grade.',
          submittedAt: '2026-07-02T10:00:00Z',
        },
      ],
    });

    render(<AppealStatusTracking />);

    expect(await screen.findByText(/you have canceled your submission/i)).toBeInTheDocument();
    expect(screen.queryByRole('columnheader', { name: /deadline/i })).not.toBeInTheDocument();
  });
});
