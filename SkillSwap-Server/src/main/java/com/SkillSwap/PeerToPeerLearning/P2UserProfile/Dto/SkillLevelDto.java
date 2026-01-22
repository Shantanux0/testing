package com.SkillSwap.PeerToPeerLearning.P2UserProfile.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SkillLevelDto {
    private Long id;
    private String skillName;
    private String proficiencyLevel; // BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
    private Integer yearsOfExperience;
    private Integer selfRating; // 1-5
    private Integer projectsCompleted;
    private LocalDate lastUsedDate;
    private Boolean willingToTeach;
}
