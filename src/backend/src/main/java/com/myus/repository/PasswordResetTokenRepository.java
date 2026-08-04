package com.myus.repository;

import com.myus.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByUsernameAndTokenAndUsedFalse(String username, String token);

    @Modifying
    @Query("UPDATE PasswordResetToken t SET t.used = true WHERE t.username = :username AND t.used = false")
    void invalidateExistingTokens(@Param("username") String username);
}
