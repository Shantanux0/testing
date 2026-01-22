package com.SkillSwap.PeerToPeerLearning.P4testPortal.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TestResponse {
    private Long testId;
    private String skillName;
    private Integer totalQuestions;
    private Integer passingScore;
    private List<QuestionDto> questions; // Without correct answers
    private Long expiresAt; // Timestamp when test expires
    private String testStatus;
}