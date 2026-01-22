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
public class TestResultResponse {
    private Long testId;
    private String skillName;
    private Integer score;
    private Integer totalQuestions;
    private Integer passingScore;
    private Boolean isPassed;
    private List<QuestionResult> questionResults;
}
