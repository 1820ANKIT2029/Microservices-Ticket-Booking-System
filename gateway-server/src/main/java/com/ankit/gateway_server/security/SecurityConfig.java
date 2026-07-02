package com.ankit.gateway_server.security;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository;
    private final ErrorResponseWriter errorResponseWriter;

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .cors(cors -> {})
                .formLogin(ServerHttpSecurity.FormLoginSpec::disable)
                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
                .authenticationManager(authenticationManager)
                .securityContextRepository(securityContextRepository)
                .authorizeExchange(exchanges -> exchanges
                        .pathMatchers(
                                "/swagger-ui.html",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/webjars/**",
                                "/*/v3/api-docs",         // e.g., /user/v3/api-docs
                                "/*/v3/api-docs/**"       // e.g., /user/v3/api-docs/swagger-config
                        ).permitAll()

                        // Actuator & Auth Endpoints
                        .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .pathMatchers("/auth/**").permitAll()
                        .pathMatchers("/*/actuator/**", "/actuator/**").permitAll()
                        .pathMatchers("/payment/api/payment/webhook/**").permitAll()
                        // Role-Based Access Control
                        .pathMatchers("/admin/**").hasRole("ADMIN")
                        // Every other route requires a valid token
                        .anyExchange().authenticated()
                )
                .exceptionHandling(exceptionHandling -> exceptionHandling
                        .authenticationEntryPoint((exchange, e) -> {
                            return errorResponseWriter.write(
                                    exchange, HttpStatus.UNAUTHORIZED,
                                    "Authentication required"
                            );
                        })
                )
                .build();
    }
}
