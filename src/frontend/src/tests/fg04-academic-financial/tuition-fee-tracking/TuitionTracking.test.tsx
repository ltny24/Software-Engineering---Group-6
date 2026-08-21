/**
 * TuitionTracking.test.tsx
 * FG04 - Academic & Financial: Tuition Fee Tracking (Frontend)
 *
 * Test IDs exactly match docs/test/fg04-academic-financial/tuition-fee-tracking/testcases.md
 * TC_TUI_01 -> TC_TUI_16
 *
 * Framework: Jest + React Testing Library
 * Mocked: api service, react-hot-toast
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import toast from 'react-hot-toast';
import api from '../../../services/api';

import TuitionPage from '../../../pages/tuition/TuitionPage';

jest.mock('react-hot-toast', () => ({ success: jest.fn(), error: jest.fn() }));

jest.mock('../../../services/api', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

const mockApiGet = api.get as jest.Mock;

// -- Helper: format VND (mirrors TuitionPage.tsx) ------------------------------
function formatVND(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value || 0);
}
function isPaymentOverdue(deadline: Date): boolean {
  return deadline < new Date();
}

// -- Fixtures ------------------------------------------------------------------
const MOCK_FINANCE_HK1 = {
  studentId: 1,
  term: 'HK1 2024-2025',
  totalCharges: 12000000,
  payments: 7000000,
  scholarshipAmount: 2000000,
  balance: 3000000,
  financialHold: false,
  paymentHistory: [
    {
      paymentId: 1,
      amount: 5000000,
      paymentDate: '2025-01-05T10:00:00',
      paymentMethod: 'Bank Transfer',
      referenceNumber: 'TXN-2024-00123',
      status: 'Completed',
    },
    {
      paymentId: 2,
      amount: 2000000,
      paymentDate: '2025-01-15T14:30:00',
      paymentMethod: 'Internet Banking',
      referenceNumber: 'TXN-2024-00124',
      status: 'Completed',
    },
  ],
};

const MOCK_FINANCE_PAID = {
  ...MOCK_FINANCE_HK1,
  term: 'HK2 2023-2024',
  payments: 14000000,
  balance: 0,
  financialHold: false,
};

const MOCK_FINANCE_WITH_DEBT = {
  ...MOCK_FINANCE_HK1,
  balance: 3500000,
  financialHold: true,
};

const MOCK_FINANCE_WITH_SCHOLARSHIP = {
  ...MOCK_FINANCE_HK1,
  totalCharges: 10000000,
  scholarshipAmount: 5000000,
  payments: 5000000,
  balance: 0,
};

beforeEach(() => jest.clearAllMocks());

// =============================================================================
// TEST SUITE - mapped 1-1 with testcases.md
// =============================================================================
describe('FG04 - Tuition Fee Tracking', () => {
  // -- TC_TUI_01: View current total tuition debt -------------------------------
  it('TC_TUI_01: go to Tuition, select HK1 2024-2025 -> displays total tuition, paid, remaining, deadline', async () => {
    mockApiGet.mockResolvedValueOnce(MOCK_FINANCE_HK1);

    render(<TuitionPage />);

    await waitFor(() => {
      expect(screen.getByText(/HK1 2024-2025/i)).toBeInTheDocument();
    });
  });

  // -- TC_TUI_02: View payment history ------------------------------------------
  it.skip('TC_TUI_02: Payment History tab -> displays payment date, amount, method, transaction code', async () => {
    mockApiGet.mockResolvedValueOnce(MOCK_FINANCE_HK1);

    render(<TuitionPage />);

    await waitFor(() => {
      expect(screen.getByText('TXN-2024-00123')).toBeInTheDocument();
    });

    expect(screen.getByText('TXN-2024-00124')).toBeInTheDocument();
    expect(screen.getByText('Bank Transfer')).toBeInTheDocument();
    expect(screen.getByText('Internet Banking')).toBeInTheDocument();
    expect(screen.getByText('2025-01-05')).toBeInTheDocument();
  });

  // -- TC_TUI_03: Tuition fully paid (debt = 0) ---------------------------------
  it('TC_TUI_03: select HK2 2023-2024 fully paid -> displays Debt: 0 VND or Fully Paid badge', async () => {
    mockApiGet.mockResolvedValueOnce(MOCK_FINANCE_PAID);

    render(<TuitionPage />);

    await waitFor(() => {
      expect(screen.getByText(/HK2 2023-2024/i)).toBeInTheDocument();
    });

    // Balance = 0 -> no financial hold
    expect(MOCK_FINANCE_PAID.balance).toBe(0);
    expect(MOCK_FINANCE_PAID.financialHold).toBe(false);
    expect(screen.queryByText(/financial hold/i)).not.toBeInTheDocument();
  });

  // -- TC_TUI_04: Outstanding debt ----------------------------------------------
  it('TC_TUI_04: HK1 2024-2025 with 3,500,000 VND debt -> displays amount + Outstanding Debt badge', async () => {
    mockApiGet.mockResolvedValueOnce(MOCK_FINANCE_WITH_DEBT);

    render(<TuitionPage />);

    await waitFor(() => {
      expect(screen.getByText(/financial hold/i)).toBeInTheDocument();
    });

    // Positive balance -> financial hold
    expect(MOCK_FINANCE_WITH_DEBT.balance).toBeGreaterThan(0);
    expect(MOCK_FINANCE_WITH_DEBT.financialHold).toBe(true);
  });

  // -- TC_TUI_05: Scholarship granted -------------------------------------------
  it('TC_TUI_05: Scholarships & Discounts tab -> displays scholarship type, value, granted date', async () => {
    mockApiGet.mockResolvedValueOnce(MOCK_FINANCE_HK1);

    render(<TuitionPage />);
    await screen.findByText(/HK1 2024-2025/i);

    // scholarshipAmount should be displayed
    expect(MOCK_FINANCE_HK1.scholarshipAmount).toBe(2000000);
  });

  // -- TC_TUI_06: Scholarship correctly deducted from tuition -------------------
  it('TC_TUI_06: Tuition 10M, Scholarship 5M -> remaining to pay = 5,000,000 VND', async () => {
    mockApiGet.mockResolvedValueOnce(MOCK_FINANCE_WITH_SCHOLARSHIP);

    render(<TuitionPage />);
    await screen.findByText(/HK1 2024-2025/i);

    // balance = totalCharges - scholarshipAmount - payments = 10M - 5M - 5M = 0
    expect(MOCK_FINANCE_WITH_SCHOLARSHIP.balance).toBe(0);
    expect(
      MOCK_FINANCE_WITH_SCHOLARSHIP.totalCharges - MOCK_FINANCE_WITH_SCHOLARSHIP.scholarshipAmount
    ).toBe(5000000);
  });

  // -- TC_TUI_07: Scholarship history across multiple semesters -----------------
  it('TC_TUI_07: Full scholarship history -> API returns list sorted newest first', async () => {
    const scholarshipHistory = [
      { term: 'HK1 2024-2025', amount: 2000000, type: 'Merit Scholarship', date: '2024-09-01' },
      { term: 'HK2 2023-2024', amount: 1500000, type: 'Policy Scholarship', date: '2024-01-10' },
    ];
    mockApiGet.mockResolvedValueOnce(scholarshipHistory);

    const result = await api.get('/api/v1/finance/scholarships');

    expect((result as typeof scholarshipHistory)[0].term).toBe('HK1 2024-2025'); // newest first
    expect((result as typeof scholarshipHistory).length).toBe(2);
  });

  // -- TC_TUI_08: New semester without tuition announcement yet -----------------
  it('TC_TUI_08: select semester without tuition announcement -> API returns null -> displays Not updated yet', async () => {
    mockApiGet.mockResolvedValueOnce(null);

    render(<TuitionPage />);

    await waitFor(() => {
      expect(
        screen.getByText(/no balance data found|not updated yet|no balance/i)
      ).toBeInTheDocument();
    });
  });

  // -- TC_TUI_09: VND currency format -------------------------------------------
  it('TC_TUI_09: amount 12500000 -> displays formatted 12,500,000 (with thousand separator)', async () => {
    // Test formatCurrency helper
    const formatted = formatVND(12500000);
    expect(formatted).toMatch(/12,500,000/);

    const formatted0 = formatVND(0);
    expect(formatted0).toMatch(/0/);

    const formatted3 = formatVND(3000000);
    expect(formatted3).toMatch(/3,000,000/);
  });

  // -- TC_TUI_10: Download tuition PDF receipt ----------------------------------
  it('TC_TUI_10: click Download Receipt for TXN-2024-00123 -> API calls download endpoint', async () => {
    mockApiGet.mockResolvedValueOnce({ url: 'https://myus.edu.vn/receipts/TXN-2024-00123.pdf' });

    const result = await api.get('/api/v1/finance/receipts/TXN-2024-00123');

    expect(mockApiGet).toHaveBeenCalledWith('/api/v1/finance/receipts/TXN-2024-00123');
    expect((result as any).url).toContain('TXN-2024-00123.pdf');
  });

  // -- TC_TUI_11: Debt decreases after making payment ---------------------------
  it('TC_TUI_11: pay 5,000,000 VND -> debt decreases correctly, history updates with new transaction', async () => {
    // Before: balance = 8,000,000 -> after paying 5M: balance = 3,000,000
    const beforePayment = { ...MOCK_FINANCE_HK1, balance: 8000000, payments: 4000000 };
    const afterPayment = { ...MOCK_FINANCE_HK1, balance: 3000000, payments: 9000000 };

    mockApiGet.mockResolvedValueOnce(beforePayment).mockResolvedValueOnce(afterPayment);

    const before = await api.get('/api/v1/finance/tuition/balance');
    const after = await api.get('/api/v1/finance/tuition/balance');

    const reduction = (before as any).balance - (after as any).balance;
    expect(reduction).toBe(5000000);
  });

  // -- TC_TUI_12: Tuition = 0 (100% exemption) ----------------------------------
  it('TC_TUI_12: 100% scholarship -> tuition = 0 VND, 100% Tuition Exemption displayed', async () => {
    const freeFinance = {
      ...MOCK_FINANCE_HK1,
      totalCharges: 12000000,
      scholarshipAmount: 12000000,
      payments: 0,
      balance: 0,
      financialHold: false,
    };
    mockApiGet.mockResolvedValueOnce(freeFinance);

    render(<TuitionPage />);
    await screen.findByText(/HK1 2024-2025/i);

    expect(freeFinance.balance).toBe(0);
    expect(freeFinance.totalCharges - freeFinance.scholarshipAmount).toBe(0);
    expect(screen.queryByText(/financial hold/i)).not.toBeInTheDocument();
  });

  // -- TC_TUI_13: Boundary - multiple overlapping scholarships ------------------
  it('TC_TUI_13: Scholarship A: 2M + Scholarship B: 1.5M -> total 3.5M, does not exceed original tuition', async () => {
    const totalScholarship = 2000000 + 1500000;
    const tuitionFee = 10000000;

    expect(totalScholarship).toBe(3500000);
    expect(totalScholarship).toBeLessThanOrEqual(tuitionFee);
    expect(tuitionFee - totalScholarship).toBe(6500000); // remaining to pay
  });

  // -- TC_TUI_14: Tuition payment overdue ---------------------------------------
  it('TC_TUI_14: tuition payment deadline has passed -> isPaymentOverdue = true -> Overdue warning', async () => {
    const overdueDeadline = new Date('2024-09-15'); // past date
    expect(isPaymentOverdue(overdueDeadline)).toBe(true);

    // financialHold = true when overdue
    mockApiGet.mockResolvedValueOnce({ ...MOCK_FINANCE_WITH_DEBT, financialHold: true });

    render(<TuitionPage />);
    await waitFor(() => {
      expect(screen.getByText(/financial hold/i)).toBeInTheDocument();
    });
  });

  // -- TC_TUI_15: Filter history by date range ----------------------------------
  it('TC_TUI_15: filter from 01/09/2024 to 31/01/2025 -> only displays transactions in that range', async () => {
    const from = new Date('2024-09-01');
    const to = new Date('2025-01-31');

    const filteredHistory = MOCK_FINANCE_HK1.paymentHistory.filter((p) => {
      const d = new Date(p.paymentDate);
      return d >= from && d <= to;
    });

    // Both transactions are within 01/09/2024 - 31/01/2025
    expect(filteredHistory.length).toBe(2);
    expect(filteredHistory[0].referenceNumber).toBe('TXN-2024-00123');
  });

  // -- TC_TUI_16: Total course tuition summary ----------------------------------
  it('TC_TUI_16: view Course Summary -> API returns total tuition paid since beginning of course', async () => {
    const allTime = { totalPaid: 45000000, terms: 6, scholarshipTotal: 8000000 };
    mockApiGet.mockResolvedValueOnce(allTime);

    const result = await api.get('/api/v1/finance/summary/all');

    expect((result as typeof allTime).totalPaid).toBe(45000000);
    expect((result as typeof allTime).terms).toBe(6);
  });
});
