import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FaqPage from '../pages/support/FaqPage';
import * as faqService from '../services/faqService';

jest.mock('../services/faqService', () => ({
  getFaqById: jest.fn(),
  getFaqCategories: jest.fn(),
  getPopularFaqs: jest.fn(),
  searchFaqs: jest.fn(),
  submitFaqFeedback: jest.fn(),
}));

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: { success: jest.fn(), error: jest.fn() },
}));

const mockedFaqService = faqService as jest.Mocked<typeof faqService>;

describe('FAQ support flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedFaqService.getFaqCategories.mockResolvedValue(['Registration']);
    mockedFaqService.getPopularFaqs.mockResolvedValue([
      {
        faqId: 'demo-1',
        question: 'How do I drop or withdraw from a course?',
        answer: 'Use the course registration page to drop your course before the deadline.',
        category: 'Registration',
        tags: ['drop', 'withdraw'],
      },
    ]);
    mockedFaqService.searchFaqs.mockResolvedValue({
      content: [],
      totalPages: 0,
      totalElements: 0,
      page: 0,
    });
    mockedFaqService.getFaqById.mockResolvedValue({
      faqId: 'demo-1',
      question: 'How do I drop or withdraw from a course?',
      answer: 'Use the course registration page to drop your course before the deadline.',
      category: 'Registration',
      tags: ['drop', 'withdraw'],
    });

    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      value: jest.fn(),
      writable: true,
    });
  });

  it('scrolls to a popular topic after selecting it from the no-results state', async () => {
    const user = userEvent.setup();
    render(<FaqPage />);

    expect(await screen.findByText(/No results found/i)).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: /how do i drop or withdraw from a course/i })
    );

    await waitFor(() => {
      expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
    });
  });
});
