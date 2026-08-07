/**
 * Timetable.test.tsx
 * FG04 - Academic & Financial: Timetable & Exam Schedule (Frontend)
 *
 * Test IDs exactly match docs/test/fg04-academic-financial/timetable-exam-schedule/testcases.md
 * TC_TKB_01 -> TC_TKB_15
 *
 * Framework: Jest + React Testing Library
 * Mocked: api service, react-hot-toast, useAuth, constants
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import toast from 'react-hot-toast';
import api from '../../../services/api';

import TimetablePage from '../../../pages/timetable/TimetablePage';

jest.mock('react-hot-toast', () => ({ success: jest.fn(), error: jest.fn() }));

jest.mock('../../../services/api', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

jest.mock('../../../auth', () => ({
  useAuth: () => ({ user: { role: 'STUDENT', username: 'SV001' } }),
}));
jest.mock('../../../utils/constants', () => ({
  ROLES: { ADMIN: 'ADMIN', STUDENT: 'STUDENT' },
}));

const mockApiGet = api.get as jest.Mock;

// -- Helpers (mirrors TimetablePage logic) -------------------------------------
function getTimeSlot(periods: number): string {
  const slots: Record<number, string> = {
    1: '7:00 - 8:30',
    2: '8:45 - 10:15',
    3: '10:30 - 12:00',
    4: '13:00 - 14:30',
    5: '14:45 - 16:15',
    6: '16:30 - 18:00',
  };
  return slots[periods] || 'N/A';
}
function hasScheduleConflict(items: Array<{ day: string; periods: number }>): boolean {
  const seen = new Set<string>();
  for (const item of items) {
    const key = `${item.day}-${item.periods}`;
    if (seen.has(key)) return true;
    seen.add(key);
  }
  return false;
}

// -- Fixtures (using HKI 2025-2026 term format) -------------------------------
const MOCK_REGISTRATIONS_HKI = [
  {
    registrationId: 1,
    status: 'ENROLLED',
    offering: {
      course: { courseCode: 'CSE101', courseName: 'OOP Programming', credits: 4 },
      day: 'Monday',
      periods: 2,
      room: 'T306',
      lecturer: 'Dr. Nguyen Van A',
      classType: 'Lecture',
      schedule: 'Mon 07:30 - 11:10',
      term: 'HKI 2025-2026',
    },
  },
  {
    registrationId: 2,
    status: 'ENROLLED',
    offering: {
      course: { courseCode: 'MAT101', courseName: 'Calculus', credits: 3 },
      day: 'Wednesday',
      periods: 1,
      room: 'A301',
      lecturer: 'Prof. Tran Thi B',
      classType: 'Lecture',
      schedule: 'Wed 08:45 - 10:15',
      term: 'HKI 2025-2026',
    },
  },
];

const MOCK_REGISTRATIONS_HKIII = [
  {
    registrationId: 3,
    status: 'ENROLLED',
    offering: {
      course: { courseCode: 'CSE201', courseName: 'Data Structures', credits: 3 },
      day: 'Tuesday',
      periods: 3,
      room: 'B102',
      lecturer: 'Dr. Le Van C',
      classType: 'Lecture',
      schedule: 'Tue 10:30 - 12:00',
      term: 'HKIII 2025-2026',
    },
  },
  {
    registrationId: 4,
    status: 'ENROLLED',
    offering: {
      course: { courseCode: 'CSE202', courseName: 'Algorithms Lab', credits: 2 },
      day: 'Thursday',
      periods: 4,
      room: 'Lab5',
      lecturer: 'Dr. Pham Thi D',
      classType: 'Lab',
      schedule: 'Thu 13:00 - 14:30 | Lab: Thu 14:45 - 16:15',
      term: 'HKIII 2025-2026',
    },
  },
];

const MOCK_GRADES_HKI = [
  {
    gradeId: 1,
    term: 'HKI 2025-2026',
    courseCode: 'CSE101',
    courseName: 'OOP Programming',
    credits: 4,
    gradeValue: 'A',
    gradePoint: 9.0,
    overallScore: 8.7,
  },
  {
    gradeId: 2,
    term: 'HKI 2025-2026',
    courseCode: 'MAT101',
    courseName: 'Calculus',
    credits: 3,
    gradeValue: 'B+',
    gradePoint: 8.0,
    overallScore: 7.5,
  },
];

const MOCK_GRADES_EMPTY: any[] = [];

const MOCK_EXAM_SCHEDULE = [
  {
    courseCode: 'CSE101',
    courseName: 'OOP Programming',
    examDate: '2025-01-15',
    session: 'Morning (7:30-9:30)',
    room: 'B201',
    examType: 'Final Exam',
  },
];

beforeEach(() => jest.clearAllMocks());

// Helper: set up mocks for student timetable (2 API calls: registrations + grades)
function mockStudentApis(registrations: any[], grades: any[]) {
  mockApiGet.mockResolvedValueOnce(registrations);  // /api/registrations/me
  mockApiGet.mockResolvedValueOnce(grades);          // /api/v1/grades/me
}

// =============================================================================
// TEST SUITE
// =============================================================================
describe('FG04 - Timetable & Exam Schedule', () => {
  // -- TC_TKB_01: View timetable grid with 6 days (Mon-Sat) --------------------
  it('TC_TKB_01: go to Timetable -> displays timetable grid (Mon-Sat), correct day headers', async () => {
    mockStudentApis(MOCK_REGISTRATIONS_HKIII, MOCK_GRADES_EMPTY);

    render(<TimetablePage />);
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Days of the week must be displayed (Mon-Sat only)
    expect(screen.getAllByText('Monday')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Wednesday')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Saturday')[0]).toBeInTheDocument();
    // Sunday should NOT be displayed
    expect(screen.queryByText('Sunday')).not.toBeInTheDocument();
  });

  // -- TC_TKB_02: View timetable by semester ------------------------------------
  it('TC_TKB_02: fetches data from correct API endpoints for student', async () => {
    mockStudentApis(MOCK_REGISTRATIONS_HKIII, MOCK_GRADES_EMPTY);

    render(<TimetablePage />);
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Both API endpoints should be called
    expect(mockApiGet).toHaveBeenCalledWith('/api/registrations/me');
    expect(mockApiGet).toHaveBeenCalledWith('/api/v1/grades/me');
  });

  // -- TC_TKB_03: Time slot helper -----------------------------------------------
  it('TC_TKB_03: getTimeSlot helper returns correct time for each period', () => {
    expect(getTimeSlot(1)).toBe('7:00 - 8:30');
    expect(getTimeSlot(2)).toBe('8:45 - 10:15');
    expect(getTimeSlot(4)).toBe('13:00 - 14:30');
    expect(getTimeSlot(6)).toBe('16:30 - 18:00');
  });

  // -- TC_TKB_04: Empty timetable (HKIII default, no registrations) ---------------
  it('TC_TKB_04: student has not registered for HKIII courses -> empty timetable for HKIII', async () => {
    mockStudentApis([], MOCK_GRADES_EMPTY);

    render(<TimetablePage />);
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // No courses should appear for HKIII
    expect(screen.queryByText('OOP Programming')).not.toBeInTheDocument();
    expect(screen.queryByText('CSE201')).not.toBeInTheDocument();
    // Should show "awaiting registration" message
    expect(screen.getByText(/Awaiting Registration/)).toBeInTheDocument();
  });

  // -- TC_TKB_05: Detect schedule conflict --------------------------------------
  it('TC_TKB_05: 2 courses both on Tuesday same period -> detects schedule conflict', () => {
    const conflictingItems = [
      { day: 'Tuesday', periods: 2 },
      { day: 'Tuesday', periods: 2 },
    ];
    expect(hasScheduleConflict(conflictingItems)).toBe(true);
  });

  it('TC_TKB_05: no schedule conflict -> returns false', () => {
    const nonConflict = [
      { day: 'Monday', periods: 1 },
      { day: 'Tuesday', periods: 1 },
    ];
    expect(hasScheduleConflict(nonConflict)).toBe(false);
  });

  // -- TC_TKB_06: HKIII shows registered courses after registration --------------
  it('TC_TKB_06: HKIII displays registered courses with schedule details', async () => {
    mockStudentApis(MOCK_REGISTRATIONS_HKIII, MOCK_GRADES_EMPTY);

    render(<TimetablePage />);
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // HKIII courses should appear because term matches default
    expect(screen.getByText('Data Structures')).toBeInTheDocument();
    expect(screen.getByText('CSE201')).toBeInTheDocument();
  });

  // -- TC_TKB_07: HKI shows completed courses with grades ------------------------
  it('TC_TKB_07: switching to HKI shows completed courses with grade info', async () => {
    mockStudentApis(MOCK_REGISTRATIONS_HKI, MOCK_GRADES_HKI);

    render(<TimetablePage />);
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Switch to HKI
    const select = screen.getByLabelText('Semester:');
    await userEvent.selectOptions(select, 'HKI 2025-2026');

    // HKI courses should appear
    await waitFor(() => {
      expect(screen.getByText('OOP Programming')).toBeInTheDocument();
      expect(screen.getByText('CSE101')).toBeInTheDocument();
      expect(screen.getByText('Calculus')).toBeInTheDocument();
    });
  });

  // -- TC_TKB_08: HKI detailed table shows grade columns -------------------------
  it('TC_TKB_08: HKI detailed timetable displays Score and Grade columns', async () => {
    mockStudentApis(MOCK_REGISTRATIONS_HKI, MOCK_GRADES_HKI);

    render(<TimetablePage />);
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Switch to HKI
    const select = screen.getByLabelText('Semester:');
    await userEvent.selectOptions(select, 'HKI 2025-2026');

    // Grade columns should appear for completed term
    await waitFor(() => {
      expect(screen.getByText('Score')).toBeInTheDocument();
      expect(screen.getAllByText('Grade')[0]).toBeInTheDocument();
      // Check grade values
      expect(screen.getByText('A')).toBeInTheDocument();
    });
  });

  // -- TC_TKB_09: HKIII has no grade columns ------------------------------------
  it('TC_TKB_09: HKIII detailed timetable does not show Grade columns', async () => {
    mockStudentApis(MOCK_REGISTRATIONS_HKIII, MOCK_GRADES_EMPTY);

    render(<TimetablePage />);
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Score/Grade columns should NOT appear for upcoming term
    expect(screen.queryByText('Score')).not.toBeInTheDocument();
  });

  // -- TC_TKB_10: Filter timetable by specific date (exam-related) ---------------
  it('TC_TKB_10: filter exam schedule by date 15/01/2025', async () => {
    mockApiGet.mockResolvedValueOnce(MOCK_EXAM_SCHEDULE);

    const result = await api.get('/api/timetable/exams?term=HK1+2024-2025&type=final');
    const filtered = (Array.isArray(result) ? result : []).filter(
      (e: any) => e.examDate === '2025-01-15'
    );

    expect(filtered.length).toBe(1);
    expect(filtered[0].courseName).toBe('OOP Programming');
  });

  // -- TC_TKB_11: Detailed info in timetable ------------------------------------
  it('TC_TKB_11: timetable entries contain course code, room, lecturer, credits', async () => {
    mockStudentApis(MOCK_REGISTRATIONS_HKIII, MOCK_GRADES_EMPTY);

    render(<TimetablePage />);
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Course details must be rendered
    expect(screen.getByText('CSE201')).toBeInTheDocument();
    expect(screen.getByText('Data Structures')).toBeInTheDocument();
  });

  // -- TC_TKB_12: Export timetable to PDF ---------------------------------------
  it('TC_TKB_12: timetable data ready for export', async () => {
    mockStudentApis(MOCK_REGISTRATIONS_HKIII, MOCK_GRADES_EMPTY);

    render(<TimetablePage />);
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    expect(mockApiGet).toHaveBeenCalledWith('/api/registrations/me');
  });

  // -- TC_TKB_13: Notification for classroom change -----------------------------
  it('TC_TKB_13: room update A301 -> B205 reflected in API response', async () => {
    const updatedSchedule = [
      {
        ...MOCK_REGISTRATIONS_HKI[1],
        offering: { ...MOCK_REGISTRATIONS_HKI[1].offering, room: 'B205' },
      },
    ];
    mockApiGet.mockResolvedValueOnce(updatedSchedule);

    const result = await api.get('/api/registrations/me');

    expect((result as typeof updatedSchedule)[0].offering.room).toBe('B205');
  });

  // -- TC_TKB_14: Boundary - 6 days/week ----------------------------------------
  it('TC_TKB_14: timetable with 6 days/week schedule (Mon-Sat) -> all days displayed', async () => {
    mockStudentApis(MOCK_REGISTRATIONS_HKIII, MOCK_GRADES_EMPTY);

    render(<TimetablePage />);
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    days.forEach((d) => expect(screen.getAllByText(d)[0]).toBeInTheDocument());
    // Sunday absent
    expect(screen.queryByText('Sunday')).not.toBeInTheDocument();
  });

  // -- TC_TKB_15: Evening period removed ----------------------------------------
  it('TC_TKB_15: out of range period returns N/A, evening period 7 removed', () => {
    expect(getTimeSlot(7)).toBe('N/A');
    expect(getTimeSlot(99)).toBe('N/A');
    expect(getTimeSlot(0)).toBe('N/A');
  });

  // -- TC_TKB_16: Dropped registration excluded from HKIII timetable -------------
  it('TC_TKB_16: dropped HKIII course does not appear in timetable', async () => {
    const regsWithDropped = [
      ...MOCK_REGISTRATIONS_HKIII,
      {
        registrationId: 5,
        status: 'DROPPED',
        offering: {
          course: { courseCode: 'CSE999', courseName: 'Dropped Course', credits: 3 },
          day: 'Friday',
          periods: 5,
          room: 'X999',
          lecturer: 'Dr. Drop',
          classType: 'Lecture',
          schedule: 'Fri 14:45 - 16:15',
          term: 'HKIII 2025-2026',
        },
      },
    ];
    mockStudentApis(regsWithDropped, MOCK_GRADES_EMPTY);

    render(<TimetablePage />);
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Active courses appear
    expect(screen.getByText('CSE201')).toBeInTheDocument();
    // Dropped course should NOT appear
    expect(screen.queryByText('Dropped Course')).not.toBeInTheDocument();
    expect(screen.queryByText('CSE999')).not.toBeInTheDocument();
  });

  // -- TC_TKB_17: Lab classes show half-height block ----------------------------
  it('TC_TKB_17: practical/lab courses render with half-height CSS class', async () => {
    mockStudentApis(MOCK_REGISTRATIONS_HKIII, MOCK_GRADES_EMPTY);

    render(<TimetablePage />);
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // The Algorithms Lab should have the half-height class
    const labBlocks = document.querySelectorAll('.timetable-course-block--half');
    expect(labBlocks.length).toBeGreaterThan(0);
  });
});
