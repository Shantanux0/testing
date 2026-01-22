package com.SkillSwap.PeerToPeerLearning.P9Notification.Entity;

import com.SkillSwap.PeerToPeerLearning.P1Auth.Entity.UserAuthEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserAuthEntity user;

    private String message;

    // INFO, SUCCESS, WARNING, ERROR
    private String type;

    @Builder.Default
    private boolean isRead = false;

    private Long relatedEntityId; // e.g. Session ID
    private String relatedEntityType; // "SESSION", "MESSAGE"

    private LocalDateTime createdAt;
}
