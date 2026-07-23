import React, { useEffect, useState } from 'react';

interface TimetableItem {
  id: number;
  term: string;
  day: string;
  courseCode: string;
  courseName: string;
  periods: number;
  room: string;
  lecturer: string;
  classType: string;
}

function TimetablePage() {
  const [schedule, setSchedule] = useState<TimetableItem[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<string>('2024-2025-HK2');
  const [loading, setLoading] = useState<boolean>(true);

  // Hàm tính giờ học dựa vào tiết
  const getTimeSlot = (periods: number): string => {
    const timeSlots: Record<number, string> = {
      1: '7:00 - 8:30',
      2: '8:45 - 10:15',
      3: '10:30 - 12:00',
      4: '13:00 - 14:30',
      5: '14:45 - 16:15',
      6: '16:30 - 18:00',
      7: '18:15 - 19:45',
    };
    return timeSlots[periods] || 'N/A';
  };

  useEffect(() => {
    const fakeSchedule: TimetableItem[] = [
      {
        id: 1,
        term: '2024-2025-HK2',
        day: 'Thứ 2',
        courseCode: 'CSC10009',
        courseName: 'Hệ thống máy tính',
        periods: 3,
        room: 'A201',
        lecturer: 'TS. Nguyễn Văn An',
        classType: 'Lý thuyết',
      },
      {
        id: 2,
        term: '2024-2025-HK2',
        day: 'Thứ 2',
        courseCode: 'CSC10004',
        courseName: 'Cấu trúc dữ liệu và giải thuật',
        periods: 4,
        room: 'B302',
        lecturer: 'ThS. Trần Thị Bình',
        classType: 'Thực hành',
      },
      {
        id: 3,
        term: '2024-2025-HK2',
        day: 'Thứ 3',
        courseCode: 'CSC10006',
        courseName: 'Cơ sở dữ liệu',
        periods: 3,
        room: 'C105',
        lecturer: 'TS. Lê Hoàng Cường',
        classType: 'Lý thuyết',
      },
      {
        id: 4,
        term: '2024-2025-HK2',
        day: 'Thứ 4',
        courseCode: 'CSC10003',
        courseName: 'Mạng máy tính',
        periods: 2,
        room: 'A104',
        lecturer: 'TS. Phạm Minh Dũng',
        classType: 'Lab',
      },
      {
        id: 5,
        term: '2024-2025-HK2',
        day: 'Thứ 5',
        courseCode: 'CSC10011',
        courseName: 'Phân tích và thiết kế hệ thống',
        periods: 4,
        room: 'D204',
        lecturer: 'ThS. Nguyễn Mỹ Linh',
        classType: 'Lý thuyết',
      },
      {
        id: 6,
        term: '2024-2025-HK1',
        day: 'Thứ 2',
        courseCode: 'CSC10001',
        courseName: 'Nhập môn lập trình',
        periods: 3,
        room: 'A101',
        lecturer: 'TS. Võ Minh Khôi',
        classType: 'Lý thuyết',
      },
    ];

    setSchedule(fakeSchedule);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div
        style={{ padding: '40px', textAlign: 'center', color: '#64748b', fontFamily: 'sans-serif' }}
      >
        Đang tải thời khóa biểu...
      </div>
    );
  }

  const filteredSchedule = schedule.filter((item) => item.term === selectedTerm);
  const totalCourses = filteredSchedule.length;
  const totalPeriods = filteredSchedule.reduce((sum, item) => sum + item.periods, 0);

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
              Thời Khóa Biểu Học Tập
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
              Theo dõi lịch học theo từng học kỳ và phòng học
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
              htmlFor="timetable-term-select"
              style={{ fontSize: '14px', fontWeight: '500', color: '#475569', marginRight: '8px' }}
            >
              Học kỳ:
            </label>
            <select
              id="timetable-term-select"
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

        <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <div
            style={{
              flex: '1',
              minWidth: '250px',
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
              Tổng Số Môn Học
            </div>
            <div style={{ fontSize: '30px', fontWeight: '700', color: '#1e293b' }}>
              {totalCourses}
            </div>
          </div>

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
              Tổng Số Tiết Học / Tuần
            </div>
            <div style={{ fontSize: '30px', fontWeight: '700', color: '#1e293b' }}>
              {totalPeriods}
            </div>
          </div>
        </div>

        {/* Lịch Học Theo Tuần */}
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
              Lịch Học Theo Tuần
            </h2>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '13px',
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: '#f8fafc',
                    borderBottom: '2px solid #e2e8f0',
                    color: '#64748b',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                  }}
                >
                  {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'].map(
                    (dayName) => (
                      <th
                        key={dayName}
                        style={{
                          padding: '14px 12px',
                          fontWeight: '600',
                          borderRight: '1px solid #e2e8f0',
                          minWidth: '150px',
                        }}
                      >
                        {dayName}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                <tr
                  style={{
                    backgroundColor: '#ffffff',
                  }}
                >
                  {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'].map(
                    (dayName) => {
                      const coursesOnDay = filteredSchedule.filter((item) => item.day === dayName);
                      return (
                        <td
                          key={dayName}
                          style={{
                            padding: '12px',
                            borderRight: '1px solid #e2e8f0',
                            borderBottom: '1px solid #f1f5f9',
                            verticalAlign: 'top',
                            backgroundColor: coursesOnDay.length > 0 ? '#ffffff' : '#fcfcfd',
                          }}
                        >
                          {coursesOnDay.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {coursesOnDay.map((course) => (
                                <div
                                  key={course.id}
                                  style={{
                                    padding: '8px 10px',
                                    borderRadius: '6px',
                                    backgroundColor: '#eff6ff',
                                    border: '1px solid #bfdbfe',
                                    borderLeft: '3px solid #2563eb',
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize: '12px',
                                      fontWeight: '600',
                                      color: '#1e40af',
                                      marginBottom: '4px',
                                    }}
                                  >
                                    {course.courseCode}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: '11px',
                                      color: '#1e293b',
                                      fontWeight: '500',
                                      marginBottom: '2px',
                                    }}
                                  >
                                    {course.courseName}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: '10px',
                                      color: '#64748b',
                                      marginBottom: '4px',
                                    }}
                                  >
                                    {getTimeSlot(course.periods)}
                                  </div>
                                  <div style={{ fontSize: '10px', color: '#64748b' }}>
                                    {course.room} | {course.periods} tiết
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div
                              style={{
                                color: '#cbd5e1',
                                fontSize: '12px',
                                padding: '20px 0',
                                textAlign: 'center',
                              }}
                            >
                              —
                            </div>
                          )}
                        </td>
                      );
                    }
                  )}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            marginTop: '32px',
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
              Lịch Học Chi Tiết
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
                  <th style={{ padding: '14px 24px', fontWeight: '600' }}>Thứ</th>
                  <th style={{ padding: '14px 24px', fontWeight: '600' }}>Mã MH</th>
                  <th style={{ padding: '14px 24px', fontWeight: '600' }}>Tên Môn Học</th>
                  <th style={{ padding: '14px 24px', fontWeight: '600' }}>Giờ Học</th>
                  <th style={{ padding: '14px 24px', fontWeight: '600' }}>Phòng</th>
                  <th style={{ padding: '14px 24px', fontWeight: '600' }}>Giảng Viên</th>
                  <th style={{ padding: '14px 24px', fontWeight: '600' }}>Loại</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchedule.length > 0 ? (
                  filteredSchedule.map((item, index) => (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#fcfcfd',
                      }}
                    >
                      <td style={{ padding: '16px 24px', color: '#1e293b', fontWeight: '600' }}>
                        {item.day}
                      </td>
                      <td
                        style={{
                          padding: '16px 24px',
                          fontFamily: 'monospace',
                          color: '#475569',
                          fontWeight: '500',
                        }}
                      >
                        {item.courseCode}
                      </td>
                      <td style={{ padding: '16px 24px', fontWeight: '600', color: '#1e293b' }}>
                        {item.courseName}
                      </td>
                      <td style={{ padding: '16px 24px', color: '#475569' }}>
                        {getTimeSlot(item.periods)}
                      </td>
                      <td style={{ padding: '16px 24px', color: '#475569' }}>{item.room}</td>
                      <td style={{ padding: '16px 24px', color: '#475569' }}>{item.lecturer}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontWeight: '600',
                            fontSize: '13px',
                            backgroundColor: '#eff6ff',
                            color: '#2563eb',
                            border: '1px solid #bfdbfe',
                          }}
                        >
                          {item.classType}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}
                    >
                      Không có dữ liệu thời khóa biểu cho học kỳ này.
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

export default TimetablePage;
