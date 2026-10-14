package com.portnet.repository;

import com.portnet.model.Notification;
import com.portnet.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByDestinataire(User destinataire);
} 