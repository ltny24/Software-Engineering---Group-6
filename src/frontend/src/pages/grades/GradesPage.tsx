import React, { useState, useEffect } from 'react';
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

export const TuitionPage: React.FC = () => {
  const [finance, setFinance] = useState<TuitionBalanceResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchTuitionData();
  }, []);

  const fetchTuitionData = async () => {
    try {
      setLoading(true);
      const res = await api.get<TuitionBalanceResponse>('/v1/finance/tuition-balance');
      
      // Bóc tách .data để tránh lỗi TypeScript AxiosResponse
      setFinance(res.data || (res as unknown as TuitionBalanceResponse));
    } catch (error) {
      toast.error('Không thể tải dữ liệu tài chính từ máy chủ.');
      console.error('Error fetching tuition data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', fontFamily: 'sans-serif' }}>Đang tải thông tin tài chính...</div>;
  }

  if (!finance) return <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontFamily: 'sans-serif' }}>Không tìm thấy thông tin công nợ cho tài khoản này.</div>;

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '32px 24px', fontFamily: 'system-ui, -apple-system, sans-serif', width: '100%' }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#1e293b', margin: '0 0 4px 0' }}>Quản Lý Học Phí & Tài Chính</h1>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
              Học kỳ thu phí: <strong style={{ color: '#334155' }}>{finance.term || 'Học kỳ hiện tại'}</strong>
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {finance.financialHold ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                Bị khóa tài chính
              </span>
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#22c55e', padding: '6px 12px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                Trạng thái bình thường
              </span>
            )}
          </div>
        </div>

        {/* Thống kê Tổng quan (4 Thẻ Cards) */}
        <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '200px', backgroundColor: '#ffffff', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderTop: '4px solid #64748b', border: '1px solid #e2e8f0', borderTopWidth: '4px', borderTopColor: '#64748b' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Tổng Học Phí</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>
              {(finance.totalCharges || 0).toLocaleString('vi-VN')} đ
            </div>
          </div>

          <div style={{ flex: '1', minWidth: '200px', backgroundColor: '#ffffff', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0', borderTop: '4px solid #10b981' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Học Bổng / Giảm Trừ</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>
              - {(finance.scholarshipAmount || 0).toLocaleString('vi-VN')} đ
            </div>
          </div>

          <div style={{ flex: '1', minWidth: '200px', backgroundColor: '#ffffff', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0', borderTop: '4px solid #0ea5e9' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Đã Thanh Toán</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#0ea5e9' }}>
              {(finance.payments || 0).toLocaleString('vi-VN')} đ
            </div>
          </div>

          <div style={{ flex: '1', minWidth: '200px', backgroundColor: '#ffffff', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0', borderTop: '4px solid #f43f5e' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#f43f5e', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Số Dư Còn Nợ</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: (finance.balance || 0) > 0 ? '#f43f5e' : '#10b981' }}>
              {(finance.balance || 0).toLocaleString('vi-VN')} đ
            </div>
          </div>
        </div>

        {/* Bảng Lịch Sử Thanh Toán */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
            <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#334155', margin: 0 }}>Lịch Sử Giao Dịch</h2>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: '#ffffff', borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '14px 24px', fontWeight: '600' }}>Mã Giao Dịch</th>
                  <th style={{ padding: '14px 24px', fontWeight: '600' }}>Ngày Thanh Toán</th>
                  <th style={{ padding: '14px 24px', fontWeight: '600' }}>Phương Thức</th>
                  <th style={{ padding: '14px 24px', fontWeight: '600', textAlign: 'right' }}>Số Tiền</th>
                  <th style={{ padding: '14px 24px', fontWeight: '600', textAlign: 'center' }}>Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {finance.paymentHistory && finance.paymentHistory.length > 0 ? (
                  finance.paymentHistory.map((item, index) => (
                    <tr key={item.paymentId} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: index % 2 === 0 ? '#ffffff' : '#fcfcfd' }}>
                      <td style={{ padding: '16px 24px', fontFamily: 'monospace', color: '#475569', fontWeight: '500' }}>{item.referenceNumber}</td>
                      <td style={{ padding: '16px 24px', color: '#1e293b', fontWeight: '500' }}>
                        {item.paymentDate ? new Date(item.paymentDate).toLocaleDateString('vi-VN') : '-'}
                      </td>
                      <td style={{ padding: '16px 24px', color: '#475569' }}>
                        {item.paymentMethod === 'BANK_TRANSFER' ? 'Chuyển khoản Ngân hàng' : item.paymentMethod}
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right', fontWeight: '700', color: '#0f172a' }}>
                        {(item.amount || 0).toLocaleString('vi-VN')} đ
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                        <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '6px', fontWeight: '600', fontSize: '13px', backgroundColor: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }}>
                          Thành công
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
                      Chưa ghi nhận giao dịch thanh toán nào từ máy chủ.
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
};

export default TuitionPage;
