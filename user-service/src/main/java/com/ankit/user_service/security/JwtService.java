package com.ankit.user_service.security;

import com.ankit.user_service.entity.UserCredential;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class JwtService {

    private final SecretKey key;

    public JwtService(@Value("${jwt.secret}") String secretString) {
        this.key = Keys.hmacShaKeyFor(secretString.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String userId, String roleName, boolean isFirstLogin) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", List.of(roleName));
        claims.put("isFirstLogin", isFirstLogin); // Injecting the flag

        return Jwts.builder()
                .claims(claims)
                .subject(userId) // The system UUID
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
                .signWith(key)
                .compact();
    }
}
