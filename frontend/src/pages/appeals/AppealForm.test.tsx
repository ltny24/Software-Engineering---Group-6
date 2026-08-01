import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import AppealForm from './AppealForm';
import api from '../../services/api';
import { getStoredUser } from '../../utils/tokenUtils';

jest.mock('../../services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

jest.mock('../../utils/tokenUtils', () => ({
  getStoredUser: jest.fn(),
}));

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe('AppealForm deadline notice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getStoredUser as jest.Mock).mockReturnValue({ id: '1', username: 'student1' });
  });

  it('hides the deadline notice when the config request fails', async () => {
    (api.get as jest.Mock)
      .mockRejectedValueOnce(new Error('network error'))
      .mockResolvedValueOnce({ data: [] });

    render(<AppealForm />);

    await waitFor(() => expect(api.get).toHaveBeenCalledWith('/appeals/config'));

    expect(screen.queryByText(/loading deadline rules/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/submission is open for current appeals/i)).not.toBeInTheDocument();
  });

  it('shows a fallback deadline notice when the config has no deadline value', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: {
        allowSubmission: true,
      },
    });
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: [],
    });

    render(<AppealForm />);

    expect(await screen.findByText(/hạn nộp đơn phúc khảo/i)).toBeInTheDocument();
    expect(screen.getByText(/hạn nộp đơn phúc khảo:/i)).toBeInTheDocument();
  });

  it('disables the form when no eligible grade is available', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: {
        submissionDeadline: '2099-01-01T00:00:00Z',
        allowSubmission: true,
      },
    });
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: [],
    });

    render(<AppealForm />);

    expect(
      await screen.findByText('Không có môn học nào đủ điều kiện phúc khảo')
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/your grade/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /submit new appeal/i })).toBeDisabled();
  });

  it('syncs the current grade field when the selected grade changes', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: {
        submissionDeadline: '2099-01-01T00:00:00Z',
        allowSubmission: true,
      },
    });
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: [
        {
          gradeId: 1,
          courseCode: 'CSC10009',
          courseName: 'Computer Systems',
          currentGrade: '7.5',
          term: '2024-2025-HK2',
          isFinalized: true,
          isEligibleForAppeal: true,
        },
        {
          gradeId: 2,
          courseCode: 'CSC10004',
          courseName: 'Data Structures',
          currentGrade: '8.0',
          term: '2024-2025-HK2',
          isFinalized: true,
          isEligibleForAppeal: true,
        },
      ],
    });

    render(<AppealForm />);

    await screen.findByText(/Data Structures/i);
    const gradeSelect = await screen.findByLabelText(/your grade/i);
    fireEvent.change(gradeSelect, { target: { value: '2' } });
    expect(screen.getByLabelText(/current grade/i)).toHaveValue('8.0');

    fireEvent.change(gradeSelect, { target: { value: '' } });
    expect(screen.getByLabelText(/current grade/i)).toHaveValue('');
  });
});
