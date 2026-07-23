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
interface CourseDTO {
  courseId: number;
  courseCode: string;
  courseName: string;
  credits: number;
}

interface GradeDTO {
  gradeId: number;
  term: string;
  gradeValue: string;
  gradePoint: number;
  midtermScore: number;
  finalScore: number;
  overallScore: number;
  course: CourseDTO;
}

export const GradePage: React.FC = () => {
  const [grades, setGrades] = useState<GradeDTO[]>([]);
  const [gpa, setGpa] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTerm, setSelectedTerm] = useState<string>('2024-2025-HK2');

  useEffect(() => {
    // BƠM MOCK DATA HIỂN THỊ NGAY LẬP TỨC
    const fakeGrades: GradeDTO[] = [
      {
        gradeId: 1,
        term: '2024-2025-HK2',
        gradeValue: 'A',
        gradePoint: 4.0,
        midtermScore: 8.5,
        finalScore: 8.5,
        overallScore: 8.5,
        course: {
          courseId: 101,
          courseCode: 'CSC10009',
          courseName: 'Hệ thống máy tính',
          credits: 4,
        },
      },
      {
        gradeId: 2,
        term: '2024-2025-HK2',
        gradeValue: 'A',
        gradePoint: 4.0,
        midtermScore: 9.0,
        finalScore: 8.5,
        overallScore: 8.7,
        course: {
          courseId: 102,
          courseCode: 'CSC10004',
          courseName: 'Cấu trúc dữ liệu và giải thuật',
          credits: 4,
        },
      },
      {
        gradeId: 3,
        term: '2024-2025-HK2',
        gradeValue: 'B+',
        gradePoint: 3.5,
        midtermScore: 8.0,
        finalScore: 8.5,
        overallScore: 8.3,
        course: { courseId: 103, courseCode: 'CSC10006', courseName: 'Cơ sở dữ liệu', credits: 4 },
      },
      {
        gradeId: 4,
        term: '2024-2025-HK1',
        gradeValue: 'A',
        gradePoint: 4.0,
        midtermScore: 8.5,
        finalScore: 9.0,
        overallScore: 8.8,
        course: {
          courseId: 104,
          courseCode: 'CSC10001',
          courseName: 'Nhập môn lập trình',
          credits: 4,
        },
      },
    ];

    setGrades(fakeGrades);
    setGpa(8.55);
    setLoading(false);
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
    return (
      <div
        style={{ padding: '40px', textAlign: 'center', color: '#64748b', fontFamily: 'sans-serif' }}
      >
        Đang tải dữ liệu bảng điểm...
      </div>
    );
  }

  const filteredGrades = grades.filter((g) => g.term === selectedTerm);
  const totalCredits = filteredGrades.reduce((sum, g) => sum + (g.course?.credits || 0), 0);

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
              Kết Quả Học Tập & GPA
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
              Quản lý điểm số và tiến độ tích lũy tín chỉ
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              padding: '6px 12px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            }}
          >
            <label
              htmlFor="term-select"
              style={{ fontSize: '14px', fontWeight: '500', color: '#475569', marginRight: '8px' }}
            >
              Học kỳ:
            </label>
            <select
              id="term-select"
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: '14px',
                fontWeight: '500',
                color: '#1e293b',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="2024-2025-HK2">Học kỳ 2 (2024 - 2025)</option>
              <option value="2024-2025-HK1">Học kỳ 1 (2024 - 2025)</option>
            </select>
          </div>
        </div>

        {/* Thống kê Tổng quan (3 Thẻ Cards) */}
        <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', flexWrap: 'wrap' }}>
          {/* Card 1 */}
          <div
            style={{
              flex: '1',
              minWidth: '250px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              borderTop: '4px solid #6366f1',
              border: '1px solid #e2e8f0',
              borderTopWidth: '4px',
              borderTopColor: '#6366f1',
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
              Trung Bình Tích Lũy (Hệ 10)
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
              <span style={{ fontSize: '30px', fontWeight: '700', color: '#1e293b' }}>
                {gpa ? gpa.toFixed(2) : '0.00'}
              </span>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#4f46e5',
                  backgroundColor: '#eef2ff',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}
              >
                Khá Giỏi
              </span>
            </div>
          </div>

          {/* Card 2 */}
          <div
            style={{
              flex: '1',
              minWidth: '250px',
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
              Điểm Hệ 4 (Quy Đổi)
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '30px', fontWeight: '700', color: '#1e293b' }}>
                {gpa ? (gpa * 0.4).toFixed(2) : '0.00'}
              </span>
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#94a3b8' }}>/ 4.0</span>
            </div>
          </div>

          {/* Card 3 */}
          <div
            style={{
              flex: '1',
              minWidth: '250px',
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
              Tín Chỉ Học Kỳ Này
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '30px', fontWeight: '700', color: '#1e293b' }}>
                {totalCredits}
              </span>
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#64748b' }}>tín chỉ</span>
            </div>
          </div>

          <div style={{ flex: '1', minWidth: '200px', backgroundColor: '#ffffff', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0', borderTop: '4px solid #f43f5e' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#f43f5e', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Số Dư Còn Nợ</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: (finance.balance || 0) > 0 ? '#f43f5e' : '#10b981' }}>
              {(finance.balance || 0).toLocaleString('vi-VN')} đ
            </div>
        {/* Bảng Chi Tiết Môn Học */}
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
              Chi Tiết Bảng Điểm Môn Học
            </h2>
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
                  <th style={{ padding: '14px 24px', fontWeight: '600' }}>Mã MH</th>
                  <th style={{ padding: '14px 24px', fontWeight: '600' }}>Tên Môn Học</th>
                  <th style={{ padding: '14px 24px', fontWeight: '600', textAlign: 'center' }}>
                    STC
                  </th>
                  <th style={{ padding: '14px 24px', fontWeight: '600', textAlign: 'right' }}>
                    Giữa Kỳ
                  </th>
                  <th style={{ padding: '14px 24px', fontWeight: '600', textAlign: 'right' }}>
                    Cuối Kỳ
                  </th>
                  <th
                    style={{
                      padding: '14px 24px',
                      fontWeight: '600',
                      textAlign: 'right',
                      color: '#334155',
                    }}
                  >
                    Tổng Kết
                  </th>
                  <th style={{ padding: '14px 24px', fontWeight: '600', textAlign: 'center' }}>
                    Điểm Chữ
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredGrades.length > 0 ? (
                  filteredGrades.map((item, index) => (
                    <tr
                      key={item.gradeId}
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
                        {item.course?.courseCode}
                      </td>
                      <td style={{ padding: '16px 24px', fontWeight: '600', color: '#1e293b' }}>
                        {item.course?.courseName}
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'center', color: '#475569' }}>
                        {item.course?.credits}
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right', color: '#475569' }}>
                        {item.midtermScore ? item.midtermScore.toFixed(1) : '-'}
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right', color: '#475569' }}>
                        {item.finalScore ? item.finalScore.toFixed(1) : '-'}
                      </td>
                      <td
                        style={{
                          padding: '16px 24px',
                          textAlign: 'right',
                          fontWeight: '700',
                          color: '#0f172a',
                        }}
                      >
                        {item.overallScore ? item.overallScore.toFixed(1) : '-'}
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontWeight: '600',
                            fontSize: '13px',
                            backgroundColor: '#f1f5f9',
                            color: '#334155',
                            border: '1px solid #e2e8f0',
                          }}
                        >
                          {item.gradeValue}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
                      Chưa ghi nhận giao dịch thanh toán nào từ máy chủ.
                    <td
                      colSpan={7}
                      style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}
                    >
                      Chưa có dữ liệu môn học cho học kỳ này.
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
