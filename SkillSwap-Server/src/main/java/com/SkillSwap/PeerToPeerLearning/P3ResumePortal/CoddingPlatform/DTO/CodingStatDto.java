package com.SkillSwap.PeerToPeerLearning.P3ResumePortal.CoddingPlatform.DTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class CodingStatDto {

    private Long id; // Used for update/response

    @NotBlank(message = "Platform name is required")
    @Size(max = 100, message = "Platform name cannot exceed 100 characters")
    private String platformName;

    @URL(message = "Profile URL must be valid")
    @NotBlank(message = "Profile URL is required")
    @Size(max = 500, message = "Profile URL is too long")
    private String profileUrl;

    @NotNull(message = "Total problems solved is required")
    @Min(value = 0, message = "Solved count cannot be negative")
    private Integer totalProblemsSolved;

    @NotNull(message = "Easy problems solved is required")
    @Min(value = 0, message = "Easy count cannot be negative")
    private Integer easySolved;

    @NotNull(message = "Medium problems solved is required")
    @Min(value = 0, message = "Medium count cannot be negative")
    private Integer mediumSolved;

    @NotNull(message = "Hard problems solved is required")
    @Min(value = 0, message = "Hard count cannot be negative")
    private Integer hardSolved;

    @URL(message = "Proof must be a valid URL")
    @NotBlank(message = "Proof URL is required")
    @Size(max = 500, message = "Proof URL is too long")
    private String proofUrl;
}