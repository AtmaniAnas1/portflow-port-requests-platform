package com.portnet.repository;

import com.portnet.model.Demande;
import com.portnet.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DemandeRepository extends JpaRepository<Demande, Long> {
    List<Demande> findByUtilisateur(User utilisateur);
} 