package com.SkillSwap.PeerToPeerLearning.P3ResumePortal.Experience.Entity;

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
@Table(name = "user_experience")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ExperienceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link back to the user who owns this resume entry
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_auth_id", nullable = false)
    private UserAuthEntity user;

    @Column(nullable = false)
    private String jobTitle; // e.g., "Software Engineer Intern"

    @Column(nullable = false)
    private String companyName; // e.g., "Google"

    @Column(nullable = false)
    private String skillName; // Primary skill associated with this experience

    @Column(nullable = false)
    private String startDate; // Store as string for flexibility (e.g., "May 2023")

    private String endDate; // Nullable, if current job

    @Column(length = 1000)
    private String description; // Detailed description of responsibilities

    // URL to the PDF or Image proof (e.g., offer letter, letter of recommendation)
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