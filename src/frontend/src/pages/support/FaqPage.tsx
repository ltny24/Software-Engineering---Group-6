import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import {
  getFaqById,
  getFaqCategories,
  getPopularFaqs,
  searchFaqs,
  submitFaqFeedback,
} from '../../services/faqService';
import type { FAQArticle } from '../../types';
import './FaqPage.css';

const PAGE_SIZE = 8;
const SEARCH_DEBOUNCE_MS = 300;
const BOOKMARK_STORAGE_KEY = 'myus_faq_bookmarks';
const HELPDESK_EMAIL = 'helpdesk@myus.edu';
const HELPDESK_PHONE = '+1 (555) 010-2020';

const FALLBACK_CATEGORIES = [
  'Academic Policies',
  'Registration',
  'Grades & Appeals',
  'Tuition',
  'IT/Technical Support',
];

const DEMO_FAQS: FAQArticle[] = [
  {
    faqId: 'demo-1',
    question: 'How do I drop or withdraw from a course?',
    answer:
      'Open Courses, find the course under My Registrations, and click Drop. Courses can be dropped before the withdrawal deadline published on the academic calendar without academic penalty.',
    category: 'Registration',
    tags: ['drop', 'withdraw', 'course'],
    helpfulCount: 12,
    notHelpfulCount: 1,
  },
  {
    faqId: 'demo-2',
    question: 'How is my cumulative GPA calculated?',
    answer:
      'Your cumulative GPA is the credit-weighted average of all completed course grade points, shown on the Grades page and updated automatically after each term.',
    category: 'Grades & Appeals',
    tags: ['gpa', 'grades'],
    helpfulCount: 8,
    notHelpfulCount: 0,
  },
  {
    faqId: 'demo-3',
    question: 'What happens if I miss a tuition payment deadline?',
    answer:
      'A financial hold is placed on your account, which blocks course registration and transcript requests until the balance is paid or a payment plan is arranged with the Finance office.',
    category: 'Tuition',
    tags: ['tuition', 'payment', 'deadline'],
    helpfulCount: 5,
    notHelpfulCount: 0,
  },
  {
    faqId: 'demo-4',
    question: 'I forgot my portal password. How do I reset it?',
    answer:
      'Click "Forgot password" on the login page and follow the email verification steps. If you no longer have access to your registered email, contact the IT Helpdesk directly.',
    category: 'IT/Technical Support',
    tags: ['password', 'login'],
    helpfulCount: 9,
    notHelpfulCount: 1,
  },
];

function loadBookmarks(): FAQArticle[] {
  try {
    const raw = localStorage.getItem(BOOKMARK_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as FAQArticle[]) : [];
  } catch {
    return [];
  }
}

