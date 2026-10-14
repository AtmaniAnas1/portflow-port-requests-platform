package com.portnet.controller;

import com.portnet.model.User;
import com.portnet.model.Role;
import com.portnet.model.Demande;
import com.portnet.repository.UserRepository;
import com.portnet.repository.DemandeRepository;
import com.portnet.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private DemandeRepository demandeRepository;
    @Autowired
    private UserService userService;

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping("/user/{id}/activate")
    public User activateUser(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow();
        user.setActif(true);
        return userRepository.save(user);
    }

    @PostMapping("/user/{id}/suspend")
    public User suspendUser(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow();
        user.setActif(false);
        return userRepository.save(user);
    }

    @DeleteMapping("/user/{id}")
    public void deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
    }

    @PostMapping("/user/douane")
    public User createDouane(@RequestBody User user) {
        return userService.registerUser(user.getNom(), user.getEmail(), user.getPassword(), Role.DOUANE);
    }

    @GetMapping("/demandes")
    public List<Demande> getAllDemandes() {
        return demandeRepository.findAll();
    }
} 