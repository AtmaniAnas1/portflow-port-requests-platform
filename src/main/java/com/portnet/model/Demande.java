package com.portnet.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Demande {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User utilisateur;

    private String description;
    private String portDepart;
    private String portArrivee;

    @Enumerated(EnumType.STRING)
    private EtatDemande etat;

    private String commentaireDouane;
    private LocalDateTime dateSoumission;
    private LocalDateTime dateTraitement;
} 