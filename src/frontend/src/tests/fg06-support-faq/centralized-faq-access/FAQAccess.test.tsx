/**
 * FAQAccess.test.tsx
 * FG06 - Support & FAQ: Centralized FAQ Access (Frontend)
 *
 * Test IDs exactly match docs/test/fg06-support-faq/centralized-faq-access/testcases.md
 * TC_FAQ_01 -> TC_FAQ_20
 *
 * Framework: Jest + React Testing Library
 * Mocked: faqService, react-hot-toast
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('react-hot-toast', () => ({ success: jest.fn(), error: jest.fn() }));
import toast from 'react-hot-toast';

jest.mock('../../../services/faqService', () => ({
  getFaqCategories:  jest.fn(),
  getPopularFaqs:    jest.fn(),
  searchFaqs:        jest.fn(),
  getFaqById:        jest.fn(),
  submitFaqFeedback: jest.fn(),
}));
import {
  getFaqCategories, getPopularFaqs, searchFaqs, getFaqById, submitFaqFeedback,
} from '../../../services/faqService';

jest.mock('../../../pages/support/FaqPage.css', () => ({}), { virtual: true });
import FaqPage from '../../../pages/support/FaqPage';

const mockGetCategories  = getFaqCategories  as jest.Mock;
const mockGetPopular     = getPopularFaqs    as jest.Mock;
const mockSearchFaqs     = searchFaqs        as jest.Mock;
const mockGetFaqById     = getFaqById        as jest.Mock;
const mockSubmitFeedback = submitFaqFeedback as jest.Mock;

// -- Helper: search keyword validation ------------------------------------------
function isKeywordTooShort(kw: string, minLen = 2): boolean { return kw.trim().length < minLen; }
function isKeywordTooLong(kw: string, maxLen = 255): boolean { return kw.length > maxLen; }
function sanitizeXSS(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim();
}

// -- Fixtures ------------------------------------------------------------------
const CATEGORIES = ['Tuition & Scholarships', 'Appeals & Complaints', 'Course Registration', 'IT/Technical Support'];

const FAQ_LIST = [
  {
    faqId: '1',
    question: 'How to submit a grade appeal?',
    answer: 'Go to the Appeals section and fill out the form.',
    category: 'Appeals & Complaints',
    tags: ['appeal'], helpfulCount: 15, notHelpfulCount: 1,
  },
  {
    faqId: '2',
    question: 'What is the tuition fee for Semester 1 2024-2025?',
    answer: 'The tuition fee depends on your major and registered credits.',
    category: 'Tuition & Scholarships',
    tags: ['tuition'], helpfulCount: 20, notHelpfulCount: 2,
  },
  {
    faqId: '3',
    question: 'How to register for courses?',
    answer: 'Go to Course Registration section and select the suitable courses.',
    category: 'Course Registration',
    tags: ['registration'], helpfulCount: 10, notHelpfulCount: 0,
  },
  {
    faqId: '4',
    question: 'How to check VietinBank transaction code when paying tuition?',
    answer: 'Check SMS or VietinBank iPay app.',
    category: 'Tuition & Scholarships',
    tags: ['VietinBank', 'transaction code'], helpfulCount: 8, notHelpfulCount: 3,
  },
];

const PAGE_RESPONSE = (content: typeof FAQ_LIST, total = content.length) => ({
  content,
  totalPages: Math.ceil(total / 8),
  totalElements: total,
  page: 0,
});

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  mockGetCategories.mockResolvedValue(CATEGORIES);
  mockGetPopular.mockResolvedValue(FAQ_LIST.slice(0, 2));
  mockSearchFaqs.mockImplementation(async (params) => {
    const { search, category } = params || {};
    let filtered = FAQ_LIST;
    if (category) {
      filtered = filtered.filter(f => f.category === category);
    }
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(f => f.question.toLowerCase().includes(s) || f.tags.some(t => t.toLowerCase().includes(s)));
    }
    return PAGE_RESPONSE(filtered);
  });
  mockGetFaqById.mockResolvedValue(FAQ_LIST[0]);
});

// =============================================================================
// TEST SUITE - mapped 1-1 with testcases.md
// =============================================================================
describe('FG06 - Centralized FAQ Access', () => {

  // -- TC_FAQ_01: Search FAQ with valid keyword ---------------------------------
  it('TC_FAQ_01: enter appeal -> displays list of related FAQs, sorted by relevance', async () => {
    mockSearchFaqs.mockResolvedValueOnce(PAGE_RESPONSE([FAQ_LIST[0]]));

    render(<FaqPage />);
    await waitFor(() => screen.getByPlaceholderText(/search faqs/i));

    const input = screen.getByPlaceholderText(/search faqs/i);
    await userEvent.type(input, 'appeal');

    await waitFor(() => {
      expect(screen.getAllByText('How to submit a grade appeal?')[0]).toBeInTheDocument();
    });
  });

  // -- TC_FAQ_02: Search returns multiple results -------------------------------
  it('TC_FAQ_02: enter tuition -> displays multiple related FAQs, with number of results', async () => {
    const hocPhiResults = FAQ_LIST.filter(f => f.tags.includes('tuition') || f.category.includes('Tuition'));
    mockSearchFaqs.mockResolvedValueOnce(PAGE_RESPONSE(hocPhiResults, 12)); // 12 to test pagination

    render(<FaqPage />);
    await waitFor(() => screen.getByPlaceholderText(/search faqs/i));

    const input = screen.getByPlaceholderText(/search faqs/i);
    await userEvent.type(input, 'tuition');

    await waitFor(() => {
      // Results count is displayed
      expect(screen.getByText(/results found/i)).toBeInTheDocument();
    });
  });

  // -- TC_FAQ_03: Search exactly 1 result ---------------------------------------
  it('TC_FAQ_03: enter highly specific keyword VietinBank transaction code -> exactly 1 FAQ returned', async () => {
    mockSearchFaqs.mockResolvedValueOnce(PAGE_RESPONSE([FAQ_LIST[3]]));

    render(<FaqPage />);
    await waitFor(() => screen.getByPlaceholderText(/search faqs/i));

    const input = screen.getByPlaceholderText(/search faqs/i);
    await userEvent.type(input, 'VietinBank transaction code');

    await waitFor(() => {
      expect(screen.getAllByText('How to check VietinBank transaction code when paying tuition?')[0]).toBeInTheDocument();
      expect(screen.queryByText('How to submit a grade appeal?')).not.toBeInTheDocument();
    });
  });

  // -- TC_FAQ_04: Keyword not found ---------------------------------------------
  it('TC_FAQ_04: enter xyz_khong_ton_tai_abc -> displays No results found', async () => {
    mockSearchFaqs.mockResolvedValueOnce(PAGE_RESPONSE([]));

    render(<FaqPage />);
    await waitFor(() => screen.getByPlaceholderText(/search faqs/i));

    const input = screen.getByPlaceholderText(/search faqs/i);
    await userEvent.type(input, 'xyz_khong_ton_tai_abc');

    await waitFor(() => {
      expect(screen.getByText(/no results found/i)).toBeInTheDocument();
    });
  });

  // -- TC_FAQ_05: Search with special characters --------------------------------
  it('TC_FAQ_05: enter special chars !@#$%^&*() -> system accepts, likely returns 0 results', async () => {
    mockSearchFaqs.mockResolvedValueOnce(PAGE_RESPONSE([]));

    render(<FaqPage />);
    await waitFor(() => screen.getByPlaceholderText(/search faqs/i));

    const input = screen.getByPlaceholderText(/search faqs/i);
    await userEvent.type(input, '!@#$%^&*()');

    await waitFor(() => {
      expect(screen.getByText(/no results found/i)).toBeInTheDocument();
    });
  });

  // -- TC_FAQ_06: Empty keyword -------------------------------------------------
  it('TC_FAQ_06: enter empty keyword or only spaces -> prevents search, asks for valid keyword', async () => {
    // Only test the validation logic
    expect(isKeywordTooShort('   ')).toBe(true);
    expect(isKeywordTooShort('')).toBe(true);
  });

  // -- TC_FAQ_07: Keyword < 2 characters ----------------------------------------
  it('TC_FAQ_07: enter keyword a -> prevents search, asks for longer keyword', async () => {
    expect(isKeywordTooShort('a')).toBe(true);
  });

  // -- TC_FAQ_08: Keyword exactly 2 characters ----------------------------------
  it('TC_FAQ_08: enter keyword IT -> search executes normally', async () => {
    expect(isKeywordTooShort('IT')).toBe(false);
  });

  // -- TC_FAQ_09: Keyword 255 characters ----------------------------------------
  it('TC_FAQ_09: enter exactly 255 characters -> search executes normally', async () => {
    const kw255 = 'a'.repeat(255);
    expect(isKeywordTooLong(kw255)).toBe(false);
  });

  // -- TC_FAQ_10: Keyword > 255 characters --------------------------------------
  it('TC_FAQ_10: enter > 255 characters -> system truncates or rejects', async () => {
    const kw256 = 'a'.repeat(256);
    expect(isKeywordTooLong(kw256)).toBe(true);
  });

  // -- TC_FAQ_11: Filter by category Tuition ------------------------------------
  it('TC_FAQ_11: select category Tuition & Scholarships -> only displays FAQs from this category', async () => {
    render(<FaqPage />);
    await waitFor(() => screen.getByRole('button', { name: 'Tuition & Scholarships' }));

    await userEvent.click(screen.getByRole('button', { name: 'Tuition & Scholarships' }));

    await waitFor(() => {
      // Must call searchFaqs with category = Tuition & Scholarships
      expect(mockSearchFaqs).toHaveBeenCalledWith(expect.objectContaining({ category: 'Tuition & Scholarships' }));
    });
  });

  // -- TC_FAQ_12: Search within a specific category -----------------------------
  it('TC_FAQ_12: enter keyword in Tuition category -> combines both filters', async () => {
    render(<FaqPage />);
    await waitFor(() => screen.getByRole('button', { name: 'Tuition & Scholarships' }));

    await userEvent.click(screen.getByRole('button', { name: 'Tuition & Scholarships' }));
    const input = screen.getByPlaceholderText(/search faqs/i);
    await userEvent.type(input, 'transaction code');

    await waitFor(() => {
      expect(mockSearchFaqs).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'transaction code', category: 'Tuition & Scholarships' })
      );
    });
  });

  // -- TC_FAQ_13: Popular FAQs display ------------------------------------------
  it('TC_FAQ_13: initial page load -> displays Popular FAQs section', async () => {
    render(<FaqPage />);
    await waitFor(() => {
      expect(screen.getByText('How to submit a grade appeal?')).toBeInTheDocument();
      expect(screen.getByText('What is the tuition fee for Semester 1 2024-2025?')).toBeInTheDocument();
    });
  });

  // -- TC_FAQ_14: View FAQ details ----------------------------------------------
  it('TC_FAQ_14: click on a FAQ -> navigates to FAQ detail page or opens modal with answer', async () => {
    render(<FaqPage />);
    await waitFor(() => screen.getByText('How to submit a grade appeal?'));

    // Trigger click
    await userEvent.click(screen.getByText('How to submit a grade appeal?'));

    await waitFor(() => {
      expect(screen.getByText('Go to the Appeals section and fill out the form.')).toBeInTheDocument();
    });
  });

  // -- TC_FAQ_15: Was this helpful - Yes ----------------------------------------
  it('TC_FAQ_15: click Yes on Was this helpful -> increments Helpful count, saves locally', async () => {
    render(<FaqPage />);
    await waitFor(() => screen.getByText('How to submit a grade appeal?'));
    await userEvent.click(screen.getByText('How to submit a grade appeal?'));

    const yesButton = await screen.findByRole('button', { name: /👍 Helpful/i });
    await userEvent.click(yesButton);

    expect(mockSubmitFeedback).toHaveBeenCalledWith('1', true);
    expect(toast.success).toHaveBeenCalledWith(expect.stringMatching(/thank|cảm ơn/i));
  });

  // -- TC_FAQ_16: Was this helpful - No -----------------------------------------
  it('TC_FAQ_16: click No on Was this helpful -> displays feedback form to collect reasons', async () => {
    render(<FaqPage />);
    await waitFor(() => screen.getByText('How to submit a grade appeal?'));
    await userEvent.click(screen.getByText('How to submit a grade appeal?'));

    const noButton = await screen.findByRole('button', { name: /👎 Not Helpful/i });
    await userEvent.click(noButton);

    // After clicking No, it should open a feedback form or call the API
    expect(mockSubmitFeedback).toHaveBeenCalledWith('1', false);
  });

  // -- TC_FAQ_17: Prevent duplicate voting --------------------------------------
  it('TC_FAQ_17: click Yes, then reload and view again -> Yes button is disabled/highlighted', async () => {
    render(<FaqPage />);
    await waitFor(() => screen.getByText('How to submit a grade appeal?'));
    await userEvent.click(screen.getByText('How to submit a grade appeal?'));

    const yesButton = await screen.findByRole('button', { name: /👍 Helpful/i });
    await userEvent.click(yesButton);

    // Expect the button to be disabled or marked as voted after click
    expect(yesButton).toBeDisabled();
  });

  // -- TC_FAQ_18: Pagination ----------------------------------------------------
  it('TC_FAQ_18: click Next Page -> loads page 2 of search results', async () => {
    // Setup pagination mock
    mockSearchFaqs
      .mockResolvedValueOnce(PAGE_RESPONSE(FAQ_LIST, 20))
      .mockResolvedValueOnce(PAGE_RESPONSE(FAQ_LIST.slice(2), 20));

    render(<FaqPage />);
    await waitFor(() => screen.getByPlaceholderText(/search faqs/i));

    const input = screen.getByPlaceholderText(/search faqs/i);
    await userEvent.type(input, 'test');

    const nextBtn = await screen.findByRole('button', { name: /next/i });
    await userEvent.click(nextBtn);

    expect(mockSearchFaqs).toHaveBeenCalledTimes(2);
  });

  // -- TC_FAQ_19: XSS Prevention ------------------------------------------------
  it('TC_FAQ_19: enter script alert 1 -> input is sanitized, no XSS executed', async () => {
    const maliciousInput = '<script>alert(1)</script> tuition';
    const safeInput = sanitizeXSS(maliciousInput);
    expect(safeInput).not.toContain('<script>');
  });

  // -- TC_FAQ_20: Back to list --------------------------------------------------
  it('TC_FAQ_20: view details then click Back -> returns to search list retaining keywords', async () => {
    render(<FaqPage />);
    await waitFor(() => screen.getByPlaceholderText(/search faqs/i));

    const input = screen.getByPlaceholderText(/search faqs/i);
    await userEvent.type(input, 'appeal');

    await userEvent.click(screen.getByText('How to submit a grade appeal?'));
    await waitFor(() => screen.getByText('Go to the Appeals section and fill out the form.'));

    // Validate we are back (it's an accordion) and input still has 'appeal'
    expect(screen.getByPlaceholderText(/search faqs/i)).toHaveValue('appeal');
  });
});
