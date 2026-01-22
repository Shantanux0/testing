package com.SkillSwap.PeerToPeerLearning.P3ResumePortal.Education.Entity;

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
@Table(name = "user_education")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EducationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link back to the user who owns this resume entry
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_auth_id", nullable = false)
    private UserAuthEntity user;

    @Column(nullable = false)
    private String educationLevel; // e.g., "10th Grade", "12th Grade", "Bachelor's Degree", "Master's Degree"

    @Column(nullable = false)
    private String institutionName; // School/College name

    private String boardOrUniversity; // e.g., "CBSE", "Pune University"

    private String fieldOfStudy; // e.g., "Science", "Computer Science", Nullable for 10th/12th

    @Column(nullable = false)
    private String passingYear; // Store as string (e.g., "2018")

    @Column(nullable = false)
    private String scoreDetails; // e.g., "9.2 CGPA", "92.5%", "First Class"

    // URL to the PDF or Image proof (e.g., Marksheet, Degree Certificate)
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