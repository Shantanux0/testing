package com.SkillSwap.PeerToPeerLearning.P3ResumePortal.Education.DTO;

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
public class EducationDto {

    private Long id; // Used for update/response

    @NotBlank(message = "Education level is required")
    private String educationLevel; // 10th Grade, 12th Grade, Bachelor's, etc.

    @NotBlank(message = "Institution name is required")
    @Size(max = 200, message = "Institution name cannot exceed 200 characters")
    private String institutionName;

    @NotBlank(message = "Board or University name is required")
    @Size(max = 200, message = "Board/University name cannot exceed 200 characters")
    private String boardOrUniversity;

    @Size(max = 200, message = "Field of study cannot exceed 200 characters")
    private String fieldOfStudy; // Optional for 10th/12th

    @NotBlank(message = "Passing Year is required")
    @Size(min = 4, max = 4, message = "Passing Year must be a 4-digit year (e.g., 2022)")
    private String passingYear;

    @NotBlank(message = "Score details are required")
    @Size(max = 50, message = "Score details cannot exceed 50 characters")
    private String scoreDetails; // e.g., "90%", "9.5 CGPA"

    @URL(message = "Proof must be a valid URL")
    @NotBlank(message = "Proof URL is required")
    @Size(max = 500, message = "Proof URL is too long")
    private String proofUrl;
}