package com.myus.service;

import com.myus.dto.NotificationResponse;
import com.myus.entity.Notification;
import com.myus.entity.Student;
import com.myus.exception.ResourceNotFoundException;
import com.myus.repository.NotificationRepository;
import com.myus.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Default implementation of {@link NotificationService}.
 */
@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final StudentRepository studentRepository;

    public NotificationServiceImpl(NotificationRepository notificationRepository,
                                   StudentRepository studentRepository) {
        this.notificationRepository = notificationRepository;
        this.studentRepository = studentRepository;
    }

    @Override
    @Transactional
    public void notifyStudent(Long studentId, String title, String message) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Student not found with id: " + studentId));

        Notification notification = new Notification();
        notification.setStudent(student);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setReadFlag(false);
        notification.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(notification);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotifications(String username) {
        Student student = resolveStudent(username);
        return notificationRepository
                .findByStudentStudentIdOrderByCreatedAtDesc(student.getStudentId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public long countUnread(String username) {
        Student student = resolveStudent(username);
        return notificationRepository
                .countByStudentStudentIdAndReadFlagFalse(student.getStudentId());
    }

    @Override
    @Transactional
    public void markAsRead(String username, Long notificationId) {
        Student student = resolveStudent(username);
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Notification not found with id: " + notificationId));

        if (!notification.getStudent().getStudentId().equals(student.getStudentId())) {
            throw new ResourceNotFoundException(
                    "Notification not found with id: " + notificationId);
        }

        notification.setReadFlag(true);
        notificationRepository.save(notification);
    }

    private Student resolveStudent(String username) {
        return studentRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Student not found for username: " + username));
    }

    private NotificationResponse toResponse(Notification notification) {
        return new NotificationResponse(
                notification.getNotificationId(),
                notification.getTitle(),
                notification.getMessage(),
                notification.isReadFlag(),
                notification.getCreatedAt()
        );
    }
}
