package com.SkillSwap.PeerToPeerLearning.P7Session.Dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class SessionFeedbackDto {
    private Long id;
    private Long sessionId;
    private Long givenByUserId;
    private String givenByName;
    private Long givenToUserId;
    private String givenToName;
    private Integer rating;
    private String comment;
    private String role;
    private LocalDateTime createdAt;
}
