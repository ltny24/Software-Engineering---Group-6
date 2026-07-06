import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';

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
    fetchAcademicData();
  }, []);

  const fetchAcademicData = async () => {
    try {
      setLoading(true);
      const [gradesResponse, gpaResponse] = await Promise.all([
        api.get<GradeDTO[]>('/v1/academic/grades'),
        api.get<number>('/v1/academic/gpa')
      ]);
      
      setGrades(gradesResponse);
      setGpa(gpaResponse);
    } catch (error) {
      toast.error('Không thể tải kết quả học tập từ máy chủ.');
      console.error('Error fetching academic data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-slate-500 font-medium">
        Đang tải dữ liệu bảng điểm...
      </div>
    );
  }

  const filteredGrades = grades.filter((g) => g.term === selectedTerm);
  const totalCredits = filteredGrades.reduce((sum, g) => sum + (g.course?.credits || 0), 0);

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">Kết Quả Học Tập & GPA</h1>
            <p className="text-sm text-slate-500 mt-1">Quản lý điểm số và tiến độ tích lũy tín chỉ</p>
          </div>
          
          <div className="mt-4 sm:mt-0 flex items-center bg-white border border-slate-200 rounded-md px-3 py-1.5 shadow-sm">
            <label htmlFor="term-select" className="text-sm font-medium text-slate-600 mr-2">Học kỳ:</label>
            <select
              id="term-select"
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="bg-transparent text-sm font-medium text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="2024-2025-HK2">Học kỳ 2 (2024 - 2025)</option>
              <option value="2024-2025-HK1">Học kỳ 1 (2024 - 2025)</option>
            </select>
          </div>
        </div>

        {/* Thống kê Tổng quan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border-t-4 border-indigo-500">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Trung Bình Tích Lũy (Hệ 10)</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-slate-800">{gpa ? gpa.toFixed(2) : '0.00'}</span>
              <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Khá Giỏi</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border-t-4 border-sky-500">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Điểm Hệ 4 (Quy Đổi)</h3>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-slate-800">{gpa ? (gpa * 0.4).toFixed(2) : '0.00'}</span>
              <span className="text-sm font-medium text-slate-400 mb-1">/ 4.0</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border-t-4 border-emerald-500">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Tín Chỉ Học Kỳ Này</h3>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-slate-800">{totalCredits}</span>
              <span className="text-sm font-medium text-slate-500 mb-1">tín chỉ</span>
            </div>
          </div>
        </div>

        {/* Bảng Chi Tiết Môn Học */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-sm font-semibold text-slate-700">Chi Tiết Bảng Điểm Môn Học</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-white text-slate-500 uppercase text-xs tracking-wider border-b border-slate-200">
                  <th className="py-4 px-6 font-medium">Mã MH</th>
                  <th className="py-4 px-6 font-medium">Tên Môn Học</th>
                  <th className="py-4 px-6 font-medium text-center">STC</th>
                  <th className="py-4 px-6 font-medium text-right">Giữa Kỳ</th>
                  <th className="py-4 px-6 font-medium text-right">Cuối Kỳ</th>
                  <th className="py-4 px-6 font-semibold text-slate-700 text-right">Tổng Kết</th>
                  <th className="py-4 px-6 font-medium text-center">Điểm Chữ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredGrades.length > 0 ? (
                  filteredGrades.map((item) => (
                    <tr key={item.gradeId} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6 font-mono text-slate-600">{item.course?.courseCode}</td>
                      <td className="py-4 px-6 font-medium text-slate-800">{item.course?.courseName}</td>
                      <td className="py-4 px-6 text-center text-slate-600">{item.course?.credits}</td>
                      <td className="py-4 px-6 text-right text-slate-600">{item.midtermScore ? item.midtermScore.toFixed(1) : '-'}</td>
                      <td className="py-4 px-6 text-right text-slate-600">{item.finalScore ? item.finalScore.toFixed(1) : '-'}</td>
                      <td className="py-4 px-6 text-right font-semibold text-slate-800">{item.overallScore ? item.overallScore.toFixed(1) : '-'}</td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex justify-center items-center px-2.5 py-0.5 rounded-md font-medium text-slate-700 bg-slate-100 border border-slate-200 min-w-[2rem]">
                          {item.gradeValue}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
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

export default GradePage;
