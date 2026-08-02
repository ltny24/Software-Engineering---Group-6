package com.myus.service;

import com.myus.dto.FaqResponse;

import org.springframework.data.domain.Page;

import java.util.List;

/**
 * Service contract for the centralized FAQ library (UC10).
 *
 * <p>Provides searchable, categorized access to published FAQ content covering
 * university policies, academic rules, and IT support, plus lightweight
 * feedback collection ("Helpful" / "Not Helpful") on individual answers.</p>
 */
public interface FaqService {

    /**
     * Distinct categories present among published FAQ articles, sorted alphabetically.
     */
    List<String> getCategories();

    /**
     * Search/browse published FAQ articles with keyword and category filtering.
     *
     * <p>The keyword search tolerates typos (via edit-distance matching) and
     * recognizes common keyword synonyms (e.g. "drop a class" ≈ "withdraw
     * from course"), so results stay relevant even with imprecise queries.</p>
     *
     * @param search   optional free-text keyword search
     * @param category optional category filter
     * @param page     zero-based page index
     * @param size     number of items per page
     * @return paginated, relevance-ranked FAQ summaries
     */
    Page<FaqResponse> search(String search, String category, int page, int size);

    /**
     * Most helpful published FAQ articles, used to suggest popular topics
     * when a search returns no results (AF1).
     */
    List<FaqResponse> getPopular(int limit);

    /**
     * Full detail for a single published FAQ article, including related
     * questions from the same category (AF4).
     *
     * @throws com.myus.exception.ResourceNotFoundException if not found or unpublished
     */
    FaqResponse getById(Long faqId);

    /**
     * Record a "Helpful" / "Not Helpful" rating for an answer (AF3).
     *
     * @return the updated helpful/not-helpful counts
     */
    FaqResponse submitFeedback(Long faqId, boolean helpful);
}
