package com.myus.service;

import com.myus.dto.FaqResponse;
import com.myus.entity.FAQArticle;
import com.myus.exception.ResourceNotFoundException;
import com.myus.repository.FaqRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Default implementation of {@link FaqService}.
 *
 * <p>The FAQ corpus is filtered/ranked in memory rather than via SQL: this
 * keeps typo-tolerance and synonym recognition (NFR) simple to implement and
 * is fast enough given the FAQ library's realistic size (NFR ID16 – no
 * noticeable search delay).</p>
 */
@Slf4j
@Service
@Transactional(readOnly = true)
public class FaqServiceImpl implements FaqService {

    /** Groups of interchangeable words/phrases recognized during search. */
    private static final List<String[]> SYNONYM_GROUPS = List.of(
            new String[]{"drop", "withdraw", "withdrawal", "unenroll", "unenrollment"},
            new String[]{"tuition", "fee", "fees", "payment", "balance"},
            new String[]{"gpa", "grade point average", "grade-point-average", "cumulative gpa"},
            new String[]{"password", "login", "credentials", "sign in"},
            new String[]{"appeal", "dispute", "regrade", "re-grade"},
            new String[]{"register", "registration", "enroll", "enrollment", "sign up", "signup"},
            new String[]{"transcript", "academic record"},
            new String[]{"scholarship", "financial aid"},
            new String[]{"deadline", "due date", "cutoff"},
            new String[]{"portal", "website", "system", "site"},
            new String[]{"class", "course", "subject"}
    );

    private static final int RELATED_QUESTIONS_LIMIT = 5;

    private final FaqRepository faqRepository;

    public FaqServiceImpl(FaqRepository faqRepository) {
        this.faqRepository = faqRepository;
    }

    @Override
    public List<String> getCategories() {
        return faqRepository.findByPublishedTrue().stream()
                .map(FAQArticle::getCategory)
                .filter(category -> category != null && !category.isBlank())
                .map(String::trim)
                .distinct()
                .sorted(String.CASE_INSENSITIVE_ORDER)
                .collect(Collectors.toList());
    }

    @Override
    public Page<FaqResponse> search(String search, String category, int page, int size) {
        log.debug("Searching FAQs: search={}, category={}, page={}, size={}", search, category, page, size);

        List<FAQArticle> candidates = faqRepository.findByPublishedTrue().stream()
                .filter(article -> category == null || category.isBlank()
                        || category.equalsIgnoreCase(article.getCategory()))
                .collect(Collectors.toList());

        List<FaqResponse> ranked;
        if (search == null || search.isBlank()) {
            ranked = candidates.stream()
                    .sorted(Comparator.comparing(FAQArticle::getCategory, Comparator.nullsLast(String::compareToIgnoreCase))
                            .thenComparing(FAQArticle::getQuestion, String.CASE_INSENSITIVE_ORDER))
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        } else {
            Set<String> terms = expandSearchTerms(search);
            ranked = candidates.stream()
                    .map(article -> new ScoredArticle(article, scoreArticle(article, terms)))
                    .filter(scored -> scored.score() > 0)
                    .sorted(Comparator.comparingInt(ScoredArticle::score).reversed()
                            .thenComparing(scored -> scored.article().getQuestion(), String.CASE_INSENSITIVE_ORDER))
                    .map(scored -> mapToResponse(scored.article()))
                    .collect(Collectors.toList());
        }

        int totalElements = ranked.size();
        int fromIndex = Math.min(page * size, totalElements);
        int toIndex = Math.min(fromIndex + size, totalElements);
        List<FaqResponse> pageContent = ranked.subList(fromIndex, toIndex);

        return new PageImpl<>(pageContent, PageRequest.of(page, size), totalElements);
    }

