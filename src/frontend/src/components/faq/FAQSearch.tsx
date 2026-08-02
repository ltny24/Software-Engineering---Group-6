import React, { useEffect, useState } from 'react';
import { getFAQs } from '../../services/chatbotService';
import type { FAQArticle } from '../../types/chatbot.types';
import './FAQSearch.css';

const CATEGORIES = [
  'All',
  'Course Registration',
  'Grade Appeals',
  'Finance',
  'Grades & GPA',
  'Support & Chatbot',
  'Graduation',
  'Account & Access',
  'Academic Policies',
];

/**
 * Searchable FAQ knowledge base.
 * Loads FAQs from the backend and provides client-side search and category filtering.
 */
export default function FAQSearch() {
  const [faqs, setFaqs] = useState<FAQArticle[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        const data = await getFAQs();
        setFaqs(data);
      } catch (err) {
        console.error('Failed to load FAQs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFAQs();
  }, []);

  const filtered = faqs.filter((faq) => {
    const matchCat = category === 'All' || faq.category === category;
    const matchSearch =
      !search ||
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const toggle = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (loading) {
    return (
      <div className="faq__loading" aria-busy="true">
        Loading FAQs...
      </div>
    );
  }

  return (
    <div className="faq">
      <div className="faq__toolbar">
        <input
          className="faq__search"
          type="text"
          placeholder="Search FAQs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search frequently asked questions"
        />
        <select
          className="faq__filter"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="faq__empty">No FAQs found matching your search.</p>
      ) : (
        <div className="faq__list">
          {filtered.map((faq) => (
            <div
              key={faq.faqId}
              className={`faq__item ${expandedId === faq.faqId ? 'faq__item--open' : ''}`}
            >
              <button
                className="faq__question"
                onClick={() => toggle(faq.faqId)}
                aria-expanded={expandedId === faq.faqId}
              >
                <span className="faq__q-text">{faq.question}</span>
                <span className="faq__q-cat">{faq.category}</span>
                <span className="faq__chevron">{expandedId === faq.faqId ? '▲' : '▼'}</span>
              </button>
              {expandedId === faq.faqId && <div className="faq__answer">{faq.answer}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
