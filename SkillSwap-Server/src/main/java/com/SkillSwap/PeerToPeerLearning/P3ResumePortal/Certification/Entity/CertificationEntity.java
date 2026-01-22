package com.SkillSwap.PeerToPeerLearning.P3ResumePortal.Certification.Entity;

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
@Table(name = "user_certifications")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CertificationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link back to the user who owns this resume entry
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_auth_id", nullable = false)
    private UserAuthEntity user;

    @Column(nullable = false)
    private String skillName; // e.g., "Spring Boot Development"

    private String certificationName; // e.g., "Professional Spring Developer"

    private String issuingOrganization; // e.g., "Spring Academy"

    private String issueDate; // Store as string for flexibility (e.g., "Jan 2023" or "2023")

    private String expirationDate; // Nullable

    // URL to the PDF or Image proof of certification
    @Column(length = 512) // Increased length for long URLs
    private String proofUrl;

    // Automatically set by Hibernate when the record is first created
    @CreationTimestamp
    @Column(updatable = false)
    private Timestamp createdAt;

    // Automatically updated by Hibernate whenever the record is modified
    @UpdateTimestamp
    private Timestamp updatedAt;
}