package com.SkillSwap.PeerToPeerLearning.P10Message.Repository;

import com.SkillSwap.PeerToPeerLearning.P10Message.Entity.MessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<MessageEntity, Long> {

    // All messages between two users (the conversation), ordered by time
    @Query("""
            SELECT m FROM MessageEntity m
            WHERE (m.sender.id = :userId1 AND m.receiver.id = :userId2)
               OR (m.sender.id = :userId2 AND m.receiver.id = :userId1)
            ORDER BY m.createdAt ASC
            """)
    List<MessageEntity> findConversation(Long userId1, Long userId2);

    // Get all distinct conversation partners for a user (latest message per
    // partner)
    @Query(value = """
            SELECT DISTINCT ON (partner_id) m.id, m.sender_id, m.receiver_id, m.content,
                   m.is_read, m.created_at, m.session_id,
                   CASE WHEN m.sender_id = :userId THEN m.receiver_id ELSE m.sender_id END AS partner_id
            FROM messages m
            WHERE m.sender_id = :userId OR m.receiver_id = :userId
            ORDER BY partner_id, m.created_at DESC
            """, nativeQuery = true)
    List<Object[]> findConversationPartners(Long userId);

    // Count unread messages TO a user FROM a specific sender
    long countByReceiverIdAndSenderIdAndIsRead(Long receiverId, Long senderId, Boolean isRead);

    // Mark all messages from sender to receiver as read
    @Modifying
    @Query("UPDATE MessageEntity m SET m.isRead = true WHERE m.sender.id = :senderId AND m.receiver.id = :receiverId AND m.isRead = false")
    int markConversationAsRead(Long senderId, Long receiverId);
}
