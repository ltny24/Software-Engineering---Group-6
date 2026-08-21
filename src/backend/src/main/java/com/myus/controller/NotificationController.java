package com.myus.controller;

import com.myus.dto.NotificationResponse;
import com.myus.service.NotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;
import java.util.Map;

/**
 * REST controller for student in-app notifications (UC-14).
 *
 * <p>All endpoints require the {@code STUDENT} role.</p>
 */
@Slf4j
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<NotificationResponse>> listNotifications(Principal principal) {
        log.debug("GET /api/notifications – user={}", principal.getName());
        return ResponseEntity.ok(notificationService.getNotifications(principal.getName()));
    }

    @GetMapping("/unread-count")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Map<String, Long>> unreadCount(Principal principal) {
        long count = notificationService.countUnread(principal.getName());
        return ResponseEntity.ok(Map.of("unread", count));
    }

    @PostMapping("/{id}/read")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id, Principal principal) {
        log.debug("POST /api/notifications/{}/read – user={}", id, principal.getName());
        notificationService.markAsRead(principal.getName(), id);
        return ResponseEntity.ok().build();
    }
}
