package com.portnet.controller;

import com.portnet.model.User;
import com.portnet.model.Demande;
import com.portnet.model.Notification;
import com.portnet.repository.UserRepository;
import com.portnet.repository.DemandeRepository;
import com.portnet.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private DemandeRepository demandeRepository;
    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping("/me")
    public User getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
    }

    @PostMapping("/demande")
    public Demande createDemande(@AuthenticationPrincipal UserDetails userDetails, @RequestBody Demande demande) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        demande.setUtilisateur(user);
        demande.setEtat(com.portnet.model.EtatDemande.EN_ATTENTE);
        demande.setDateSoumission(java.time.LocalDateTime.now());
        return demandeRepository.save(demande);
    }

    @GetMapping("/demandes")
    public List<Demande> getMesDemandes(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return demandeRepository.findByUtilisateur(user);
    }

    @GetMapping("/notifications")
    public List<Notification> getNotifications(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return notificationRepository.findByDestinataire(user);
    }
} 