package com.nihongo.backend.global.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import io.jsonwebtoken.Claims;

@Component
public class JwtTokenProvider {

    private static final String SECRET_KEY = "nihongo-jwt-secret-key-for-local-development-only-123456";
    private static final long ACCESS_TOKEN_EXPIRE_TIME = 1000 * 60 * 60;

    private final SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));

    public String createAccessToken(Long userId) {
        Date now = new Date();
        Date expiresAt = new Date(now.getTime() + ACCESS_TOKEN_EXPIRE_TIME);

        return Jwts.builder()
                .subject(String.valueOf(userId))
                .issuedAt(now)
                .expiration(expiresAt)
                .signWith(key)
                .compact();
    }
    public Long getUserId(String token) {
    Claims claims = Jwts.parser()
            .verifyWith(key)
            .build()
            .parseSignedClaims(token)
            .getPayload();

    return Long.valueOf(claims.getSubject());
}

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}