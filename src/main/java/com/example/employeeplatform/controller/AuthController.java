package com.example.employeeplatform.controller;

import com.example.employeeplatform.dto.*;
import com.example.employeeplatform.entity.User;
import com.example.employeeplatform.repository.UserRepository;
import com.example.employeeplatform.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/auth") @RequiredArgsConstructor
public class AuthController {
    private final AuthenticationManager auth;
    private final UserRepository users;
    private final JwtService jwt;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest req) {
        auth.authenticate(new UsernamePasswordAuthenticationToken(req.email(), req.password()));
        User u = users.findByEmail(req.email()).orElseThrow();
        u.setLastLogin(java.time.LocalDateTime.now());
        users.save(u);
        return new LoginResponse(jwt.generate(u.getEmail(), u.getRole().name()), u.getId(), u.getFullName(), u.getEmail(), u.getRole().name());
    }

    @GetMapping("/me")
    public LoginResponse me(org.springframework.security.core.Authentication a) {
        User u = users.findByEmail(a.getName()).orElseThrow();
        return new LoginResponse(null, u.getId(), u.getFullName(), u.getEmail(), u.getRole().name());
    }
}
