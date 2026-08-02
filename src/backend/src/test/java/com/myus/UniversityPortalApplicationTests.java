package com.myus;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * Smoke test – verifies the Spring application context loads successfully.
 * Requires a running SQL Server instance (or an in-memory substitute via test profile).
 */
@SpringBootTest
@ActiveProfiles("test")
class UniversityPortalApplicationTests {

    @Test
    void contextLoads() {
        // If this test passes, the Spring context wired up without errors.
    }
}
