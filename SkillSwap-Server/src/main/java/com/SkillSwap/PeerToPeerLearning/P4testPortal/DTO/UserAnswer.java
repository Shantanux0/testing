package com.SkillSwap.PeerToPeerLearning.P4testPortal.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserAnswer {
    @NotNull(message = "Question number is required")
    private Integer questionNumber;

    @NotBlank(message = "Selected answer is required")
    private String selectedAnswer;
}

