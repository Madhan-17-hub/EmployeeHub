package com.example.employeeplatform.controller;

import com.example.employeeplatform.entity.User;
import com.example.employeeplatform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController @RequestMapping("/api/users") @RequiredArgsConstructor
public class UserController {
    private final UserRepository users;
    private final PasswordEncoder encoder;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public List<User> all() {
        return users.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public User one(@PathVariable Long id) {
        return users.findById(id).orElseThrow();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public User create(@RequestBody User u) {
        if (u.getPassword() == null || u.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }
        u.setPassword(encoder.encode(u.getPassword()));
        return users.save(u);
    }
}
