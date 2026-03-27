package com.SkillSwap.PeerToPeerLearning.P10Message.Dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ConversationSummaryDto {
    private Long partnerId;
    private String partnerName;
    private String partnerEmail;
    private String lastMessage;
    private LocalDateTime lastMessageAt;
    private Long unreadCount;
    private Long sessionId;
}
