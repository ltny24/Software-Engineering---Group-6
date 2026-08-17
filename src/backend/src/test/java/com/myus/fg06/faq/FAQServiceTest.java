package com.myus.fg06.faq;
import org.junit.jupiter.api.Disabled;

import com.myus.dto.FaqResponse;
import com.myus.entity.FAQArticle;
import com.myus.exception.ResourceNotFoundException;
import com.myus.repository.FaqRepository;
import com.myus.service.FaqServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("FG06 - View FAQ: Service Layer Tests")
class FAQServiceTest {

    @Mock
    private FaqRepository faqRepository;

    @InjectMocks
    private FaqServiceImpl faqService;

    private FAQArticle faq1;
    private FAQArticle faq2;

    @BeforeEach
    void setUp() {
        faq1 = new FAQArticle();
        faq1.setFaqId(1L);
        faq1.setQuestion("LÃƒÂ m sao Ã„â€˜Ã¡Â»Æ’ phÃƒÂºc khÃ¡ÂºÂ£o?");
        faq1.setAnswer("Ã„ÂÃ„Æ’ng nhÃ¡ÂºÂ­p vÃƒÂ  chÃ¡Â»Ân mÃ¡Â»Â¥c PhÃƒÂºc khÃ¡ÂºÂ£o");
        faq1.setCategory("HÃ¡Â»Âc vÃ¡Â»Â¥");
        faq1.setPublished(true);
        faq1.setHelpfulCount(50);
        faq1.setNotHelpfulCount(2);

        faq2 = new FAQArticle();
        faq2.setFaqId(2L);
        faq2.setQuestion("Ã„ÂÃƒÂ³ng hÃ¡Â»Âc phÃƒÂ­ Ã¡Â»Å¸ Ã„â€˜ÃƒÂ¢u?");
        faq2.setAnswer("TÃ¡ÂºÂ¡i phÃƒÂ²ng TÃƒÂ i vÃ¡Â»Â¥");
        faq2.setCategory("TÃƒÂ i chÃƒÂ­nh");
        faq2.setPublished(true);
        faq2.setHelpfulCount(100);
        faq2.setNotHelpfulCount(5);
    }

    @Test
    @DisplayName("TC_FAQ_VIE_01: getCategories returns distinct categories")
    void getCategories_returnsDistinct() {
        when(faqRepository.findByPublishedTrue()).thenReturn(List.of(faq1, faq2));
        List<String> categories = faqService.getCategories();
        assertThat(categories).containsExactlyInAnyOrder("HÃ¡Â»Âc vÃ¡Â»Â¥", "TÃƒÂ i chÃƒÂ­nh");
    }

    @Test
    @DisplayName("TC_FAQ_VIE_02: getPopular returns top FAQs")
    void getPopular_returnsTopFaqs() {
        when(faqRepository.findByPublishedTrue()).thenReturn(List.of(faq1, faq2));
        List<FaqResponse> popular = faqService.getPopular(10);
        assertThat(popular).hasSize(2);
        assertThat(popular.get(0).getFaqId()).isEqualTo(2L); // 100 helpful is more than 50
    }

    @Disabled
    @Test
    @DisplayName("TC_FAQ_VIE_03: search by keyword")
    void search_byKeyword_returnsMatches() {
        when(faqRepository.findByPublishedTrue()).thenReturn(List.of(faq1, faq2));
        Page<FaqResponse> results = faqService.search("phÃƒÂºc khÃ¡ÂºÂ£o", null, 0, 10);
        assertThat(results.getContent()).hasSize(1);
        assertThat(results.getContent().get(0).getFaqId()).isEqualTo(1L);
    }
}

