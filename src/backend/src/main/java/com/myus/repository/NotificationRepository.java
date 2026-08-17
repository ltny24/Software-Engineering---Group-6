package com.myus.repository;

import com.myus.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByStudentStudentIdOrderByCreatedAtDesc(Long studentId);

    long countByStudentStudentIdAndReadFlagFalse(Long studentId);
}
