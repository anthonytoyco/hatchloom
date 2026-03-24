package com.hatchloom.launchpad.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.RegexRequestMatcher;

/**
 * Security configuration for the LaunchPad service.
 *
 * <p>Uses two filter chains to handle mixed public/protected routes:</p>
 * <ol>
 *   <li>{@code publicFilterChain} (Order 1) — matches the Position Status Interface
 *       exactly and permits all requests with no OAuth2 filter involved.</li>
 *   <li>{@code securedFilterChain} (Order 2) — requires a valid Bearer JWT for
 *       all other routes, validated against the Auth service issuer.</li>
 * </ol>
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Public filter chain for the Position Status Interface.
     *
     * <p>Scoped to {@code GET /launchpad/positions/*&#47;status} via
     * {@link RegexRequestMatcher}. No OAuth2 resource server filter is applied
     * so ConnectHub can call this endpoint server-to-server without a user token.</p>
     *
     * @param http the {@link HttpSecurity} to configure
     * @return the configured {@link SecurityFilterChain}
     * @throws Exception if configuration fails
     */
    @Bean
    @Order(1)
    public SecurityFilterChain publicFilterChain(HttpSecurity http) throws Exception {
        http
            .securityMatcher(new RegexRequestMatcher("/launchpad/positions/[^/]+/status", "GET"))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());

        return http.build();
    }

    /**
     * Secured filter chain for all other LaunchPad routes.
     *
     * <p>Validates Bearer JWT tokens issued by the Auth service. Stateless — no
     * HTTP session is created. CSRF disabled (JWT API).</p>
     *
     * @param http the {@link HttpSecurity} to configure
     * @return the configured {@link SecurityFilterChain}
     * @throws Exception if configuration fails
     */
    @Bean
    @Order(2)
    public SecurityFilterChain securedFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/error").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> {}));

        return http.build();
    }
}
