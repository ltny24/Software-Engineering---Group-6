package myus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for displaying FAQ articles to the frontend.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FAQArticleDTO {

    private Long faqId;
    private String question;
    private String answer;
    private String category;
    private String tags;
    private LocalDateTime updatedAt;
}
