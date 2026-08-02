import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CoursesPage from '../pages/courses/CoursesPage';
import {
  dropRegistration,
  getCourses,
  getMyRegistrations,
  registerCourse,
} from '../services/courseService';
import type { CourseOffering, CourseRegistration, PagedResponse } from '../types';

jest.mock('../services/courseService');
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: { success: jest.fn(), error: jest.fn() },
}));

const mockedGetCourses = getCourses as jest.MockedFunction<typeof getCourses>;
const mockedGetMyRegistrations = getMyRegistrations as jest.MockedFunction<
  typeof getMyRegistrations
>;
const mockedRegisterCourse = registerCourse as jest.MockedFunction<typeof registerCourse>;
const mockedDropRegistration = dropRegistration as jest.MockedFunction<typeof dropRegistration>;

// Note: offeringId/courseCode are deliberately different from the component's
// built-in DEMO_OFFERINGS (offeringId 1001/1002, CS101/MATH230) so the fallback
// demo data used when the API returns an empty list never masks these fixtures.
const OFFERING: CourseOffering = {
  offeringId: 9001,
  section: 'A',
  term: 'Fall2026',
  schedule: 'Mon/Wed 09:00 - 10:30',
  instructor: 'Dr. Nguyen',
  location: 'Building A',
  room: '204',
  enrolledCount: 12,
  availableSeats: 8,
  course: {
    courseId: 9501,
    courseCode: 'CS900',
    courseName: 'Advanced Testing Techniques',
    description: 'A course used purely for integration test fixtures.',
    credits: 3,
    prerequisites: 'None',
    department: 'Computer Science',
    semester: 'Fall2026',
    capacity: 20,
  },
};

const PAGED_OFFERINGS: PagedResponse<CourseOffering> = {
  content: [OFFERING],
  totalElements: 1,
  totalPages: 1,
  page: 0,
  number: 0,
  size: 9,
};

const REGISTRATION: CourseRegistration = {
  registrationId: 3001,
  studentId: 12345,
  status: 'ENROLLED',
  registeredAt: new Date().toISOString(),
  offering: OFFERING,
};

describe('Course registration flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetCourses.mockResolvedValue(PAGED_OFFERINGS);
    mockedGetMyRegistrations.mockResolvedValue([]);
  });

  it('lists course offerings from the catalog', async () => {
    render(<CoursesPage />);

    expect(await screen.findByText('CS900')).toBeInTheDocument();
    expect(screen.getByText('Advanced Testing Techniques')).toBeInTheDocument();
    expect(screen.getByText('8 seats left')).toBeInTheDocument();
  });

  it('registers a student for a course and reflects it in My Registrations', async () => {
    const user = userEvent.setup();
    mockedRegisterCourse.mockResolvedValue(REGISTRATION);

    render(<CoursesPage />);
    await screen.findByText('CS900');

    // After registering, both offerings and "my registrations" are refetched.
    mockedGetMyRegistrations.mockResolvedValue([REGISTRATION]);

    await user.click(screen.getByRole('button', { name: /^register$/i }));

    await waitFor(() => expect(mockedRegisterCourse).toHaveBeenCalledWith(OFFERING.offeringId));
    expect(await screen.findByRole('button', { name: /registered/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /my registrations/i }));
    const row = (await screen.findByText('CS900')).closest('tr');
    expect(row).not.toBeNull();
    expect(within(row as HTMLElement).getByText('Enrolled')).toBeInTheDocument();
  });

  it('drops an active registration after confirmation', async () => {
    const user = userEvent.setup();
    mockedGetMyRegistrations.mockResolvedValue([REGISTRATION]);
    mockedDropRegistration.mockResolvedValue({ ...REGISTRATION, status: 'DROPPED' });
    window.confirm = jest.fn().mockReturnValue(true);

    render(<CoursesPage />);
    await user.click(await screen.findByRole('button', { name: /my registrations/i }));

    await user.click(await screen.findByRole('button', { name: /^drop$/i }));

    expect(window.confirm).toHaveBeenCalled();
    await waitFor(() =>
      expect(mockedDropRegistration).toHaveBeenCalledWith(REGISTRATION.registrationId)
    );
  });

  it('does not drop a registration when the confirmation is cancelled', async () => {
    const user = userEvent.setup();
    mockedGetMyRegistrations.mockResolvedValue([REGISTRATION]);
    window.confirm = jest.fn().mockReturnValue(false);

    render(<CoursesPage />);
    await user.click(await screen.findByRole('button', { name: /my registrations/i }));
    await user.click(await screen.findByRole('button', { name: /^drop$/i }));

    expect(window.confirm).toHaveBeenCalled();
    expect(mockedDropRegistration).not.toHaveBeenCalled();
  });

  it('disables the register button once a course offering is full', async () => {
    mockedGetCourses.mockResolvedValue({
      ...PAGED_OFFERINGS,
      content: [{ ...OFFERING, availableSeats: 0 }],
    });

    render(<CoursesPage />);

    const fullButton = await screen.findByRole('button', { name: /^full$/i });
    expect(fullButton).toBeDisabled();
  });
});
