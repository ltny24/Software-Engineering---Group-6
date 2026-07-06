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
      setFinance(res.data || (res as unknown as TuitionBalanceResponse));
    } catch (error) {
      toast.error('Không thể tải dữ liệu tài chính từ máy chủ.');
      console.error('Error fetching tuition data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#666', fontFamily: 'Arial, sans-serif' }}>Đang tải thông tin tài chính...</div>;
  }

  if (!finance) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#888', fontFamily: 'Arial, sans-serif' }}>Không tìm thấy thông tin công nợ cho tài khoản này.</div>;
  }

  return (
    <div style={{ backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif', color: '#333', minHeight: '80vh', width: '100%' }}>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '18px 30px',
          backgroundColor: '#f9f9f9',
          borderBottom: '1px solid #e7e7e7',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'normal', color: '#555', textTransform: 'uppercase' }}>
            Quản Lý Tài Chính Sinh Viên
          </h1>
          <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>
            Học kỳ thu phí: <strong style={{ color: '#333' }}>{finance.term || 'Học kỳ hiện tại'}</strong>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {finance.financialHold ? (
            <span
              style={{
                backgroundColor: '#f2dede',
                color: '#a94442',
                border: '1px solid #ebccd1',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: 'bold',
              }}
            >
              Bị khóa tài chính
            </span>
          ) : (
            <span
              style={{
                backgroundColor: '#dff0d8',
                color: '#3c763d',
                border: '1px solid #d6e9c6',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: 'bold',
              }}
            >
              Trạng thái bình thường
            </span>
          )}
        </div>
      </div>

      <div style={{ padding: '25px 30px' }}>
        {/* Khối Tổng Hợp Công Nợ */}
        <div style={{ border: '1px solid #ddd', borderRadius: '4px', marginBottom: '30px', backgroundColor: '#fff' }}>
          <div style={{ backgroundColor: '#f5f5f5', padding: '12px 18px', borderBottom: '1px solid #ddd', fontWeight: 'bold', color: '#444', fontSize: '14px' }}>
            TỔNG HỢP CÔNG NỢ HỌC KỲ
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-around',
              padding: '20px 15px',
              textAlign: 'center',
              gap: '15px',
            }}
          >
            <div style={{ minWidth: '160px', flex: '1' }}>
              <div style={{ fontSize: '12px', color: '#777', textTransform: 'uppercase', marginBottom: '6px' }}>Tổng Phí Đăng Ký</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>{(finance.totalCharges || 0).toLocaleString('vi-VN')} đ</div>
            </div>

            <div style={{ minWidth: '160px', flex: '1', borderLeft: '1px solid #eee' }}>
              <div style={{ fontSize: '12px', color: '#777', textTransform: 'uppercase', marginBottom: '6px' }}>Học Bổng / Giảm Trừ</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#3c763d' }}>- {(finance.scholarshipAmount || 0).toLocaleString('vi-VN')} đ</div>
            </div>

            <div style={{ minWidth: '160px', flex: '1', borderLeft: '1px solid #eee' }}>
              <div style={{ fontSize: '12px', color: '#777', textTransform: 'uppercase', marginBottom: '6px' }}>Đã Thanh Toán</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#31708f' }}>{(finance.payments || 0).toLocaleString('vi-VN')} đ</div>
            </div>

            <div style={{ minWidth: '180px', flex: '1', borderLeft: '1px solid #ddd', backgroundColor: '#fafafa', padding: '5px 0' }}>
              <div style={{ fontSize: '12px', color: '#a94442', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '6px' }}>SỐ DƯ CÒN NỢ</div>
              <div style={{ fontSize: '22px', fontWeight: 'bold', color: (finance.balance || 0) > 0 ? '#d9534f' : '#3c763d' }}>
                {(finance.balance || 0).toLocaleString('vi-VN')} đ
              </div>
            </div>
          </div>
        </div>

        {/* Bảng Lịch Sử Thanh Toán */}
        <div style={{ border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ backgroundColor: '#f5f5f5', padding: '12px 18px', borderBottom: '1px solid #ddd', fontWeight: 'bold', color: '#444', fontSize: '14px' }}>
            LỊCH SỬ GIAO DỊCH THANH TOÁN
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#ffffff', color: '#333' }}>
                  <th style={{ border: '1px solid #ddd', padding: '12px 10px', fontWeight: 'bold' }}>Mã Giao Dịch</th>
                  <th style={{ border: '1px solid #ddd', padding: '12px 10px', fontWeight: 'bold' }}>Ngày Thanh Toán</th>
                  <th style={{ border: '1px solid #ddd', padding: '12px 10px', fontWeight: 'bold' }}>Phương Thức</th>
                  <th style={{ border: '1px solid #ddd', padding: '12px 15px', fontWeight: 'bold', textAlign: 'right' }}>Số Tiền</th>
                  <th style={{ border: '1px solid #ddd', padding: '12px 10px', fontWeight: 'bold' }}>Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {finance.paymentHistory && finance.paymentHistory.length > 0 ? (
                  finance.paymentHistory.map((item, index) => (
                    <tr key={item.paymentId || index} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9' }}>
                      <td style={{ border: '1px solid #ddd', padding: '12px 10px', fontFamily: 'monospace', color: '#555' }}>{item.referenceNumber}</td>
                      <td style={{ border: '1px solid #ddd', padding: '12px 10px', color: '#555' }}>
                        {item.paymentDate ? new Date(item.paymentDate).toLocaleDateString('vi-VN') : '-'}
                      </td>
                      <td style={{ border: '1px solid #ddd', padding: '12px 10px', color: '#555' }}>
                        {item.paymentMethod === 'BANK_TRANSFER' ? 'Chuyển khoản Ngân hàng' : item.paymentMethod}
                      </td>
                      <td style={{ border: '1px solid #ddd', padding: '12px 15px', textAlign: 'right', fontWeight: 'bold', color: '#333' }}>
                        {(item.amount || 0).toLocaleString('vi-VN')} đ
                      </td>
                      <td style={{ border: '1px solid #ddd', padding: '12px 10px' }}>
                        <span
                          style={{
                            backgroundColor: '#5cb85c',
                            color: '#ffffff',
                            padding: '3px 8px',
                            borderRadius: '3px',
                            fontSize: '11px',
                            fontWeight: 'bold',
                          }}
                        >
                          Thành công
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ border: '1px solid #ddd', padding: '30px', textAlign: 'center', color: '#888' }}>
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
