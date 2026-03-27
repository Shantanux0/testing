package com.SkillSwap.PeerToPeerLearning.P7Session.Entity;

import com.SkillSwap.PeerToPeerLearning.P1Auth.Entity.UserAuthEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "session_agenda")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SessionAgendaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The session this agenda item belongs to
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private SwapSessionEntity session;

    // Topic/task title for this agenda item
    @Column(nullable = false)
    private String topic;

    // Optional description or notes for the topic
    @Column(length = 1000)
    private String description;

    // Display order (1, 2, 3...)
    @Column(nullable = false)
    private Integer orderIndex;

    // Whether the learner has checked this as done
    @Column(nullable = false)
    private Boolean isCompleted;

    // Who marked it complete (learner's user id)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "completed_by")
    private UserAuthEntity completedBy;

    // When it was marked complete
    private LocalDateTime completedAt;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
