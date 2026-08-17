package com.myus;

import com.myus.config.JwtProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

/**
 * Entry point for the MyUS University Portal backend application.
 */
@SpringBootApplication
@EnableConfigurationProperties(JwtProperties.class)
public class UniversityPortalApplication {

    public static void main(String[] args) {
        SpringApplication.run(UniversityPortalApplication.class, args);
    }
}
