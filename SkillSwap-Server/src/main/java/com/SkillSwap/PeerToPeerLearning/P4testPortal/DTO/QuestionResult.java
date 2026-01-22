package com.SkillSwap.PeerToPeerLearning.P4testPortal.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class QuestionResult {
    private Integer questionNumber;
    private String question;
    private String correctAnswer;
    private String userAnswer;
    private Boolean isCorrect;
}