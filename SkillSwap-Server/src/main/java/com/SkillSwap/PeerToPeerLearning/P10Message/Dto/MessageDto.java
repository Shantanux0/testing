package com.SkillSwap.PeerToPeerLearning.P10Message.Dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MessageDto {
    private Long id;
    private Long senderId;
    private String senderName;
    private Long receiverId;
    private String receiverName;
    private Long sessionId;
    private String content;
    private Boolean isRead;
    private LocalDateTime createdAt;
    private Boolean isOwn; // computed field for frontend
}
