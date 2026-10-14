package com.portnet.service;

import com.portnet.model.User;
import com.portnet.model.Role;
import com.portnet.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(String nom, String email, String password, Role role) {
        User user = User.builder()
                .nom(nom)
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(role)
                .actif(true)
                .build();
        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User save(User user) {
        return userRepository.save(user);
    }
} 