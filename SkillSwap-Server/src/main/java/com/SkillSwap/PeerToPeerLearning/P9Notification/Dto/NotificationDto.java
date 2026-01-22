package com.SkillSwap.PeerToPeerLearning.P9Notification.Dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class NotificationDto {
    private Long id;
    private String message;
    private String type;
    private boolean read;
    private LocalDateTime createdAt;
    private Long relatedEntityId;
    private String relatedEntityType;
}
