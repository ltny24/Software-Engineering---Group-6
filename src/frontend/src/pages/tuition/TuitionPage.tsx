import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';

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
      <div
        style={{
          padding: '40px',
          textAlign: 'center',
          color: '#64748b',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        Loading financial information...
      </div>
    );
  }

  if (!finance) {
    return (
      <div
        style={{
          padding: '40px',
          textAlign: 'center',
          color: '#64748b',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        No balance data found for this account.
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        padding: '32px 24px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        width: '100%',
      }}
    >
      <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
        {/* Header Section */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: '20px',
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <h1
              style={{ fontSize: '24px', fontWeight: '600', color: '#1e293b', margin: '0 0 4px 0' }}
            >
              Student Financial Dashboard
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
              Billing term:{' '}
              <strong style={{ color: '#1e293b', fontWeight: '600' }}>
                {finance.term || 'Current term'}
              </strong>
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            {finance.financialHold ? (
              <span
                style={{
                  backgroundColor: '#fef2f2',
                  color: '#dc2626',
                  border: '1px solid #fecaca',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '600',
                }}
              >
                Financial Hold
              </span>
            ) : (
              <span
                style={{
                  backgroundColor: '#f0fdf4',
                  color: '#16a34a',
                  border: '1px solid #bbf7d0',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '600',
                }}
              >
                Account in Good Standing
              </span>
            )}
          </div>
        </div>

        {/* Summary KPI Cards */}
        <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <div
            style={{
              flex: '1',
              minWidth: '220px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              border: '1px solid #e2e8f0',
              borderTop: '4px solid #6366f1',
            }}
          >
            <div
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px',
              }}
            >
              Total Tuition Charges
            </div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>
              {formatCurrency(finance.totalCharges)}
            </div>
          </div>

          <div
            style={{
              flex: '1',
              minWidth: '220px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              border: '1px solid #e2e8f0',
              borderTop: '4px solid #10b981',
            }}
          >
            <div
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px',
              }}
            >
              Scholarship / Discounts
            </div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#059669' }}>
              - {formatCurrency(finance.scholarshipAmount)}
            </div>
          </div>

          <div
            style={{
              flex: '1',
              minWidth: '220px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              border: '1px solid #e2e8f0',
              borderTop: '4px solid #0ea5e9',
            }}
          >
            <div
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px',
              }}
            >
              Amount Paid
            </div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#0284c7' }}>
              {formatCurrency(finance.payments)}
            </div>
          </div>

          <div
            style={{
              flex: '1',
              minWidth: '220px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              border: '1px solid #e2e8f0',
              borderTop: `4px solid ${(finance.balance || 0) > 0 ? '#ef4444' : '#10b981'}`,
            }}
          >
            <div
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px',
              }}
            >
              Outstanding Balance
            </div>
            <div
              style={{
                fontSize: '20px',
                fontWeight: '700',
                color: (finance.balance || 0) > 0 ? '#dc2626' : '#059669',
              }}
            >
              {formatCurrency(finance.balance)}
            </div>
          </div>
        </div>

        {/* Payment History Table Section */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '16px 24px',
              borderBottom: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
            }}
          >
            <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#334155', margin: 0 }}>
              Payment History
            </h2>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '14px',
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: '#ffffff',
                    borderBottom: '2px solid #e2e8f0',
                    color: '#64748b',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                  }}
                >
                  <th style={{ padding: '14px 24px', fontWeight: '600' }}>Reference Number</th>
                  <th style={{ padding: '14px 24px', fontWeight: '600' }}>Payment Date</th>
                  <th style={{ padding: '14px 24px', fontWeight: '600' }}>Method</th>
                  <th style={{ padding: '14px 24px', fontWeight: '600', textAlign: 'right' }}>
                    Amount
                  </th>
                  <th style={{ padding: '14px 24px', fontWeight: '600' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {finance.paymentHistory && finance.paymentHistory.length > 0 ? (
                  finance.paymentHistory.map((item, index) => (
                    <tr
                      key={item.paymentId || index}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#fcfcfd',
                      }}
                    >
                      <td
                        style={{
                          padding: '16px 24px',
                          fontFamily: 'monospace',
                          color: '#475569',
                          fontWeight: '500',
                        }}
                      >
                        {item.referenceNumber}
                      </td>
                      <td style={{ padding: '16px 24px', color: '#1e293b', fontWeight: '500' }}>
                        {formatDate(item.paymentDate)}
                      </td>
                      <td style={{ padding: '16px 24px', color: '#475569' }}>
                        {item.paymentMethod === 'BANK_TRANSFER'
                          ? 'Bank Transfer'
                          : item.paymentMethod}
                      </td>
                      <td
                        style={{
                          padding: '16px 24px',
                          textAlign: 'right',
                          fontWeight: '600',
                          fontSize: '13px',
                          color: '#1e293b',
                        }}
                      >
                        {formatCurrency(item.amount)}
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            backgroundColor: '#f0fdf4',
                            color: '#16a34a',
                            border: '1px solid #bbf7d0',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: '600',
                          }}
                        >
                          Completed
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        padding: '48px',
                        textAlign: 'center',
                        color: '#94a3b8',
                        fontSize: '14px',
                      }}
                    >
                      No payment transactions recorded from the server.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TuitionPage;
