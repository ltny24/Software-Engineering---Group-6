package com.myus.repository;

import com.myus.entity.FAQArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for {@link FAQArticle} entity.
 *
 * <p>The FAQ library is small enough that search, filtering, and typo/synonym
 * tolerance are performed in-memory in {@code FaqServiceImpl} rather than via
 * complex SQL, so this repository only exposes simple published-content lookups.</p>
 */
@Repository
public interface FaqRepository extends JpaRepository<FAQArticle, Long> {

    /**
     * All published FAQ articles (used as the in-memory search corpus).
     */
    List<FAQArticle> findByPublishedTrue();

    /**
     * Published FAQ articles for a given category, excluding one article
     * (used to build "related questions").
     */
    List<FAQArticle> findByPublishedTrueAndCategoryIgnoreCaseAndFaqIdNot(String category, Long faqId);
}
