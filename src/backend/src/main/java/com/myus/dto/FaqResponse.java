package com.myus.dto;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Response DTO for a single FAQ article, used both for search-result list
 * items and (with {@code relatedQuestions} populated) the full-answer detail view.
 */
public class FaqResponse {

    private Long faqId;
    private String question;
    private String answer;
    private String category;
    private List<String> tags;
    private LocalDateTime updatedAt;
    private Integer helpfulCount;
    private Integer notHelpfulCount;
    private List<FaqResponse> relatedQuestions;

    public FaqResponse() {
    }

    public FaqResponse(Long faqId,
                        String question,
                        String answer,
                        String category,
                        List<String> tags,
                        LocalDateTime updatedAt,
                        Integer helpfulCount,
                        Integer notHelpfulCount) {
        this.faqId = faqId;
        this.question = question;
        this.answer = answer;
        this.category = category;
        this.tags = tags;
        this.updatedAt = updatedAt;
        this.helpfulCount = helpfulCount;
        this.notHelpfulCount = notHelpfulCount;
    }

    // ── Getters & Setters ──────────────────────────────────────

    public Long getFaqId() {
        return faqId;
    }

    public void setFaqId(Long faqId) {
        this.faqId = faqId;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Integer getHelpfulCount() {
        return helpfulCount;
    }

    public void setHelpfulCount(Integer helpfulCount) {
        this.helpfulCount = helpfulCount;
    }

    public Integer getNotHelpfulCount() {
        return notHelpfulCount;
    }

    public void setNotHelpfulCount(Integer notHelpfulCount) {
        this.notHelpfulCount = notHelpfulCount;
    }

    public List<FaqResponse> getRelatedQuestions() {
        return relatedQuestions;
    }

    public void setRelatedQuestions(List<FaqResponse> relatedQuestions) {
        this.relatedQuestions = relatedQuestions;
    }
}
