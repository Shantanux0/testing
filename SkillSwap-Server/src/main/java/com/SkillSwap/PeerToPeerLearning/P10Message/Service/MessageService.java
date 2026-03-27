package com.SkillSwap.PeerToPeerLearning.P10Message.Service;

import com.SkillSwap.PeerToPeerLearning.P1Auth.Entity.UserAuthEntity;
import com.SkillSwap.PeerToPeerLearning.P1Auth.Repository.UserAuthRepo;
import com.SkillSwap.PeerToPeerLearning.P10Message.Dto.ConversationSummaryDto;
import com.SkillSwap.PeerToPeerLearning.P10Message.Dto.MessageDto;
import com.SkillSwap.PeerToPeerLearning.P10Message.Entity.MessageEntity;
import com.SkillSwap.PeerToPeerLearning.P10Message.Repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserAuthRepo userAuthRepo;

    /** Send a message from current user to receiver */
    public MessageDto sendMessage(String senderEmail, Long receiverId, String content, Long sessionId) {
        UserAuthEntity sender = findByEmail(senderEmail);
        UserAuthEntity receiver = userAuthRepo.findById(receiverId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Receiver not found"));

        if (sender.getId().equals(receiverId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot send message to yourself");
        }

        MessageEntity msg = MessageEntity.builder()
                .sender(sender)
                .receiver(receiver)
                .content(content.trim())
                .isRead(false)
                .sessionId(sessionId)
                .build();

        MessageEntity saved = messageRepository.save(msg);
        return mapToDto(saved, sender.getId());
    }

    /** Get conversation messages between current user and another user */
    @Transactional
    public List<MessageDto> getConversation(String currentEmail, Long partnerId) {
        UserAuthEntity current = findByEmail(currentEmail);
        // Mark incoming messages as read
        messageRepository.markConversationAsRead(partnerId, current.getId());
        return messageRepository.findConversation(current.getId(), partnerId)
                .stream()
                .map(m -> mapToDto(m, current.getId()))
                .collect(Collectors.toList());
    }

    /** List all conversation partners with last message and unread count */
    @Transactional(readOnly = true)
    public List<ConversationSummaryDto> getConversations(String email) {
        UserAuthEntity current = findByEmail(email);
        List<Object[]> rows = messageRepository.findConversationPartners(current.getId());

        return rows.stream().map(row -> {
            Long partnerId = ((Number) row[7]).longValue();
            UserAuthEntity partner = userAuthRepo.findById(partnerId).orElse(null);
            if (partner == null)
                return null;

            String content = (String) row[3];
            java.sql.Timestamp ts = (java.sql.Timestamp) row[5];
            Long sessionId = row[6] != null ? ((Number) row[6]).longValue() : null;
            long unread = messageRepository.countByReceiverIdAndSenderIdAndIsRead(current.getId(), partnerId, false);

            return ConversationSummaryDto.builder()
                    .partnerId(partner.getId())
                    .partnerName(partner.getName())
                    .partnerEmail(partner.getEmail())
                    .lastMessage(content)
                    .lastMessageAt(ts != null ? ts.toLocalDateTime() : null)
                    .unreadCount(unread)
                    .sessionId(sessionId)
                    .build();
        }).filter(d -> d != null).collect(Collectors.toList());
    }

    private UserAuthEntity findByEmail(String email) {
        return userAuthRepo.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private MessageDto mapToDto(MessageEntity m, Long currentUserId) {
        return MessageDto.builder()
                .id(m.getId())
                .senderId(m.getSender().getId())
                .senderName(m.getSender().getName())
                .receiverId(m.getReceiver().getId())
                .receiverName(m.getReceiver().getName())
                .sessionId(m.getSessionId())
                .content(m.getContent())
                .isRead(m.getIsRead())
                .createdAt(m.getCreatedAt())
                .isOwn(m.getSender().getId().equals(currentUserId))
                .build();
    }
}
