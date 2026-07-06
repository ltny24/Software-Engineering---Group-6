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
      const data = await api.get<TuitionBalanceResponse>('/v1/finance/tuition-balance');
      setFinance(data);
    } catch (error) {
      toast.error('Không thể tải dữ liệu tài chính từ máy chủ.');
      console.error('Error fetching tuition data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-slate-500 font-medium">
        Đang kiểm tra trạng thái học phí...
      </div>
    );
  }

  if (!finance) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">Quản Lý Học Phí & Tài Chính</h1>
            <p className="text-sm text-slate-500 mt-1">Học kỳ hiện tại: <span className="font-medium text-slate-700">{finance.term}</span></p>
          </div>
          <div className="mt-4 sm:mt-0">
            {finance.financialHold ? (
              <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-rose-50 text-rose-700 border border-rose-200">
                Bị khóa tài chính
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                Trạng thái bình thường
              </span>
            )}
          </div>
        </div>

        {/* Khối Tổng Hợp Công Nợ */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-sm font-semibold text-slate-700">Tổng Hợp Công Nợ Học Kỳ</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Tổng Học Phí</p>
                <p className="text-xl font-semibold text-slate-800">{(finance.totalCharges || 0).toLocaleString('vi-VN')} đ</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Học Bổng / Giảm Trừ</p>
                <p className="text-xl font-medium text-emerald-600">- {(finance.scholarshipAmount || 0).toLocaleString('vi-VN')} đ</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Đã Thanh Toán</p>
                <p className="text-xl font-medium text-indigo-600">{(finance.payments || 0).toLocaleString('vi-VN')} đ</p>
              </div>
              <div className="sm:border-l sm:border-slate-200 sm:pl-8">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Số Dư Còn Nợ</p>
                <p className="text-2xl font-bold text-rose-600">{(finance.balance || 0).toLocaleString('vi-VN')} đ</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bảng Lịch Sử Thanh Toán */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-sm font-semibold text-slate-700">Lịch Sử Giao Dịch</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-white text-slate-500 uppercase text-xs tracking-wider border-b border-slate-200">
                  <th className="py-4 px-6 font-medium">Mã Giao Dịch</th>
                  <th className="py-4 px-6 font-medium">Ngày Giao Dịch</th>
                  <th className="py-4 px-6 font-medium">Phương Thức</th>
                  <th className="py-4 px-6 font-medium text-right">Số Tiền</th>
                  <th className="py-4 px-6 font-medium text-center">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {finance.paymentHistory && finance.paymentHistory.length > 0 ? (
                  finance.paymentHistory.map((item) => (
                    <tr key={item.paymentId} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6 font-mono text-slate-600">{item.referenceNumber}</td>
                      <td className="py-4 px-6 text-slate-700">
                        {item.paymentDate ? new Date(item.paymentDate).toLocaleDateString('vi-VN') : '-'}
                      </td>
                      <td className="py-4 px-6 text-slate-700">
                        {item.paymentMethod === 'BANK_TRANSFER' ? 'Chuyển khoản Ngân hàng' : item.paymentMethod}
                      </td>
                      <td className="py-4 px-6 text-right font-medium text-slate-800">
                        {(item.amount || 0).toLocaleString('vi-VN')} đ
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex justify-center items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Thành công
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      Chưa ghi nhận giao dịch thanh toán nào.
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
