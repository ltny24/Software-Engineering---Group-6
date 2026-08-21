package com.myus.service;

import com.myus.dto.NotificationResponse;

import java.util.List;

/**
 * Service contract for student in-app notifications (UC-14).
 *
 * <p>Administrator actions (e.g. a class transfer) create notifications for
 * affected students; students can then list and mark them as read.</p>
 */
public interface NotificationService {

    /**
     * Create a notification for a specific student.
     *
     * @param studentId the target student
     * @param title     short notification title
     * @param message   notification body
     */
    void notifyStudent(Long studentId, String title, String message);

    /**
     * List a student's notifications, newest first.
     *
     * @param username the authenticated student's username
     * @return the student's notifications
     */
    List<NotificationResponse> getNotifications(String username);

    /**
     * Count a student's unread notifications.
     *
     * @param username the authenticated student's username
     * @return unread count
     */
    long countUnread(String username);

    /**
     * Mark a single notification as read.
     *
     * @param username       the authenticated student's username
     * @param notificationId the notification to mark read
     */
    void markAsRead(String username, Long notificationId);
}
