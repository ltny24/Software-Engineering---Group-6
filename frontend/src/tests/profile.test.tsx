import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import toast from 'react-hot-toast';
import ProfilePage from '../pages/profile/ProfilePage';
import api from '../services/api';

jest.mock('../services/api');
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: { success: jest.fn(), error: jest.fn() },
}));

const mockedApi = api as jest.Mocked<typeof api>;
const mockedToast = toast as jest.Mocked<typeof toast>;

const PROFILE = {
  id: 1,
  username: 'stu001',
  email: 'stu001@myus.edu',
  firstName: 'An',
  middleName: '',
  lastName: 'Nguyen',
  phone: '0900000000',
  address: '123 Main St',
  dateOfBirth: '2000-01-01',
  studentType: 'Undergraduate',
  major: 'Computer Science',
  enrollmentStatus: 'Active',
  registrationStatus: 'Registered',
};

describe('Profile management flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedApi.get.mockResolvedValue(PROFILE);
    mockedApi.put.mockResolvedValue({});
  });

  it('loads and displays the student profile', async () => {
    render(<ProfilePage />);

    expect(screen.getByText(/loading profile/i)).toBeInTheDocument();

    await waitFor(() => expect(mockedApi.get).toHaveBeenCalledWith('/v1/profile'));

    expect(await screen.findByText('stu001')).toBeInTheDocument();
    expect(screen.getByText('Computer Science')).toBeInTheDocument();
    expect(screen.getByText('0900000000')).toBeInTheDocument();
  });

  it('lets a student edit and save their contact info', async () => {
    const user = userEvent.setup();
    render(<ProfilePage />);

    await screen.findByText('stu001');

    await user.click(screen.getByRole('button', { name: /edit contact info/i }));

    const phoneInput = screen.getByPlaceholderText(/enter phone number/i);
    await user.clear(phoneInput);
    await user.type(phoneInput, '0911111111');

    const addressInput = screen.getByPlaceholderText(/enter home address/i);
    await user.clear(addressInput);
    await user.type(addressInput, '456 New Address');

    await user.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() =>
      expect(mockedApi.put).toHaveBeenCalledWith('/v1/profile', {
        phone: '0911111111',
        address: '456 New Address',
      })
    );

    // Profile is refetched after a successful save.
    await waitFor(() => expect(mockedApi.get).toHaveBeenCalledTimes(2));
    expect(screen.getByRole('button', { name: /edit contact info/i })).toBeInTheDocument();
  });

  it('shows an error toast when the profile fails to load', async () => {
    mockedApi.get.mockRejectedValueOnce(new Error('network error'));

    render(<ProfilePage />);

    await waitFor(() =>
      expect(mockedToast.error).toHaveBeenCalledWith('Failed to load profile data.')
    );
  });

  it('shows an error toast when saving fails', async () => {
    const user = userEvent.setup();
    mockedApi.put.mockRejectedValueOnce(new Error('network error'));

    render(<ProfilePage />);
    await screen.findByText('stu001');

    await user.click(screen.getByRole('button', { name: /edit contact info/i }));
    await user.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() =>
      expect(mockedToast.error).toHaveBeenCalledWith('Failed to update profile.')
    );
    // Still in editing mode since the save failed.
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
  });
});
