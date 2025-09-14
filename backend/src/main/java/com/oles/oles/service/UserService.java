package com.oles.oles.service;

// import com.oles.oles.model.Role;
import com.oles.oles.model.User;
import com.oles.oles.repo.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository repo;
    private final PasswordEncoder enc;
    private final JwtService jwt;

    public UserService(UserRepository r, PasswordEncoder e, JwtService j) {
        repo = r;
        enc = e;
        jwt = j;
    }

    public User register(User u) {
        u.setPassword(enc.encode(u.getPassword()));
        return repo.save(u);
    }

    public String login(String username, String rawPwd) {
        var user = repo.findByUsername(username).orElseThrow();
        if (!enc.matches(rawPwd, user.getPassword()))
            throw new RuntimeException("Bad credentials");
        return jwt.generate(user.getUsername(), user.getRole().name());
    }
}