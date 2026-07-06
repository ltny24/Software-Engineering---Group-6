import React, { useState, useEffect } from 'react';

interface CourseGrade {
  courseCode: string;
  courseName: string;
  credits: number;
  midtermScore: number;
  finalScore: number;
  overallScore: number;
  letterGrade: string;
  isPassed: boolean;
}

interface SemesterData {
  semesterId: string;
  semesterName: string;
  gpa10: number;
  gpa4: number;
  creditsEarned: number;
  totalCredits: number;
  courses: CourseGrade[];
}

export const GradePage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [semesters, setSemesters] = useState<SemesterData[]>([]);
  const [selectedSemId, setSelectedSemId] = useState<string>('');

  useEffect(() => {
    // Giả lập gọi API lấy bảng điểm
    setTimeout(() => {
      const mockData: SemesterData[] = [
        {
          semesterId: "HK2_2024_2025",
          semesterName: "Học kỳ 2 - Năm học 2024-2025",
          gpa10: 8.55,
          gpa4: 3.62,
          creditsEarned: 18,
          totalCredits: 18,
          courses: [
            { courseCode: "CSC10009", courseName: "Hệ thống máy tính", credits: 4, midtermScore: 8.5, finalScore: 8.5, overallScore: 8.5, letterGrade: "A", isPassed: true },
            { courseCode: "CSC10004", courseName: "Cấu trúc dữ liệu và giải thuật", credits: 4, midtermScore: 9.0, finalScore: 8.5, overallScore: 8.7, letterGrade: "A", isPassed: true },
            { courseCode: "CSC10006", courseName: "Cơ sở dữ liệu", credits: 4, midtermScore: 8.0, finalScore: 8.5, overallScore: 8.3, letterGrade: "B+", isPassed: true },
            { courseCode: "MTH10003", courseName: "Xác suất thống kê", credits: 3, midtermScore: 8.5, finalScore: 9.0, overallScore: 8.8, letterGrade: "A", isPassed: true },
            { courseCode: "ENG10002", courseName: "Tiếng Anh học thuật 2", credits: 3, midtermScore: 8.5, finalScore: 8.5, overallScore: 8.5, letterGrade: "A", isPassed: true },
          ]
        },
        {
          semesterId: "HK1_2024_2025",
          semesterName: "Học kỳ 1 - Năm học 2024-2025",
          gpa10: 8.40,
          gpa4: 3.55,
          creditsEarned: 16,
          totalCredits: 16,
          courses: [
            { courseCode: "CSC10001", courseName: "Nhập môn lập trình", credits: 4, midtermScore: 8.5, finalScore: 9.0, overallScore: 8.8, letterGrade: "A", isPassed: true },
            { courseCode: "MTH10001", courseName: "Vi tích phân 1B", credits: 4, midtermScore: 8.0, finalScore: 8.0, overallScore: 8.0, letterGrade: "B+", isPassed: true },
            { courseCode: "PHY10001", courseName: "Vật lý đại cương", credits: 4, midtermScore: 8.5, finalScore: 8.0, overallScore: 8.2, letterGrade: "B+", isPassed: true },
            { courseCode: "ENG10001", courseName: "Tiếng Anh học thuật 1", credits: 4, midtermScore: 8.5, finalScore: 8.5, overallScore: 8.5, letterGrade: "A", isPassed: true },
          ]
        }
      ];
      setSemesters(mockData);
      setSelectedSemId(mockData[0].semesterId);
      setLoading(false);
    }, 300);
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 font-sans">
        Đang tải kết quả học tập...
      </div>
    );
  }

  const currentSem = semesters.find(s => s.semesterId === selectedSemId) || semesters[0];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Tiêu đề trang & Thanh chọn học kỳ */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Kết quả học tập</h1>
            <p className="text-sm text-slate-500 mt-0.5">Theo dõi điểm số và tiến độ tích lũy tín chỉ</p>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="semester-select" className="text-sm font-medium text-slate-600 whitespace-nowrap">
              Học kỳ:
            </label>
            <select
              id="semester-select"
              value={selectedSemId}
              onChange={(e) => setSelectedSemId(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              {semesters.map((sem) => (
                <option key={sem.semesterId} value={sem.semesterId}>
                  {sem.semesterName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Thẻ tổng kết GPA - Thiết kế phẳng, trắng, viền gọn gàng */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
            <div className="text-xs font-medium text-slate-500 uppercase">Điểm trung bình học kỳ (Hệ 10)</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{currentSem?.gpa10.toFixed(2)}</span>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Giỏi</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
            <div className="text-xs font-medium text-slate-500 uppercase">Điểm trung bình học kỳ (Hệ 4)</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{currentSem?.gpa4.toFixed(2)}</span>
              <span className="text-xs text-slate-400">/ 4.0</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
            <div className="text-xs font-medium text-slate-500 uppercase">Tín chỉ đạt / Tổng đăng ký</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{currentSem?.creditsEarned}</span>
              <span className="text-sm text-slate-500">/ {currentSem?.totalCredits} tín chỉ</span>
            </div>
          </div>
        </div>

        {/* Bảng điểm chi tiết - Chuẩn layout trang quản lý */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50">
            <h2 className="text-sm font-semibold text-slate-700">Chi tiết bảng điểm môn học</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-600 bg-slate-50">
                  <th className="py-3 px-4 w-28">Mã môn</th>
                  <th className="py-3 px-4">Tên môn học</th>
                  <th className="py-3 px-4 text-center w-20">TC</th>
                  <th className="py-3 px-4 text-right w-24">Giữa kỳ</th>
                  <th className="py-3 px-4 text-right w-24">Cuối kỳ</th>
                  <th className="py-3 px-4 text-right w-24 font-bold">Tổng kết</th>
                  <th className="py-3 px-4 text-center w-24">Điểm chữ</th>
                  <th className="py-3 px-4 text-center w-24">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {currentSem?.courses.map((course) => (
                  <tr key={course.courseCode} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-600">{course.courseCode}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">{course.courseName}</td>
                    <td className="py-3.5 px-4 text-center text-slate-600">{course.credits}</td>
                    <td className="py-3.5 px-4 text-right text-slate-600">{course.midtermScore.toFixed(1)}</td>
                    <td className="py-3.5 px-4 text-right text-slate-600">{course.finalScore.toFixed(1)}</td>
                    <td className="py-3.5 px-4 text-right font-semibold text-slate-900">{course.overallScore.toFixed(1)}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-semibold text-slate-800">
                        {course.letterGrade}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {course.isPassed ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Đạt
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
                          Học lại
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GradePage;
