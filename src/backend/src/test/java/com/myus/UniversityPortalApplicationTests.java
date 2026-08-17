package com.myus;
import org.junit.jupiter.api.Disabled;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * Smoke test ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“ verifies the Spring application context loads successfully.
 * Requires a running SQL Server instance (or an in-memory substitute via test profile).
 */
@Disabled
@SpringBootTest
@ActiveProfiles("test")
class UniversityPortalApplicationTests {

    @Disabled
    @Test
    void contextLoads() {
        // If this test passes, the Spring context wired up without errors.
    }
}
