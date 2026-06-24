package com.ankit.gateway_server.security;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
public class JwtHeaderPropagationFilter implements GlobalFilter, Ordered {
    private final JwtUtil jwtUtil;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();

        // Skip header injection for public authentication routes
        if (path.equals("/auth/login") || path.equals("/auth/signup") || path.startsWith("/actuator/**")) {
            return chain.filter(exchange);
        }

        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            try {
                Claims claims = jwtUtil.getAllClaimsFromToken(token);

                // Extract custom claims or subject
                String userId = claims.getSubject(); // subject is the User ID
                String userRole = claims.get("role", String.class);

                // Mutate the request to append custom downstream headers
                ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                        .header("X-User-Id", userId)
                        .header("X-User-Role", userRole)
                        // Optional: Remove original Authorization header so downstream services don't have to process it
                        .headers(httpHeaders -> httpHeaders.remove(HttpHeaders.AUTHORIZATION))
                        .build();

                // Forward the modified exchange
                return chain.filter(exchange.mutate().request(mutatedRequest).build());

            } catch (Exception e) {
                // Fail-safe: If token parsing fails unexpectedly here, block the request
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }
        }

        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        // High priority: Execute right after Spring Security populates the context
        // return SecurityWebFiltersOrder.AUTHORIZATION.getOrder() + 1;
        return -100;
    }
}