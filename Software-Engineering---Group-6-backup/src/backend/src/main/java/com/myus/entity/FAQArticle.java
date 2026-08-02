package com.myus.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "FAQArticle", schema = "myus")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FAQArticle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long faqId;

    @Column(columnDefinition = "NVARCHAR(MAX)", nullable = false)
    private String question;

    @Column(columnDefinition = "NVARCHAR(MAX)", nullable = false)
    private String answer;

    @Column(length = 255)
    private String category;

    @Column(length = 500)
    private String tags;

    private LocalDateTime updatedAt;

    @Column(nullable = false)
    private Boolean published = false;

}
