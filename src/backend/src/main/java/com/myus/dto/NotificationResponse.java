package com.myus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Response DTO for a single in-app notification delivered to a student.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {

    private Long notificationId;
    private String title;
    private String message;
    private boolean read;
    private LocalDateTime createdAt;
}
