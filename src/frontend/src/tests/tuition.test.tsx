import { render, screen, waitFor } from '@testing-library/react';
import toast from 'react-hot-toast';
import TuitionPage from '../pages/tuition/TuitionPage';
import api from '../services/api';

jest.mock('../services/api');
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: { success: jest.fn(), error: jest.fn() },
}));

const mockedApi = api as jest.Mocked<typeof api>;
const mockedToast = toast as jest.Mocked<typeof toast>;

const TUITION_BALANCE = {
  studentId: 12345,
  term: 'Fall2026',
  totalCharges: 10000000,
  payments: 4000000,
  scholarshipAmount: 1000000,
  balance: 5000000,
  financialHold: false,
  paymentHistory: [
    {
      paymentId: 1,
      amount: 4000000,
      paymentDate: '2026-01-15T00:00:00.000Z',
      paymentMethod: 'BANK_TRANSFER',
      referenceNumber: 'TXN-001',
      status: 'SUCCESS',
    },
  ],
};

describe('Tuition flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads and displays the tuition balance summary and payment history', async () => {
    mockedApi.get.mockResolvedValue(TUITION_BALANCE);

    render(<TuitionPage />);

    expect(screen.getByText(/loading financial information/i)).toBeInTheDocument();

    await waitFor(() => expect(mockedApi.get).toHaveBeenCalledWith('/api/v1/finance/tuition/balance'));

    expect(await screen.findByText('Fall2026')).toBeInTheDocument();
    expect(screen.getByText(/account in good standing/i)).toBeInTheDocument();
    expect(screen.getByText('TXN-001')).toBeInTheDocument();
    expect(screen.getByText(/bank transfer/i)).toBeInTheDocument();
  });

  it('flags a financial hold when the account is blocked', async () => {
    mockedApi.get.mockResolvedValue({ ...TUITION_BALANCE, financialHold: true });

    render(<TuitionPage />);

    expect(await screen.findByText(/financial hold/i)).toBeInTheDocument();
  });

  it('shows an empty state when there is no payment history yet', async () => {
    mockedApi.get.mockResolvedValue({ ...TUITION_BALANCE, paymentHistory: [] });

    render(<TuitionPage />);

    expect(await screen.findByText(/no payment transactions recorded from the server/i)).toBeInTheDocument();
  });

  it('shows a not-found message and toast when the balance fails to load', async () => {
    mockedApi.get.mockRejectedValue(new Error('network error'));

    render(<TuitionPage />);

    await waitFor(() =>
      expect(mockedToast.error).toHaveBeenCalledWith('Unable to load financial data from the server.')
    );
    expect(await screen.findByText(/no balance data found/i)).toBeInTheDocument();
  });
});
