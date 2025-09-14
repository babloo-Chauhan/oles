package com.oles.oles.controller;

import com.oles.oles.dto.*;
import com.oles.oles.model.*;
import com.oles.oles.repo.UserRepository;
import com.oles.oles.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {
    private final UserService users;
    private final UserRepository repo;

    public AuthController(UserService u, UserRepository r) {
        users = u;
        repo = r;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User u) {
        if (u.getRole() == null)
            u.setRole(Role.CANDIDATE);
        return ResponseEntity.ok(users.register(u));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest req) {
        String token = users.login(req.username(), req.password());
        var user = repo.findByUsername(req.username()).orElseThrow();
        return ResponseEntity.ok(new AuthResponse(token, user.getRole().name(), user.getUsername()));
    }
}