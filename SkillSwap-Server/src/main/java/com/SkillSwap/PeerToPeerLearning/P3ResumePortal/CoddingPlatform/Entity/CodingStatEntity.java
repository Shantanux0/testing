package com.SkillSwap.PeerToPeerLearning.P3ResumePortal.CoddingPlatform.Entity;

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
@Table(name = "user_coding_stats")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CodingStatEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link back to the user who owns this resume entry
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_auth_id", nullable = false)
    private UserAuthEntity user;

    @Column(nullable = false)
    private String platformName; // e.g., "LeetCode", "HackerRank"

    private String profileUrl; // Link to the user's profile on the platform

    private Integer totalProblemsSolved;

    private Integer easySolved;

    private Integer mediumSolved;

    private Integer hardSolved;

    // URL to the screenshot/PDF proof of stats (e.g., profile screenshot)
    @Column(length = 512)
    private String proofUrl;

    // Automatically set by Hibernate when the record is first created
    @CreationTimestamp
    @Column(updatable = false)
    private Timestamp createdAt;

    // Automatically updated by Hibernate whenever the record is modified
    @UpdateTimestamp
    private Timestamp updatedAt;
}