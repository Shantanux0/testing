package com.SkillSwap.PeerToPeerLearning.P10Message.Controller;

import com.SkillSwap.PeerToPeerLearning.P10Message.Dto.ConversationSummaryDto;
import com.SkillSwap.PeerToPeerLearning.P10Message.Dto.MessageDto;
import com.SkillSwap.PeerToPeerLearning.P10Message.Service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    /**
     * GET /api/messages/conversations
     * Returns all conversation partners with last message + unread count.
     */
    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationSummaryDto>> getConversations(Authentication auth) {
        return ResponseEntity.ok(messageService.getConversations(auth.getName()));
    }

    /**
     * GET /api/messages/conversation/{partnerId}
     * Returns all messages in the conversation with the given partner.
     * Also marks incoming messages as read.
     */
    @GetMapping("/conversation/{partnerId}")
    public ResponseEntity<List<MessageDto>> getConversation(
            @PathVariable Long partnerId,
            Authentication auth) {
        return ResponseEntity.ok(messageService.getConversation(auth.getName(), partnerId));
    }

    /**
     * POST /api/messages/send
     * Send a message.
     * Body: { "receiverId": 2, "content": "Hello!", "sessionId": 5 (optional) }
     */
    @PostMapping("/send")
    public ResponseEntity<MessageDto> sendMessage(
            @RequestBody Map<String, Object> body,
            Authentication auth) {
        Long receiverId = ((Number) body.get("receiverId")).longValue();
        String content = (String) body.get("content");
        Long sessionId = body.get("sessionId") != null ? ((Number) body.get("sessionId")).longValue() : null;
        return ResponseEntity.ok(messageService.sendMessage(auth.getName(), receiverId, content, sessionId));
    }
}