    @Override
    public List<FaqResponse> getPopular(int limit) {
        return faqRepository.findByPublishedTrue().stream()
                .sorted(Comparator.comparing(FAQArticle::getHelpfulCount, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(Math.max(limit, 0))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public FaqResponse getById(Long faqId) {
        FAQArticle article = faqRepository.findById(faqId)
                .filter(FAQArticle::getPublished)
                .orElseThrow(() -> new ResourceNotFoundException("FAQ article not found with id: " + faqId));

        FaqResponse response = mapToResponse(article);
        response.setRelatedQuestions(getRelatedQuestions(article));
        return response;
    }

    @Override
    @Transactional
    public FaqResponse submitFeedback(Long faqId, boolean helpful) {
        FAQArticle article = faqRepository.findById(faqId)
                .filter(FAQArticle::getPublished)
                .orElseThrow(() -> new ResourceNotFoundException("FAQ article not found with id: " + faqId));

        if (helpful) {
            article.setHelpfulCount((article.getHelpfulCount() == null ? 0 : article.getHelpfulCount()) + 1);
        } else {
            article.setNotHelpfulCount((article.getNotHelpfulCount() == null ? 0 : article.getNotHelpfulCount()) + 1);
        }

        FAQArticle saved = faqRepository.save(article);
        log.debug("Recorded FAQ feedback: faqId={}, helpful={}", faqId, helpful);
        return mapToResponse(saved);
    }

    // ── Private helpers ────────────────────────────────────────

    private List<FaqResponse> getRelatedQuestions(FAQArticle article) {
        if (article.getCategory() == null || article.getCategory().isBlank()) {
            return List.of();
        }
        return faqRepository
                .findByPublishedTrueAndCategoryIgnoreCaseAndFaqIdNot(article.getCategory(), article.getFaqId())
                .stream()
                .sorted(Comparator.comparing(FAQArticle::getHelpfulCount, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(RELATED_QUESTIONS_LIMIT)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Expands a raw search query into a set of lowercase terms (words and
     * phrases) including recognized synonyms, used for substring matching
     * against FAQ content.
     */
    private Set<String> expandSearchTerms(String search) {
        String normalized = search.toLowerCase().trim();
        Set<String> terms = new LinkedHashSet<>();

        Arrays.stream(normalized.split("[^a-z0-9]+"))
                .filter(token -> token.length() >= 3)
                .forEach(terms::add);

        for (String[] group : SYNONYM_GROUPS) {
            boolean matchesGroup = Arrays.stream(group).anyMatch(normalized::contains);
            if (matchesGroup) {
                terms.addAll(Arrays.asList(group));
            }
        }

        return terms;
    }

    /**
     * Scores an FAQ article's relevance against the expanded search terms.
     * Substring matches on question/tags/category/answer score highest;
     * single-word terms that don't match anywhere are also checked against
     * individual question words with edit-distance tolerance so common typos
     * ("regsiter" ≈ "register") still surface relevant results.
     */
    private int scoreArticle(FAQArticle article, Set<String> terms) {
        String question = safeLower(article.getQuestion());
        String answer = safeLower(article.getAnswer());
        String category = safeLower(article.getCategory());
        String tags = safeLower(article.getTags());

        int score = 0;
        for (String term : terms) {
            boolean matchedExactly = false;
            if (question.contains(term)) {
                score += 5;
                matchedExactly = true;
            }
            if (tags.contains(term)) {
                score += 4;
                matchedExactly = true;
            }
            if (category.contains(term)) {
                score += 3;
                matchedExactly = true;
            }
            if (answer.contains(term)) {
                score += 2;
                matchedExactly = true;
            }

            if (!matchedExactly && term.length() >= 4 && !term.contains(" ")) {
                int maxDistance = term.length() >= 7 ? 2 : 1;
                boolean fuzzyMatch = Arrays.stream(question.split("[^a-z0-9]+"))
                        .anyMatch(word -> !word.isBlank() && levenshteinDistance(word, term) <= maxDistance);
                if (fuzzyMatch) {
                    score += 3;
                }
            }
        }
        return score;
    }

    private String safeLower(String value) {
        return value == null ? "" : value.toLowerCase();
    }

    /** Classic O(n*m) edit-distance, used for typo-tolerant keyword matching. */
    private int levenshteinDistance(String a, String b) {
        int[][] dp = new int[a.length() + 1][b.length() + 1];
        for (int i = 0; i <= a.length(); i++) {
            for (int j = 0; j <= b.length(); j++) {
                if (i == 0) {
                    dp[i][j] = j;
                } else if (j == 0) {
                    dp[i][j] = i;
                } else {
                    int cost = a.charAt(i - 1) == b.charAt(j - 1) ? 0 : 1;
                    dp[i][j] = Math.min(
                            Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1),
                            dp[i - 1][j - 1] + cost);
                }
            }
        }
        return dp[a.length()][b.length()];
    }

    private FaqResponse mapToResponse(FAQArticle article) {
        return new FaqResponse(
                article.getFaqId(),
                article.getQuestion(),
                article.getAnswer(),
                article.getCategory(),
                parseTags(article.getTags()),
                article.getUpdatedAt(),
                article.getHelpfulCount() == null ? 0 : article.getHelpfulCount(),
                article.getNotHelpfulCount() == null ? 0 : article.getNotHelpfulCount()
        );
    }

    private List<String> parseTags(String tags) {
        if (tags == null || tags.isBlank()) {
            return new ArrayList<>();
        }
        return Arrays.stream(tags.split(","))
                .map(String::trim)
                .filter(tag -> !tag.isEmpty())
                .collect(Collectors.toList());
    }

    /** Pairs an FAQ article with its computed relevance score for a search query. */
    private record ScoredArticle(FAQArticle article, int score) {
    }
}
