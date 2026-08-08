import { render, screen } from '@testing-library/react';
jest.mock('react-icons/fa6', () => new Proxy({}, { get: () => () => null }), { virtual: true });
import React from 'react';
import api from '../../services/api';
import AppealsPage from './AppealsPage';

jest.mock('../../services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

jest.mock('./AppealForm', () => () => <div>Appeal form</div>);
jest.mock('./AppealStatusTracking', () => () => <div>Appeal status tracking</div>);

describe('AppealsPage', () => {
  it('shows the submission deadline in the submission window', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: {
        allowSubmission: true,
        submissionDeadline: '2099-01-01T00:00:00Z',
      },
    });

    render(<AppealsPage />);

    expect(await screen.findByText(/deadline:/i)).toBeInTheDocument();
    expect(screen.getByText('Open')).toBeInTheDocument();
  });
});
