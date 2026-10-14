package com.portnet.controller;

import com.portnet.model.User;
import com.portnet.model.Role;
import com.portnet.service.UserService;
import com.portnet.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserService userService;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody Map<String, String> body) {
        String nom = body.get("nom");
        String email = body.get("email");
        String password = body.get("password");
        Role role = Role.valueOf(body.getOrDefault("role", "USER"));
        User user = userService.registerUser(nom, email, password, role);
        String token = jwtService.generateToken(user.getEmail());
        return Map.of("user", user, "token", token);
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {
        try {
            Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(body.get("email"), body.get("password"))
            );
            User user = userService.findByEmail(body.get("email")).orElseThrow();
            String token = jwtService.generateToken(user.getEmail());
            return Map.of("user", user, "token", token);
        } catch (AuthenticationException e) {
            return Map.of("error", "Identifiants invalides");
        }
    }
} 