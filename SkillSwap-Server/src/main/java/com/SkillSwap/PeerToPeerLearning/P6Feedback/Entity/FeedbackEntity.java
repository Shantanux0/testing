package com.SkillSwap.PeerToPeerLearning.P6Feedback.Entity;

import com.SkillSwap.PeerToPeerLearning.P1Auth.Entity.UserAuthEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_feedback")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FeedbackEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The user who receives the feedback (Teacher)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewee_id", nullable = false)
    private UserAuthEntity reviewee;

    // The user who gives the feedback (Learner)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private UserAuthEntity reviewer;

    // Link to the session (optional for now until P7Session is built, but good to
    // have)
    // using raw Long for now to avoid compilation error until SessionEntity exists
    @Column(name = "session_id")
    private Long sessionId;

    @Column(nullable = false)
    private Integer rating; // 1 to 5

    @Column(length = 1000)
    private String comments;

    // Dimensions of feedback stored as JSON string or comma-separated values
    // e.g., "Communication:5,Accuracy:4,Punctuality:5"
    private String dimensions;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
