package myus.controller;

import myus.dto.FAQArticleDTO;
import myus.entity.FAQArticle;
import myus.repository.FAQArticleRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

/**
 * REST controller for the FAQ knowledge base.
 *
 * <p>Provides searchable access to published FAQ articles.
 * All endpoints require authentication.</p>
 *
 * <p>API contract:</p>
 * <ul>
 *   <li>{@code GET /api/v1/faq} – list/search FAQ articles</li>
 * </ul>
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/faq")
public class FAQController {

    private final FAQArticleRepository faqArticleRepository;

    public FAQController(FAQArticleRepository faqArticleRepository) {
        this.faqArticleRepository = faqArticleRepository;
    }

    /**
     * List all published FAQ articles, optionally filtered by search keyword
     * and/or category.
     *
     * @param search   optional keyword to search in questions and answers
     * @param category optional category to filter by
     * @return list of matching FAQ articles
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<FAQArticleDTO>> getFAQs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category) {

        log.debug("GET /api/v1/faq – search={}, category={}", search, category);

        List<FAQArticle> articles;
        if (search != null && !search.isBlank()) {
            articles = faqArticleRepository.searchPublished(search.trim());
        } else if (category != null && !category.isBlank()) {
            articles = faqArticleRepository.findByCategoryAndPublishedTrue(category);
        } else {
            articles = faqArticleRepository.findByPublishedTrue();
        }

        List<FAQArticleDTO> dtos = articles.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    private FAQArticleDTO mapToDTO(FAQArticle article) {
        FAQArticleDTO dto = new FAQArticleDTO();
        dto.setFaqId(article.getFaqId());
        dto.setQuestion(article.getQuestion());
        dto.setAnswer(article.getAnswer());
        dto.setCategory(article.getCategory());
        dto.setTags(article.getTags());
        dto.setUpdatedAt(article.getUpdatedAt());
        return dto;
    }
}
