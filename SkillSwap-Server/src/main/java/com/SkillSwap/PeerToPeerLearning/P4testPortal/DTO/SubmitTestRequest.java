package com.SkillSwap.PeerToPeerLearning.P4testPortal.DTO;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SubmitTestRequest {
    @NotNull(message = "Test ID is required")
    private Long testId;

    @NotNull(message = "Answers are required")
    private List<UserAnswer> answers;
}