package myus.repository;

import myus.entity.ChatbotSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data JPA repository for {@link ChatbotSession} entities.
 */
@Repository
public interface ChatbotSessionRepository extends JpaRepository<ChatbotSession, Long> {

    /**
     * Find the most recent active session for a student, ordered by last activity.
     */
    Optional<ChatbotSession> findTopByStudentStudentIdOrderByLastActivityAtDesc(Long studentId);
}
