import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import './TuitionPage.css';

interface TuitionPaymentDTO {
  paymentId: number;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  referenceNumber: string;
  status: string;
}

interface TuitionBalanceResponse {
  studentId: number;
  term: string;
  totalCharges: number;
  payments: number;
  scholarshipAmount: number;
  balance: number;
  financialHold: boolean;
  paymentHistory: TuitionPaymentDTO[];
}

function TuitionPage() {
  const [finance, setFinance] = useState<TuitionBalanceResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value || 0);

  const formatDate = (dateString?: string) =>
    dateString ? new Date(dateString).toLocaleDateString('en-US') : '-';

  useEffect(() => {
    const fetchTuitionData = async () => {
      try {
        setLoading(true);
        const res = await api.get<TuitionBalanceResponse>('/api/v1/finance/tuition/balance');
        setFinance(res as TuitionBalanceResponse);
      } catch (error) {
        toast.error('Unable to load financial data from the server.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTuitionData();
  }, []);

  if (loading) {
    return (
      <div className="tuition-loading">
        <span className="spinner" /> Loading financial information...
      </div>
    );
  }

  if (!finance) {
    return <div className="tuition-loading">No balance data found for this account.</div>;
  }

  const hasBalance = (finance.balance || 0) > 0;

  return (
    <div className="tuition-page">
      {/* Header */}
      <div className="tuition-page__header">
        <div>
          <h1 className="tuition-page__title">Student Financial Dashboard</h1>
          <p className="tuition-page__subtitle">
            Billing term: <strong>{finance.term || 'Current term'}</strong>
          </p>
        </div>

        <div>
          {finance.financialHold ? (
            <span className="tuition-status-badge tuition-status-badge--hold">
              ⚠ Financial Hold
            </span>
          ) : (
            <span className="tuition-status-badge tuition-status-badge--good">
              ✓ Account in Good Standing
            </span>
          )}
        </div>
      </div>

      {/* KPI cards */}
      <div className="tuition-stats">
        <div className="tuition-stat-card">
          <div className="tuition-stat-label">Total Tuition Charges</div>
          <div className="tuition-stat-value tuition-stat-value--dark">
            {formatCurrency(finance.totalCharges)}
          </div>
        </div>

        <div className="tuition-stat-card tuition-stat-card--green">
          <div className="tuition-stat-label">Scholarship / Discounts</div>
          <div className="tuition-stat-value tuition-stat-value--green">
            - {formatCurrency(finance.scholarshipAmount)}
          </div>
        </div>

        <div className="tuition-stat-card tuition-stat-card--blue">
          <div className="tuition-stat-label">Amount Paid</div>
          <div className="tuition-stat-value tuition-stat-value--blue">
            {formatCurrency(finance.payments)}
          </div>
        </div>

        <div
          className={`tuition-stat-card ${hasBalance ? 'tuition-stat-card--red' : 'tuition-stat-card--green'}`}
        >
          <div className="tuition-stat-label">Outstanding Balance</div>
          <div
            className={`tuition-stat-value ${hasBalance ? 'tuition-stat-value--red' : 'tuition-stat-value--green'}`}
          >
            {formatCurrency(finance.balance)}
          </div>
        </div>
      </div>

      {/* Payment history table */}
      <div className="tuition-table-section">
        <div className="tuition-table-header">
          <h2>Payment History</h2>
        </div>

        <div className="tuition-table-wrapper">
          <table className="tuition-table">
            <thead>
              <tr>
                <th>Reference Number</th>
                <th>Payment Date</th>
                <th>Method</th>
                <th className="cell-right">Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {finance.paymentHistory && finance.paymentHistory.length > 0 ? (
                finance.paymentHistory.map((item, index) => (
                  <tr key={item.paymentId || index}>
                    <td className="cell-mono">{item.referenceNumber}</td>
                    <td className="cell-bold">{formatDate(item.paymentDate)}</td>
                    <td className="cell-text">
                      {item.paymentMethod === 'BANK_TRANSFER'
                        ? 'Bank Transfer'
                        : item.paymentMethod}
                    </td>
                    <td className="cell-bold cell-right">{formatCurrency(item.amount)}</td>
                    <td>
                      <span className="tuition-payment-badge">Completed</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="tuition-empty">
                    No payment transactions recorded from the server.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TuitionPage;
