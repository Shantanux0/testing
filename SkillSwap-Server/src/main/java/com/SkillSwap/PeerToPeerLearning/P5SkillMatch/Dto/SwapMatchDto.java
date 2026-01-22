package com.SkillSwap.PeerToPeerLearning.P5SkillMatch.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SwapMatchDto {
    // Partner information
    private Long partnerId;
    private String partnerName;
    private String partnerEmail;
    private String profileImageUrl;
    private String location;
    private String timezone;

    // Skills being swapped
    private String skillILearn; // What I get from them
    private String skillITeach; // What I give to them

    // Overall match info
    private Double matchScore; // 0-1 overall compatibility
    private String swapType; // "PERFECT_SWAP" or "PARTIAL_MATCH"
    private Boolean mutualMatch; // true if bidirectional

    // Component scores (all 0-1)
    private Double skillLevelGapScore;
    private Double goalAlignmentScore;
    private Double availabilityScore;
    private Double timeCommitmentScore;
    private Double learningStyleScore;

    // Historical scores (always available since tests are required)
    private Double theirTestScore;
    private Double theirCertScore;
    private Double theirReputationScore;
    private Double myTestScore;
    private Double myCertScore;
    private Double myReputationScore;

    // Detailed match breakdown
    private String theirSkillLevel; // e.g., "ADVANCED"
    private String mySkillLevel; // e.g., "BEGINNER"
    private String theirGoal; // e.g., "REINFORCE_KNOWLEDGE"
    private String myGoal; // e.g., "JOB_PREP"
    private Integer availabilityOverlapHours; // Hours/week overlap
    private String compatibilityReason; // Human-readable match explanation

    // Additional partner info
    private String partnerBio;
    private String partnerSkills;
    private String partnerSkillsToLearn;
    private Integer partnerHoursPerWeek;
    private String partnerLearningMethod;
    private String partnerDomainFocus;
}
