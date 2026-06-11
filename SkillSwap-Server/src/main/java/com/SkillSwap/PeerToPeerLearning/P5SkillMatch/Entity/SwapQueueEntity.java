package com.SkillSwap.PeerToPeerLearning.P5SkillMatch.Entity;

import com.SkillSwap.PeerToPeerLearning.P1Auth.Entity.UserAuthEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "swap_queue")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SwapQueueEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserAuthEntity user;

    @Column(name = "skill_to_seek")
    private String skillToSeek;

    @Column(name = "skill_to_offer")
    private String skillToOffer;

    @Column(name = "status")
    private String status; // PENDING, MATCHED, CANCELLED

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) status = "PENDING";
    }
}
