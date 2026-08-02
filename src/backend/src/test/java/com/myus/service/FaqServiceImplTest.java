package com.myus.service;

import com.myus.dto.FaqResponse;
import com.myus.entity.FAQArticle;
import com.myus.exception.ResourceNotFoundException;
import com.myus.repository.FaqRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FaqServiceImplTest {

    @Mock
    private FaqRepository faqRepository;

    private FaqServiceImpl faqService;

    private FAQArticle registrationFaq;
    private FAQArticle gradeAppealFaq;
    private FAQArticle unpublishedFaq;

    @BeforeEach
    void setUp() {
        faqService = new FaqServiceImpl(faqRepository);

        registrationFaq = new FAQArticle();
        registrationFaq.setFaqId(1L);
        registrationFaq.setQuestion("How do I drop or withdraw from a course?");
        registrationFaq.setAnswer("Open Courses, find the course, and click Drop.");
        registrationFaq.setCategory("Registration");
        registrationFaq.setTags("drop, withdraw, course");
        registrationFaq.setPublished(true);
        registrationFaq.setHelpfulCount(10);
        registrationFaq.setNotHelpfulCount(1);

        gradeAppealFaq = new FAQArticle();
        gradeAppealFaq.setFaqId(2L);
        gradeAppealFaq.setQuestion("How do I appeal a grade?");
        gradeAppealFaq.setAnswer("Go to the Grade Appeal section and submit your reason.");
        gradeAppealFaq.setCategory("Grades & Appeals");
        gradeAppealFaq.setTags("grade_appeal, appeal");
        gradeAppealFaq.setPublished(true);
        gradeAppealFaq.setHelpfulCount(3);
        gradeAppealFaq.setNotHelpfulCount(0);

        unpublishedFaq = new FAQArticle();
        unpublishedFaq.setFaqId(3L);
        unpublishedFaq.setQuestion("Draft question not yet published");
        unpublishedFaq.setAnswer("Draft answer");
        unpublishedFaq.setCategory("Registration");
        unpublishedFaq.setTags("draft");
        unpublishedFaq.setPublished(false);
        unpublishedFaq.setHelpfulCount(0);
        unpublishedFaq.setNotHelpfulCount(0);
    }

    @Nested
    @DisplayName("Search")
    class SearchTests {

        @Test
        @DisplayName("Returns all published FAQs when search is blank")
        void searchReturnsAllPublishedWhenBlank() {
            when(faqRepository.findByPublishedTrue())
                    .thenReturn(List.of(registrationFaq, gradeAppealFaq));

            Page<FaqResponse> result = faqService.search(null, null, 0, 20);

            assertThat(result.getTotalElements()).isEqualTo(2);
            assertThat(result.getContent()).extracting(FaqResponse::getFaqId)
                    .containsExactlyInAnyOrder(1L, 2L);
        }

        @Test
        @DisplayName("Filters by category")
        void searchFiltersByCategory() {
            when(faqRepository.findByPublishedTrue())
                    .thenReturn(List.of(registrationFaq, gradeAppealFaq));

            Page<FaqResponse> result = faqService.search(null, "Grades & Appeals", 0, 20);

            assertThat(result.getContent()).hasSize(1);
            assertThat(result.getContent().get(0).getFaqId()).isEqualTo(2L);
        }

        @Test
        @DisplayName("Matches keyword directly present in the question")
        void searchMatchesDirectKeyword() {
            when(faqRepository.findByPublishedTrue())
                    .thenReturn(List.of(registrationFaq, gradeAppealFaq));

            Page<FaqResponse> result = faqService.search("appeal", null, 0, 20);

            assertThat(result.getContent()).extracting(FaqResponse::getFaqId)
                    .containsExactly(2L);
        }

        @Test
        @DisplayName("Recognizes synonyms (\"drop a class\" matches \"withdraw\" FAQ)")
        void searchRecognizesSynonyms() {
            when(faqRepository.findByPublishedTrue())
                    .thenReturn(List.of(registrationFaq, gradeAppealFaq));

            Page<FaqResponse> result = faqService.search("withdraw from a class", null, 0, 20);

            assertThat(result.getContent()).extracting(FaqResponse::getFaqId)
                    .containsExactly(1L);
        }

        @Test
        @DisplayName("Tolerates a minor typo in the keyword")
        void searchToleratesTypos() {
            when(faqRepository.findByPublishedTrue())
                    .thenReturn(List.of(registrationFaq, gradeAppealFaq));

            Page<FaqResponse> result = faqService.search("witdraw", null, 0, 20);

            assertThat(result.getContent()).extracting(FaqResponse::getFaqId)
                    .contains(1L);
        }

        @Test
        @DisplayName("Returns an empty page when nothing matches")
        void searchReturnsEmptyWhenNoMatch() {
            when(faqRepository.findByPublishedTrue())
                    .thenReturn(List.of(registrationFaq, gradeAppealFaq));

            Page<FaqResponse> result = faqService.search("zzz_no_match_zzz", null, 0, 20);

            assertThat(result.getContent()).isEmpty();
            assertThat(result.getTotalElements()).isZero();
        }
    }

    @Nested
    @DisplayName("Categories")
    class CategoriesTests {

        @Test
        @DisplayName("Returns distinct, sorted categories from published FAQs only")
        void getCategoriesReturnsDistinctSorted() {
            when(faqRepository.findByPublishedTrue())
                    .thenReturn(List.of(registrationFaq, gradeAppealFaq));

            List<String> categories = faqService.getCategories();

            assertThat(categories).containsExactly("Grades & Appeals", "Registration");
        }
    }

    @Nested
    @DisplayName("Get By Id")
    class GetByIdTests {

        @Test
        @DisplayName("Returns detail with related questions from the same category")
        void getByIdReturnsRelatedQuestions() {
            FAQArticle related = new FAQArticle();
            related.setFaqId(4L);
            related.setQuestion("What is the late add/drop deadline?");
            related.setCategory("Registration");
            related.setHelpfulCount(5);
            related.setNotHelpfulCount(0);
            related.setPublished(true);

            when(faqRepository.findById(1L)).thenReturn(java.util.Optional.of(registrationFaq));
            when(faqRepository.findByPublishedTrueAndCategoryIgnoreCaseAndFaqIdNot("Registration", 1L))
                    .thenReturn(List.of(related));

            FaqResponse response = faqService.getById(1L);

            assertThat(response.getFaqId()).isEqualTo(1L);
            assertThat(response.getRelatedQuestions()).extracting(FaqResponse::getFaqId)
                    .containsExactly(4L);
        }

        @Test
        @DisplayName("Throws when the FAQ does not exist")
        void getByIdThrowsWhenNotFound() {
            when(faqRepository.findById(99L)).thenReturn(java.util.Optional.empty());

            assertThatThrownBy(() -> faqService.getById(99L))
                    .isInstanceOf(ResourceNotFoundException.class);
        }

        @Test
        @DisplayName("Throws when the FAQ is not published")
        void getByIdThrowsWhenUnpublished() {
            when(faqRepository.findById(3L)).thenReturn(java.util.Optional.of(unpublishedFaq));

            assertThatThrownBy(() -> faqService.getById(3L))
                    .isInstanceOf(ResourceNotFoundException.class);
        }
    }

    @Nested
    @DisplayName("Submit Feedback")
    class SubmitFeedbackTests {

        @Test
        @DisplayName("Increments helpfulCount when rated helpful")
        void submitFeedbackHelpful() {
            when(faqRepository.findById(1L)).thenReturn(java.util.Optional.of(registrationFaq));
            when(faqRepository.save(any(FAQArticle.class))).thenAnswer(i -> i.getArgument(0));

            FaqResponse response = faqService.submitFeedback(1L, true);

            assertThat(response.getHelpfulCount()).isEqualTo(11);
            assertThat(response.getNotHelpfulCount()).isEqualTo(1);
        }

        @Test
        @DisplayName("Increments notHelpfulCount when rated not helpful")
        void submitFeedbackNotHelpful() {
            when(faqRepository.findById(1L)).thenReturn(java.util.Optional.of(registrationFaq));
            when(faqRepository.save(any(FAQArticle.class))).thenAnswer(i -> i.getArgument(0));

            FaqResponse response = faqService.submitFeedback(1L, false);

            assertThat(response.getHelpfulCount()).isEqualTo(10);
            assertThat(response.getNotHelpfulCount()).isEqualTo(2);
        }
    }
}
