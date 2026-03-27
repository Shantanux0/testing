package com.SkillSwap.PeerToPeerLearning.P7Session.Dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AgendaItemDto {
    private Long id;
    private Long sessionId;
    private String topic;
    private String description;
    private Integer orderIndex;
    private Boolean isCompleted;
    private Long completedByUserId;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
}
