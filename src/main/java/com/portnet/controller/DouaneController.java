package com.portnet.controller;

import com.portnet.model.Demande;
import com.portnet.model.EtatDemande;
import com.portnet.repository.DemandeRepository;
import com.portnet.repository.NotificationRepository;
import com.portnet.model.Notification;
import com.portnet.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/douane")
public class DouaneController {
    @Autowired
    private DemandeRepository demandeRepository;
    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping("/demandes")
    public List<Demande> getAllDemandes() {
        return demandeRepository.findAll();
    }

    @PostMapping("/demande/{id}/traiter")
    public Demande traiterDemande(@PathVariable Long id, @RequestBody TraitementRequest req) {
        Demande demande = demandeRepository.findById(id).orElseThrow();
        demande.setEtat(req.acceptee ? EtatDemande.ACCEPTEE : EtatDemande.REFUSEE);
        demande.setCommentaireDouane(req.commentaire);
        demande.setDateTraitement(java.time.LocalDateTime.now());
        demandeRepository.save(demande);
        // Notification
        Notification notif = Notification.builder()
            .destinataire(demande.getUtilisateur())
            .message("Votre demande #" + demande.getId() + " a été " + (req.acceptee ? "acceptée" : "refusée") + ". Commentaire: " + req.commentaire)
            .dateEnvoi(java.time.LocalDateTime.now())
            .build();
        notificationRepository.save(notif);
        return demande;
    }

    public static class TraitementRequest {
        public boolean acceptee;
        public String commentaire;
    }
} 