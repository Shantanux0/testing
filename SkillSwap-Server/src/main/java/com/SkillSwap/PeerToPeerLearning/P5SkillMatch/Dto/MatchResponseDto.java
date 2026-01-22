package com.SkillSwap.PeerToPeerLearning.P5SkillMatch.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MatchResponseDto {
    private Long userId;
    private String name;
    private String email; // optional, maybe masked
    private String profileImageUrl;
    private String skillName;

    // Scores
    private Double matchScore; // Final weighted score
    private Double testScore;
    private Double certificationScore;
    private Double reputationScore;

    // Additional info
    private String role; // "TEACHER" or "LEARNER"
}