export default function FaqPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchInput, setSearchInput] = useState<string>('');
  const [appliedSearch, setAppliedSearch] = useState<string>('');

  const [results, setResults] = useState<FAQArticle[]>([]);
  const [loadingResults, setLoadingResults] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [usingDemoData, setUsingDemoData] = useState<boolean>(false);

  const [popularFaqs, setPopularFaqs] = useState<FAQArticle[]>([]);

  const [expandedId, setExpandedId] = useState<string | number | null>(null);
  const [detailCache, setDetailCache] = useState<Record<string, FAQArticle>>({});
  const [loadingDetailId, setLoadingDetailId] = useState<string | number | null>(null);
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());

  const [bookmarks, setBookmarks] = useState<FAQArticle[]>(() => loadBookmarks());
  const [showBookmarksOnly, setShowBookmarksOnly] = useState<boolean>(false);

  // Ref map để scroll đến FAQ item khi jumpToFaq
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const pendingScrollId = useRef<string | null>(null);
  // Lưu FAQ đang jump tới để inject vào results sau khi fetch xong
  const jumpingFaqRef = useRef<FAQArticle | null>(null);
  // Flag: skip fetch khi đang jump (vì chúng ta tự set appliedSearch = '')
  const skipNextFetchRef = useRef<boolean>(false);

  const isBookmarked = useCallback(
    (faqId: string | number) => bookmarks.some((b) => String(b.faqId) === String(faqId)),
    [bookmarks]
  );

  const toggleBookmark = (faq: FAQArticle) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => String(b.faqId) === String(faq.faqId));
      const next = exists
        ? prev.filter((b) => String(b.faqId) !== String(faq.faqId))
        : [
            ...prev,
            {
              faqId: faq.faqId,
              question: faq.question,
              category: faq.category,
              answer: faq.answer,
              tags: faq.tags,
            },
          ];
      localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(next));
      toast.success(exists ? 'Removed bookmark.' : 'Saved to your bookmarks.');
      return next;
    });
  };

  // ------------------------------------------------------------
  // Load categories once
  // ------------------------------------------------------------
  useEffect(() => {
    (async () => {
      try {
        const data = await getFaqCategories();
        setCategories(data.length > 0 ? data : FALLBACK_CATEGORIES);
      } catch (error) {
        setCategories(FALLBACK_CATEGORIES);
        console.error(error);
      }
    })();

    (async () => {
      try {
        const data = await getPopularFaqs(5);
        setPopularFaqs(data.length > 0 ? data : DEMO_FAQS.slice(0, 3));
      } catch (error) {
        setPopularFaqs(DEMO_FAQS.slice(0, 3));
        console.error(error);
      }
    })();
  }, []);

  // ------------------------------------------------------------
  // Fetch results whenever filters/page change (debounced on search input)
  // ------------------------------------------------------------
  const fetchResults = useCallback(async (search: string, category: string, pageIndex: number) => {
    try {
      setLoadingResults(true);
      const data = await searchFaqs({
        search: search || undefined,
        category: category || undefined,
        page: pageIndex,
        size: PAGE_SIZE,
      });
      const content = data.content ?? [];

      if (content.length === 0 && !search && !category && pageIndex === 0) {
        // Backend unreachable/empty – fall back to demo data so the page stays demoable.
        setResults(DEMO_FAQS);
        setTotalPages(1);
        setTotalElements(DEMO_FAQS.length);
        setPage(0);
        setUsingDemoData(true);
      } else {
        setResults(content);
        setTotalPages(data.totalPages ?? (content.length > 0 ? 1 : 0));
        setTotalElements(data.totalElements ?? content.length);
        setPage(data.page ?? pageIndex);
        setUsingDemoData(false);
      }
    } catch (error) {
      const fallback = DEMO_FAQS.filter((faq) => {
        const matchesCategory = !category || faq.category === category;
        const matchesSearch =
          !search ||
          faq.question.toLowerCase().includes(search.toLowerCase()) ||
          faq.answer.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
      });
      setResults(fallback);
      setTotalPages(fallback.length > 0 ? 1 : 0);
      setTotalElements(fallback.length);
      setPage(0);
      setUsingDemoData(true);
      console.error(error);
    } finally {
      setLoadingResults(false);
    }
  }, []);

  useEffect(() => {
    const handle = setTimeout(() => {
      setAppliedSearch(searchInput.trim());
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [searchInput]);

  useEffect(() => {
    if (skipNextFetchRef.current) {
      skipNextFetchRef.current = false;
      return;
    }
    fetchResults(appliedSearch, selectedCategory, 0);
  }, [appliedSearch, selectedCategory, fetchResults]);

  const goToPage = (nextPage: number) => {
    if (nextPage < 0 || nextPage >= totalPages) return;
    fetchResults(appliedSearch, selectedCategory, nextPage);
  };

  // ------------------------------------------------------------
  // Expand / detail loading
  // ------------------------------------------------------------
  const toggleExpand = async (faq: FAQArticle) => {
    const key = String(faq.faqId);
    if (expandedId === faq.faqId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(faq.faqId);

    if (detailCache[key] || String(faq.faqId).startsWith('demo-')) {
      return;
    }

    try {
      setLoadingDetailId(faq.faqId);
      const detail = await getFaqById(faq.faqId);
      setDetailCache((prev) => ({ ...prev, [key]: detail }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingDetailId(null);
    }
  };

  const getDisplayFaq = (faq: FAQArticle): FAQArticle => detailCache[String(faq.faqId)] ?? faq;

  const handleFeedback = async (faq: FAQArticle, helpful: boolean) => {
    const key = String(faq.faqId);
    if (votedIds.has(key) || key.startsWith('demo-')) {
      toast('You already rated this answer. Thanks for the feedback!');
      return;
    }
    try {
      const updated = await submitFaqFeedback(faq.faqId, helpful);
      setDetailCache((prev) => ({ ...prev, [key]: { ...getDisplayFaq(faq), ...updated } }));
      setVotedIds((prev) => new Set(prev).add(key));
      toast.success(helpful ? 'Thanks! Glad it helped.' : 'Thanks for letting us know.');
    } catch (error) {
      toast.error('Failed to submit feedback.');
      console.error(error);
    }
  };

  const jumpToFaq = (faq: FAQArticle) => {
    setShowBookmarksOnly(false);
    setSelectedCategory('');
    setExpandedId(faq.faqId);
    pendingScrollId.current = String(faq.faqId);
    jumpingFaqRef.current = faq;

    // Nếu search đang trống, chỉ cần inject FAQ vào list hiện tại
    if (!searchInput && !appliedSearch && selectedCategory === '') {
      skipNextFetchRef.current = false;
      setResults((prev) =>
        prev.some((r) => String(r.faqId) === String(faq.faqId)) ? prev : [faq, ...prev]
      );
      jumpingFaqRef.current = null; // inject ngay, không cần đợi fetch
    } else {
      // Clear search -> sẽ trigger fetch debounce, skip nó
      skipNextFetchRef.current = true;
      setSearchInput('');
      setAppliedSearch('');
      // Inject FAQ ngay vào results để list không bị empty
      setResults((prev) =>
        prev.some((r) => String(r.faqId) === String(faq.faqId)) ? prev : [faq, ...prev]
      );
      jumpingFaqRef.current = null; // Không cần inject lại sau fetch
    }

    if (!detailCache[String(faq.faqId)] && !String(faq.faqId).startsWith('demo-')) {
      void getFaqById(faq.faqId)
        .then((detail) => setDetailCache((prev) => ({ ...prev, [String(faq.faqId)]: detail })))
        .catch(console.error);
    }
  };

  const visibleResults = useMemo(
    () => (showBookmarksOnly ? bookmarks : results),
    [showBookmarksOnly, bookmarks, results]
  );

  const noResults = !loadingResults && !showBookmarksOnly && visibleResults.length === 0;
  const noBookmarks = showBookmarksOnly && bookmarks.length === 0;

  // Sau khi fetch xong: inject FAQ đang jump và scroll đến nó
  useEffect(() => {
    if (loadingResults) return;

    // Nếu có jumpingFaq, đảm bảo nó xuất hiện trong list
    if (jumpingFaqRef.current) {
      const target = jumpingFaqRef.current;
      setResults((prev) =>
        prev.some((r) => String(r.faqId) === String(target.faqId)) ? prev : [target, ...prev]
      );
      setExpandedId(target.faqId);
      jumpingFaqRef.current = null;
    }
  }, [loadingResults]);

  // Scroll đến FAQ item sau khi render (khi jumpToFaq được gọi)
  // Chạy sau mỗi render nhưng tự clear ngay khi thực hiện xong
  useEffect(() => {
    if (!pendingScrollId.current) return;
    const id = pendingScrollId.current;
    const el = itemRefs.current[id];
    if (el) {
      pendingScrollId.current = null;
      requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  });

  return (
    <div className="faq-container">
      <div className="faq-header">
        <h2>❓ Help &amp; FAQ</h2>
        <p className="faq-subtitle">
          Search university policies, academic rules, and IT support answers for instant
          self-service help.
        </p>
      </div>

      {usingDemoData && (
        <p className="faq-demo-banner">
          Showing sample FAQ content — live results will appear once the FAQ service is reachable.
        </p>
      )}

      <div className="faq-toolbar">
        <input
          type="text"
          className="faq-search-input"
          placeholder="Search FAQs (e.g. 'drop a class', 'tuition deadline')"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button
          type="button"
          className={`faq-bookmark-toggle ${showBookmarksOnly ? 'faq-bookmark-toggle-active' : ''}`}
          onClick={() => setShowBookmarksOnly((prev) => !prev)}
        >
          🔖 Bookmarked {bookmarks.length > 0 && `(${bookmarks.length})`}
        </button>
      </div>

      {!showBookmarksOnly && (
        <div className="faq-categories">
          <button
            className={`faq-category-chip ${selectedCategory === '' ? 'faq-category-chip-active' : ''}`}
            onClick={() => setSelectedCategory('')}
          >
            All Categories
          </button>
          {(categories.length > 0 ? categories : FALLBACK_CATEGORIES).map((category) => (
            <button
              key={category}
              className={`faq-category-chip ${selectedCategory === category ? 'faq-category-chip-active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      <div className="faq-card">
        {loadingResults && !showBookmarksOnly ? (
          <div className="profile-loading">
            <span className="spinner" /> Searching FAQs...
          </div>
        ) : noBookmarks ? (
          <div className="faq-empty-state">
            <p>You haven't bookmarked any FAQ entries yet.</p>
            <p className="muted">
              Open a question and tap the bookmark icon to save it here for quick access.
            </p>
          </div>
        ) : noResults ? (
          <div className="faq-empty-state">
            <p className="faq-empty-title">
              No results found{appliedSearch ? ` for "${appliedSearch}"` : ''}.
            </p>
            {popularFaqs.length > 0 && (
              <div className="faq-popular">
                <p className="faq-popular-title">Popular topics:</p>
                <ul className="faq-popular-list">
                  {popularFaqs.map((faq) => (
                    <li key={faq.faqId}>
                      <button className="faq-popular-link" onClick={() => jumpToFaq(faq)}>
                        {faq.question}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <a className="btn-save faq-contact-btn" href={`mailto:${HELPDESK_EMAIL}`}>
              Contact Support
            </a>
          </div>
        ) : (
          <>
            <p className="result-count">
              {showBookmarksOnly
                ? `${bookmarks.length} bookmarked FAQ${bookmarks.length !== 1 ? 's' : ''}`
                : `${totalElements} result${totalElements !== 1 ? 's' : ''} found`}
            </p>

            <ul className="faq-accordion">
              {visibleResults.map((faq) => {
                const expanded = expandedId === faq.faqId;
                const display = getDisplayFaq(faq);
                const bookmarked = isBookmarked(faq.faqId);
                const voted = votedIds.has(String(faq.faqId));

                return (
                  <li
                    key={faq.faqId}
                    className={`faq-item ${expanded ? 'faq-item-expanded' : ''}`}
                    ref={(el) => {
                      itemRefs.current[String(faq.faqId)] = el;
                    }}
                  >
                    <button className="faq-question-row" onClick={() => toggleExpand(faq)}>
                      <span className="faq-question-text">{faq.question}</span>
                      <span className="faq-question-meta">
                        <span className="badge faq-category-badge">{faq.category}</span>
                        <span className="faq-chevron">{expanded ? '▲' : '▼'}</span>
                      </span>
                    </button>

                    {expanded && (
                      <div className="faq-answer-panel">
                        {loadingDetailId === faq.faqId ? (
                          <div className="profile-loading">
                            <span className="spinner" /> Loading answer...
                          </div>
                        ) : (
                          <>
                            <p className="faq-answer-text">{display.answer}</p>

                            {display.tags && display.tags.length > 0 && (
                              <div className="faq-tags">
                                {display.tags.map((tag) => (
                                  <span key={tag} className="faq-tag">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}

                            <div className="faq-actions-row">
                              <div className="faq-feedback">
                                <span className="faq-feedback-label">Was this helpful?</span>
                                <button
                                  className="faq-vote-btn"
                                  disabled={voted}
                                  onClick={() => handleFeedback(faq, true)}
                                >
                                  👍 Helpful{' '}
                                  {display.helpfulCount != null && `(${display.helpfulCount})`}
                                </button>
                                <button
                                  className="faq-vote-btn"
                                  disabled={voted}
                                  onClick={() => handleFeedback(faq, false)}
                                >
                                  👎 Not Helpful{' '}
                                  {display.notHelpfulCount != null &&
                                    `(${display.notHelpfulCount})`}
                                </button>
                              </div>
                              <button
                                className={`faq-bookmark-btn ${bookmarked ? 'faq-bookmark-btn-active' : ''}`}
                                onClick={() => toggleBookmark(faq)}
                              >
                                {bookmarked ? '★ Bookmarked' : '☆ Bookmark'}
                              </button>
                            </div>

                            {display.relatedQuestions && display.relatedQuestions.length > 0 && (
                              <div className="faq-related">
                                <p className="faq-related-title">Related questions</p>
                                <ul className="faq-related-list">
                                  {display.relatedQuestions.map((related) => (
                                    <li key={related.faqId}>
                                      <button
                                        className="faq-popular-link"
                                        onClick={() => jumpToFaq(related)}
                                      >
                                        {related.question}
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <div className="faq-still-need-help">
                              <p>
                                Still need help? Email{' '}
                                <a href={`mailto:${HELPDESK_EMAIL}`}>{HELPDESK_EMAIL}</a> or call{' '}
                                <a href={`tel:${HELPDESK_PHONE}`}>{HELPDESK_PHONE}</a>.
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>

            {!showBookmarksOnly && totalPages > 1 && (
              <div className="faq-pagination">
                <button
                  className="faq-pagination-btn"
                  disabled={page <= 0}
                  onClick={() => goToPage(page - 1)}
                >
                  ‹ Prev
                </button>
                <span className="faq-pagination-info">
                  Page {page + 1} of {Math.max(totalPages, 1)}
                </span>
                <button
                  className="faq-pagination-btn"
                  disabled={page >= totalPages - 1}
                  onClick={() => goToPage(page + 1)}
                >
                  Next ›
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
