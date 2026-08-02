package com.myus.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "ChatbotSession", schema = "myus")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatbotSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sessionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "studentId", nullable = false)
    private Student student;

    private LocalDateTime startedAt;

    private LocalDateTime lastActivityAt;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String context;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String recommendations;

}
