package com.SkillSwap.PeerToPeerLearning.P6Feedback.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FeedbackResponseDto {
    private Long id;
    private Long sessionId;
    private String reviewerName;
    private Integer rating;
    private String comments;
    private String dimensions;
    private LocalDateTime createdAt;
}
