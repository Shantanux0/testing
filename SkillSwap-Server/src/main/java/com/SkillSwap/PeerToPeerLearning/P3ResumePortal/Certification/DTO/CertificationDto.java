package com.SkillSwap.PeerToPeerLearning.P3ResumePortal.Certification.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.URL;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CertificationDto {

    private Long id; // Used for update/response

    @NotBlank(message = "Skill name is required")
    @Size(max = 100, message = "Skill name cannot exceed 100 characters")
    private String skillName;

    @NotBlank(message = "Certification name is required")
    @Size(max = 200, message = "Certification name cannot exceed 200 characters")
    private String certificationName;

    @Size(max = 100, message = "Issuing organization cannot exceed 100 characters")
    private String issuingOrganization;

    @NotBlank(message = "Issue date is required")
    private String issueDate;

    private String expirationDate; // Optional

    @URL(message = "Proof must be a valid URL")
    @NotBlank(message = "Proof URL is required")
    @Size(max = 500, message = "Proof URL is too long")
    private String proofUrl;

    // Calculated field, not stored in DB
    private Double credibilityScore;
}