package com.ankit.gateway_server.security;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationManager implements ReactiveAuthenticationManager {
    private final JwtUtil jwtUtil;

    @Override
    @SuppressWarnings("unchecked")
    public Mono<Authentication> authenticate(Authentication authentication) {
        String authToken = authentication.getCredentials().toString();

        try {
            if (jwtUtil.validateToken(authToken)) {
                Claims claims = jwtUtil.getAllClaimsFromToken(authToken);
                String username = claims.getSubject();

                // Expecting roles to be stored as a List in JWT claims (e.g., ["ROLE_USER"])
                List<String> rolesMap = claims.get("roles", List.class);

                List<SimpleGrantedAuthority> authorities = rolesMap != null ?
                        rolesMap.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList()) :
                        List.of();

                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(username, null, authorities);
                return Mono.just(auth);
            }
        } catch (Exception e) {
            return Mono.empty(); // Authentication fails if exceptions occur during parsing
        }
        return Mono.empty();
    }
}
