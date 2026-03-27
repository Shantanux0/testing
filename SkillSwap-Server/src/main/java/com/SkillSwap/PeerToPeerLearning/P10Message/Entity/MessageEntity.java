package com.SkillSwap.PeerToPeerLearning.P10Message.Entity;

import com.SkillSwap.PeerToPeerLearning.P1Auth.Entity.UserAuthEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "messages", indexes = {
        @Index(columnList = "sender_id,receiver_id"),
        @Index(columnList = "receiver_id,sender_id")
})
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MessageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private UserAuthEntity sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id", nullable = false)
    private UserAuthEntity receiver;

    // Optional: link to a session this conversation is about
    private Long sessionId;

    @Column(nullable = false, length = 4000)
    private String content;

    @Column(nullable = false)
    private Boolean isRead;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
