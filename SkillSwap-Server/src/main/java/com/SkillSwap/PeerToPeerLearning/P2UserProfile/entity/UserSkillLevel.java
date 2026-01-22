package com.SkillSwap.PeerToPeerLearning.P2UserProfile.entity;

import com.SkillSwap.PeerToPeerLearning.P1Auth.Entity.UserAuthEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_skill_levels", uniqueConstraints = @UniqueConstraint(columnNames = { "user_id", "skill_name" }))
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserSkillLevel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserAuthEntity user;

    @Column(name = "skill_name", nullable = false, length = 100)
    private String skillName;

    @Column(name = "proficiency_level", nullable = false, length = 20)
    private String proficiencyLevel; // BEGINNER, INTERMEDIATE, ADVANCED, EXPERT

    @Column(name = "years_of_experience")
    private Integer yearsOfExperience;

    @Column(name = "self_rating")
    private Integer selfRating; // 1-5

    @Column(name = "projects_completed")
    private Integer projectsCompleted;

    @Column(name = "last_used_date")
    private LocalDate lastUsedDate;

    @Column(name = "willing_to_teach")
    private Boolean willingToTeach;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
