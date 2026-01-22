package com.SkillSwap.PeerToPeerLearning.P3ResumePortal.Experience.DTO;

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
public class ExperienceDto {

    private Long id; // Used for update/response

    @NotBlank(message = "Job Title is required")
    @Size(max = 200, message = "Job Title cannot exceed 200 characters")
    private String jobTitle;

    @NotBlank(message = "Company Name is required")
    @Size(max = 200, message = "Company Name cannot exceed 200 characters")
    private String companyName;

    @NotBlank(message = "Skill Name is required")
    @Size(max = 100, message = "Skill name cannot exceed 100 characters")
    private String skillName;

    @NotBlank(message = "Start Date is required")
    private String startDate;

    private String endDate; // Optional, for current roles

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description; // Optional

    @URL(message = "Proof must be a valid URL")
    @NotBlank(message = "Proof URL is required")
    @Size(max = 500, message = "Proof URL is too long")
    private String proofUrl;
}