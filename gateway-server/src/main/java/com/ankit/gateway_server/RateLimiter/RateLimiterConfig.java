package com.ankit.gateway_server.RateLimiter;

import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import reactor.core.publisher.Mono;

@Configuration
public class RateLimiterConfig {

    /**
     * 1. Per-User Key Resolver
     * Extracts a user identifier. In a real-world scenario, you might extract
     * this from a 'Authorization' JWT claim or a custom header.
     * Here, we assume a custom header 'X-User-Id'.
     */
    @Bean
    @Primary
    public KeyResolver userIdKeyResolver() {
        return exchange -> {
            // This will now successfully read the header injected by your JwtHeaderAuthenticationFilter
            String userId = exchange.getRequest().getHeaders().getFirst("X-User-Id");

            if (userId != null && !userId.isEmpty()) {
                return Mono.just(userId);
            }

            // where the JWT filter doesn't inject a user ID.
            String ipAddress = java.util.Objects.requireNonNull(exchange.getRequest().getRemoteAddress())
                    .getAddress().getHostAddress();
            return Mono.just(ipAddress);
        };
    }

    /**
     * 2. Global System Key Resolver
     * Returns a static string so all requests share the same Redis token bucket.
     */
    @Bean
    public KeyResolver globalKeyResolver() {
        return exchange -> Mono.just("global-system-bucket");
    }
}
