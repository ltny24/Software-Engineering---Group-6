import type { ComponentType } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import toast from 'react-hot-toast';
import { getMyRegistrations } from '../services/courseService';
import type { CourseOffering, CourseRegistration } from '../types';

jest.mock('../services/courseService');
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: { success: jest.fn(), error: jest.fn() },
}));

const mockedGetMyRegistrations = getMyRegistrations as jest.MockedFunction<
  typeof getMyRegistrations
>;
const mockedToast = toast as jest.Mocked<typeof toast>;

const OFFERING: CourseOffering = {
  offeringId: 1001,
  section: 'A',
  term: 'Fall2026',
  schedule: 'Mon/Wed 09:00 - 10:30',
  instructor: 'Dr. Nguyen',
  location: 'Building A',
  room: '204',
  enrolledCount: 12,
  availableSeats: 8,
  course: {
    courseId: 501,
    courseCode: 'CS101',
    courseName: 'Introduction to Algorithms',
    description: 'Fundamentals of algorithms and problem solving.',
    credits: 3,
    prerequisites: 'None',
    department: 'Computer Science',
    semester: 'Fall2026',
    capacity: 20,
  },
};

const REGISTRATION: CourseRegistration = {
  registrationId: 3001,
  studentId: 12345,
  status: 'Enrolled',
  registeredAt: new Date().toISOString(),
  offering: OFFERING,
};

// TimetablePage (and its DEMO_EVENTS fallback) derives event placement from
// "the next occurrence of this weekday from today", computed once at module
// load. The system clock is pinned to a fixed Monday *before* the module is
// first required so both the demo events and the current displayed week land
// on the same days regardless of the real calendar date the suite runs on.
// Only `Date` is faked — timers stay real so RTL's async queries keep polling.
const FIXED_MONDAY = new Date(2026, 6, 6, 9, 0, 0);
let TimetablePage: ComponentType;

beforeAll(() => {
  jest.useFakeTimers({
    doNotFake: [
      'setTimeout',
      'clearTimeout',
      'setInterval',
      'clearInterval',
      'setImmediate',
      'clearImmediate',
      'nextTick',
      'queueMicrotask',
      'performance',
      'requestAnimationFrame',
      'cancelAnimationFrame',
      'requestIdleCallback',
      'cancelIdleCallback',
    ],
  });
  jest.setSystemTime(FIXED_MONDAY);

  TimetablePage = require('../pages/timetable/TimetablePage').default;
});

afterAll(() => {
  jest.useRealTimers();
});

describe('Timetable flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the weekly schedule built from the student registrations', async () => {
    mockedGetMyRegistrations.mockResolvedValue([REGISTRATION]);

    render(<TimetablePage />);

    expect(screen.getByText(/loading timetable/i)).toBeInTheDocument();
    expect(await screen.findByText('CS101')).toBeInTheDocument();
    expect(screen.getByText('Introduction to Algorithms')).toBeInTheDocument();
  });

  it('falls back to a demo schedule and warns when registrations fail to load', async () => {
    mockedGetMyRegistrations.mockRejectedValue(new Error('network error'));

    render(<TimetablePage />);

    await waitFor(() =>
      expect(mockedToast.error).toHaveBeenCalledWith(
        'Failed to load timetable. Showing demo schedule instead.'
      )
    );
    expect(await screen.findByText('CS101')).toBeInTheDocument();
  });

  it('navigates between weeks', async () => {
    mockedGetMyRegistrations.mockResolvedValue([REGISTRATION]);

    render(<TimetablePage />);
    await screen.findByText('CS101');

    const weekRangeEl = document.querySelector('.week-range') as HTMLElement;
    const initialRange = weekRangeEl.textContent;

    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(weekRangeEl.textContent).not.toBe(initialRange);

    fireEvent.click(screen.getByRole('button', { name: /prev/i }));
    expect(weekRangeEl.textContent).toBe(initialRange);
  });
});
