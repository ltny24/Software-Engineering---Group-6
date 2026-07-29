package myus.repository;

import myus.entity.TuitionAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TuitionAccountRepository extends JpaRepository<TuitionAccount, Long> {
    List<TuitionAccount> findByStudentStudentId(Long studentId);
}
