package com.SkillSwap.PeerToPeerLearning.P9Notification.Service;

import com.SkillSwap.PeerToPeerLearning.P1Auth.Entity.UserAuthEntity;
import com.SkillSwap.PeerToPeerLearning.P1Auth.Repository.UserAuthRepo;
import com.SkillSwap.PeerToPeerLearning.P9Notification.Dto.NotificationDto;
import com.SkillSwap.PeerToPeerLearning.P9Notification.Entity.NotificationEntity;
import com.SkillSwap.PeerToPeerLearning.P9Notification.Repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserAuthRepo userAuthRepo;

    public void createNotification(Long userId, String message, String type, Long relatedId, String relatedType) {
        UserAuthEntity user = userAuthRepo.findById(userId).orElse(null);
        if (user == null)
            return;

        NotificationEntity notification = NotificationEntity.builder()
                .user(user)
                .message(message)
                .type(type) // INFO, SUCCESS, WARNING
                .relatedEntityId(relatedId)
                .relatedEntityType(relatedType)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);
    }

    public List<NotificationDto> getMyNotifications(String email) {
        UserAuthEntity user = userAuthRepo.findByEmail(email).orElseThrow();
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    public long getUnreadCount(String email) {
        UserAuthEntity user = userAuthRepo.findByEmail(email).orElseThrow();
        return notificationRepository.countByUserIdAndIsReadFalse(user.getId());
    }

    private NotificationDto mapToDto(NotificationEntity entity) {
        return NotificationDto.builder()
                .id(entity.getId())
                .message(entity.getMessage())
                .type(entity.getType())
                .read(entity.isRead())
                .createdAt(entity.getCreatedAt())
                .relatedEntityId(entity.getRelatedEntityId())
                .relatedEntityType(entity.getRelatedEntityType())
                .build();
    }
}
