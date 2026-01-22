package com.SkillSwap.PeerToPeerLearning.P6Feedback.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FeedbackDto {
    private Long id;

    @NotNull
    private Long sessionId; // Optional connection to session

    @NotNull
    private Long revieweeId; // Who is being rated

    @Min(1)
    @Max(5)
    private Integer rating;

    private String comments;

    // e.g., "Communication:5,Punctuality:4"
    private String dimensions;
}
