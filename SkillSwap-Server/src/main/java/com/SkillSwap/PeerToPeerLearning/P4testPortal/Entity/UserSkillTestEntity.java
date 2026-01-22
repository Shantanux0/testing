package com.SkillSwap.PeerToPeerLearning.P4testPortal.Entity;

import com.SkillSwap.PeerToPeerLearning.P1Auth.Entity.UserAuthEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;

@Entity
@Table(name = "user_skill_tests")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserSkillTestEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_auth_id", nullable = false)
    private UserAuthEntity user;

    @Column(nullable = false)
    private String skillName; // Skill being tested (e.g., "Spring Boot", "React")

    @Column(nullable = false)
    private String difficultyLevel; // "HARD" for qualification tests

    @Column(nullable = false, columnDefinition = "TEXT")
    private String questionsJson; // JSON array of questions with options

    @Column(nullable = false, columnDefinition = "TEXT")
    private String answersJson; // JSON array of correct answers

    @Column(columnDefinition = "TEXT")
    private String userResponsesJson; // JSON array of user's answers

    @Column(nullable = false)
    private Integer totalQuestions; // Always 15 for qualification

    private Integer score; // Score achieved by user

    private Integer passingScore; // Minimum score required (e.g., 10/15)

    @Column(nullable = false)
    private Boolean isPassed; // Whether user passed the test

    @Column(nullable = false)
    private String testStatus; // PENDING, IN_PROGRESS, COMPLETED, EXPIRED

    private Long testExpiresAt; // Timestamp when test expires (30 minutes from generation)

    @Column(nullable = false)
    private String aiProvider; // "OPENAI" or "GEMINI"

    @CreationTimestamp
    @Column(updatable = false)
    private Timestamp createdAt;

    @UpdateTimestamp
    private Timestamp updatedAt;
}