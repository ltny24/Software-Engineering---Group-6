package myus.repository;

import myus.entity.FAQArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for {@link FAQArticle} entities.
 */
@Repository
public interface FAQArticleRepository extends JpaRepository<FAQArticle, Long> {

    /** Find all published FAQ articles. */
    List<FAQArticle> findByPublishedTrue();

    /** Find published FAQ articles by category. */
    List<FAQArticle> findByCategoryAndPublishedTrue(String category);

    /**
     * Search published FAQ articles by keyword in question or answer fields.
     * Uses case-insensitive LIKE matching via JPQL.
     */
    @Query("SELECT f FROM FAQArticle f WHERE f.published = true "
         + "AND (LOWER(f.question) LIKE LOWER(CONCAT('%', :keyword, '%')) "
         + "OR LOWER(f.answer) LIKE LOWER(CONCAT('%', :keyword, '%'))) "
         + "ORDER BY f.updatedAt DESC")
    List<FAQArticle> searchPublished(@Param("keyword") String keyword);
}
