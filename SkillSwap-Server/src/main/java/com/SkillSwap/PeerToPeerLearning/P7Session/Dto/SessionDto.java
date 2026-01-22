package com.SkillSwap.PeerToPeerLearning.P7Session.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SessionDto {
    private Long sessionId;
    private String skillName;
    private String status;
    private Long partnerId;
    private String partnerName;
    private String role; // "TEACHER" or "LEARNER"
    private LocalDateTime createdAt;
    private LocalDateTime scheduledTime;
}
