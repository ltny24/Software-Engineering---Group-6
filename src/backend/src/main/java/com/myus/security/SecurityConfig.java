package com.myus.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;

/**
 * Spring Security configuration for the MyUS University Portal.
 *
 * <p>Configures a stateless, JWT-based security filter chain with CORS
 * support and public access to authentication and documentation endpoints.</p>
 *
 * <p><b>Note:</b> The actual {@code JwtAuthenticationFilter} will be
 * registered in <strong>T008</strong>. This configuration provides the
 * foundation (filter chain, entry point, password encoder, auth manager)
 * that T008 and T009 depend on.</p>
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationEntryPoint authEntryPoint;
    private final CorsConfigurationSource corsConfigurationSource;

    public SecurityConfig(JwtAuthenticationEntryPoint authEntryPoint,
                          CorsConfigurationSource corsConfigurationSource) {
        this.authEntryPoint = authEntryPoint;
        this.corsConfigurationSource = corsConfigurationSource;
    }

    /**
     * Main security filter chain.
     *
     * <ul>
     *   <li>CSRF disabled — stateless JWT-based API</li>
     *   <li>CORS enabled — uses {@link com.myus.config.CorsConfig}</li>
     *   <li>Session management — STATELESS</li>
     *   <li>Public endpoints: auth, docs, actuator health</li>
     *   <li>All others require authentication</li>
     * </ul>
     *
     * <p>TODO (T008): Register JwtAuthenticationFilter before
     * UsernamePasswordAuthenticationFilter here.</p>
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource))

            .csrf(csrf -> csrf.disable())

            .exceptionHandling(ex -> ex
                    .authenticationEntryPoint(authEntryPoint))

            .sessionManagement(session -> session
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            .authorizeHttpRequests(auth -> auth
                    // ── Public endpoints ──────────────────────
                    .requestMatchers("/api/auth/**").permitAll()

                    // ── API documentation ─────────────────────
                    .requestMatchers(
                            "/swagger-ui/**",
                            "/swagger-ui.html",
                            "/api-docs/**",
                            "/v3/api-docs/**"
                    ).permitAll()

                    // ── Actuator health check ─────────────────
                    .requestMatchers("/actuator/health").permitAll()

                    // ── Everything else requires authentication
                    .anyRequest().authenticated()
            );

        // TODO (T008): Add JWT filter registration here:
        // http.addFilterBefore(jwtAuthenticationFilter,
        //         UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * BCrypt password encoder for hashing user credentials.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Exposes the {@link AuthenticationManager} as a bean so it can
     * be injected into controllers and services (e.g., login endpoint).
     */
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}
