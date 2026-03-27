package com.SkillSwap.PeerToPeerLearning.P7Session.Entity;

import com.SkillSwap.PeerToPeerLearning.P1Auth.Entity.UserAuthEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "session_feedback", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "session_id", "given_by_id" })
})
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SessionFeedbackEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The session this feedback belongs to
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private SwapSessionEntity session;

    // User who is leaving the feedback (learner or teacher)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "given_by_id", nullable = false)
    private UserAuthEntity givenBy;

    // User who is being reviewed (the teacher in this case)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "given_to_id", nullable = false)
    private UserAuthEntity givenTo;

    // Star rating 1-5
    @Column(nullable = false)
    private Integer rating;

    // Optional text review
    @Column(length = 2000)
    private String comment;

    // Role of the person giving feedback for this session: LEARNER or TEACHER
    @Column(nullable = false)
    private String role;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
