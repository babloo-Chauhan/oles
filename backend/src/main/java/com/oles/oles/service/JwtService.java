package com.oles.oles.service;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;
import java.security.Key;
import java.util.*;


@Service
public class JwtService {
private final Key key = Keys.hmacShaKeyFor("change-this-secret-key-change-this-secret".getBytes());
public String generate(String username, String role) {
return Jwts.builder()
.setSubject(username)
.claim("role", role)
.setIssuedAt(new Date())
.setExpiration(new Date(System.currentTimeMillis() + 1000L*60*60*6))
.signWith(key)
.compact();
}
public Jws<Claims> parse(String token) { return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token); }
}