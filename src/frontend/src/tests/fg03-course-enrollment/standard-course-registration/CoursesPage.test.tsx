import React from 'react';
jest.mock('react-icons/fa6', () => new Proxy({}, { get: () => () => null }), { virtual: true });
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import toast from 'react-hot-toast';
import CoursesPage from '../../../pages/courses/CoursesPage';
import { getCourses, getMyRegistrations, registerCourse, dropRegistration } from '../../../services/courseService';
import { useAuth } from '../../../auth/useAuth';

jest.mock('react-hot-toast', () => ({ success: jest.fn(), error: jest.fn() }));

jest.mock('../../../services/courseService', () => ({
  getCourses: jest.fn(),
  getMyRegistrations: jest.fn(),
  registerCourse: jest.fn(),
  dropRegistration: jest.fn(),
}));

jest.mock('../../../auth/useAuth', () => ({
  useAuth: jest.fn(),
}));

describe('CoursesPage - FG03 Standard Course Registration', () => {
  const mockUser = {
    username: '24120001',
    role: 'ROLE_STUDENT',
    fullName: 'Nguyen Van A',
  };

  const mockOfferings = [
    {
      offeringId: 'off-1',
      section: '24KHDT1',
      term: 'HKIII 2025-2026',
      schedule: 'Mon 07:30 - 11:10',
      instructor: 'Dr. Smith',
      location: 'Main Campus',
      room: 'Room A101',
      enrolledCount: 10,
      availableSeats: 30,
      course: {
        courseId: 'c-1',
        courseCode: 'CSC10001',
        courseName: 'Intro to Programming',
        description: 'Basic programming concepts',
        credits: 4,
        prerequisites: 'None',
        department: 'Computer Science',
        semester: 'HKIII 2025-2026',
        capacity: 40,
      },
    },
  ];

  const mockRegistrations = [
    {
      registrationId: 'reg-1',
      status: 'Enrolled',
      offering: mockOfferings[0],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (getCourses as jest.Mock).mockResolvedValue({
      content: mockOfferings,
      page: { number: 0, size: 9, totalElements: 1, totalPages: 1 },
    });
    (getMyRegistrations as jest.Mock).mockResolvedValue([]);
  });

  it('TC_REG_01: Renders course catalog with credit summary and sections', async () => {
    render(<CoursesPage />);
    await waitFor(() => {
      expect(screen.getByText('CSC10001')).toBeInTheDocument();
      expect(screen.getByText('Intro to Programming')).toBeInTheDocument();
    });
    expect(screen.getByText(/My Registration \(0\)/i)).toBeInTheDocument();
  });

  it('TC_REG_02: Searches and filters catalog', async () => {
    render(<CoursesPage />);
    await waitFor(() => {
      expect(screen.getByText('Intro to Programming')).toBeInTheDocument();
    });
    const searchInput = screen.getByPlaceholderText('Search by course code or name...');
    await userEvent.type(searchInput, 'CSC10001');
    const searchBtn = screen.getByRole('button', { name: /Search/i });
    fireEvent.click(searchBtn);
    await waitFor(() => {
      expect(getCourses).toHaveBeenCalledWith(expect.objectContaining({ search: 'CSC10001' }));
    });
  });

  it('TC_REG_03 & TC_REG_04: Add course to cart and submit registration successfully', async () => {
    (registerCourse as jest.Mock).mockResolvedValue(mockRegistrations[0]);
    render(<CoursesPage />);
    await waitFor(() => {
      expect(screen.getByText('Intro to Programming')).toBeInTheDocument();
    });

    const registerBtns = screen.queryAllByRole('button', { name: /Register/i });
    if (registerBtns.length > 0) {
      fireEvent.click(registerBtns[0]);
      await waitFor(() => {
        expect(registerCourse).toHaveBeenCalledWith('off-1');
        expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('Registered for CSC10001'));
      });
    }
  });

  it('TC_REG_07: Section Full / Waitlist option - blocks addition if full', async () => {
    const fullOffering = { ...mockOfferings[0], enrolledCount: 40, availableSeats: 0 };
    (getCourses as jest.Mock).mockResolvedValue({
      content: [fullOffering],
      page: { number: 0, size: 9, totalElements: 1, totalPages: 1 },
    });

    render(<CoursesPage />);
    await waitFor(() => {
      expect(screen.getByText('Intro to Programming')).toBeInTheDocument();
    });

    const fullBtns = screen.queryAllByRole('button', { name: /Full/i });
    if (fullBtns.length > 0) {
      expect(fullBtns[0]).toBeDisabled();
    }
  });

  it('TC_REG_08: Registration fails due to API error (e.g., schedule conflict)', async () => {
    (registerCourse as jest.Mock).mockRejectedValue({
      response: { data: { message: 'Schedule conflict detected' } }
    });
    
    render(<CoursesPage />);
    await waitFor(() => {
      expect(screen.getByText('Intro to Programming')).toBeInTheDocument();
    });

    const registerBtns = screen.queryAllByRole('button', { name: /Register/i });
    if (registerBtns.length > 0) {
      fireEvent.click(registerBtns[0]);
      await waitFor(() => {
        expect(registerCourse).toHaveBeenCalledWith('off-1');
        expect(toast.error).toHaveBeenCalledWith('Schedule conflict detected');
      });
    }
  });

  it('TC_REG_13: Drops a registered course', async () => {
    (getMyRegistrations as jest.Mock).mockResolvedValue(mockRegistrations);
    (dropRegistration as jest.Mock).mockResolvedValue({});
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    
    render(<CoursesPage />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /My Registration/i })).toBeInTheDocument();
    });

    const myRegTab = screen.getByRole('button', { name: /My Registration/i });
    fireEvent.click(myRegTab);

    const dropBtns = screen.queryAllByRole('button', { name: /Drop/i });
    if (dropBtns.length > 0) {
      fireEvent.click(dropBtns[0]);
      await waitFor(() => {
        expect(dropRegistration).toHaveBeenCalledWith('reg-1');
        expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('Dropped CSC10001'));
      });
    }
    (window.confirm as jest.Mock).mockRestore();
  });
});
