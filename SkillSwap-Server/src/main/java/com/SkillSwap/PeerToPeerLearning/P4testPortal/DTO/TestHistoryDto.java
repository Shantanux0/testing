package com.SkillSwap.PeerToPeerLearning.P4testPortal.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TestHistoryDto {
    private Long testId;
    private String skillName;
    private Integer score;
    private Integer totalQuestions;
    private Boolean isPassed;
    private String testStatus;
    private String createdAt;
    private Long testExpiresAt;
}