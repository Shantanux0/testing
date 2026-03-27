package com.SkillSwap.PeerToPeerLearning.P7Session.Entity;

import com.SkillSwap.PeerToPeerLearning.P1Auth.Entity.UserAuthEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Tracks who is currently present in a teaching-room session.
 * Polled by the frontend every few seconds to build "waiting room" +
 * leave-request features.
 */
@Entity
@Table(name = "session_presence", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "session_id", "user_id" })
})
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SessionPresenceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private SwapSessionEntity session;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserAuthEntity user;

    /** Whether this user is currently in the room */
    @Column(nullable = false)
    private Boolean active;

    /** True when this user has requested to leave (needs partner's approval) */
    @Column(nullable = false)
    private Boolean leaveRequested;

    /** Last heartbeat — if stale >30s we treat them as gone */
    @UpdateTimestamp
    private LocalDateTime lastSeen;
}
