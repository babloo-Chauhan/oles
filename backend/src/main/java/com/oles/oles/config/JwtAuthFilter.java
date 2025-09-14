package com.oles.oles.config;
import com.oles.oles.repo.UserRepository;
import io.jsonwebtoken.Claims;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import com.oles.oles.service.JwtService;
import java.io.IOException;
import java.util.List;


@Component
public class JwtAuthFilter extends OncePerRequestFilter {
private final JwtService jwt; private final UserRepository users;
public JwtAuthFilter(JwtService jwt, UserRepository users){this.jwt=jwt; this.users=users;}
@Override
protected void doFilterInternal(
		@org.springframework.lang.NonNull HttpServletRequest req,
		@org.springframework.lang.NonNull HttpServletResponse res,
		@org.springframework.lang.NonNull FilterChain chain)
		throws ServletException, IOException {
String auth = req.getHeader("Authorization");
if (auth!=null && auth.startsWith("Bearer ")) {
try {
var jws = jwt.parse(auth.substring(7));
Claims c = jws.getBody();
String username = c.getSubject();
String role = c.get("role", String.class);
if (users.findByUsername(username).isPresent()) {
Authentication a = new UsernamePasswordAuthenticationToken(username, null,
List.of(new SimpleGrantedAuthority("ROLE_"+role)));
SecurityContextHolder.getContext().setAuthentication(a);
}
} catch (Exception ignored) {}
}
chain.doFilter(req, res);
}
}