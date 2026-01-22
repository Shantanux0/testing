package com.SkillSwap.PeerToPeerLearning.P7Session.Service;

import com.SkillSwap.PeerToPeerLearning.P1Auth.Entity.UserAuthEntity;
import com.SkillSwap.PeerToPeerLearning.P1Auth.Repository.UserAuthRepo;
import com.SkillSwap.PeerToPeerLearning.P7Session.Dto.SessionDto;
import com.SkillSwap.PeerToPeerLearning.P7Session.Entity.SwapSessionEntity;
import com.SkillSwap.PeerToPeerLearning.P7Session.Repository.SwapSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final SwapSessionRepository sessionRepository;
    private final UserAuthRepo userAuthRepo;
    private final com.SkillSwap.PeerToPeerLearning.P9Notification.Service.NotificationService notificationService;

    public SessionDto requestSession(String learnerEmail, Long teacherId, String skillName) {
        UserAuthEntity learner = findUserByEmail(learnerEmail);
        UserAuthEntity teacher = userAuthRepo.findById(teacherId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Teacher not found"));

        if (learner.getId().equals(teacher.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot request session with yourself");
        }

        if (sessionRepository.existsByLearnerIdAndTeacherIdAndSkillNameAndStatus(
                learner.getId(), teacher.getId(), skillName, "REQUESTED")) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Session request already pending");
        }

        SwapSessionEntity session = SwapSessionEntity.builder()
                .learner(learner)
                .teacher(teacher)
                .skillName(skillName)
                .status("REQUESTED")
                .build();

        session = sessionRepository.save(session);

        // Notify Teacher
        notificationService.createNotification(
                teacher.getId(),
                "New Request: " + learner.getName() + " wants to learn " + skillName + ".",
                "INFO",
                session.getId(),
                "SESSION");

        return mapToDto(session, learner.getId());
    }

    public SessionDto updateSessionStatus(String userEmail, Long sessionId, String status) {
        UserAuthEntity user = findUserByEmail(userEmail);
        SwapSessionEntity session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Session not found"));

        if (!session.getTeacher().getId().equals(user.getId()) && !session.getLearner().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized to update this session");
        }

        // Logic validation
        // Only teacher can ACCEPT/REJECT
        if (("ACCEPTED".equalsIgnoreCase(status) || "REJECTED".equalsIgnoreCase(status))) {
            if (!session.getTeacher().getId().equals(user.getId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only teacher can accept/reject session");
            }
        }

        session.setStatus(status.toUpperCase());
        session = sessionRepository.save(session);

        // Notify relevant party
        if ("ACCEPTED".equalsIgnoreCase(status)) {
            // Teacher accepted -> Notify Learner
            notificationService.createNotification(
                    session.getLearner().getId(),
                    "Session Accepted! " + session.getTeacher().getName() + " accepted your request for "
                            + session.getSkillName() + ".",
                    "SUCCESS",
                    session.getId(),
                    "SESSION");
        } else if ("REJECTED".equalsIgnoreCase(status)) {
            // Teacher rejected -> Notify Learner
            notificationService.createNotification(
                    session.getLearner().getId(),
                    "Session Declined: " + session.getTeacher().getName() + " cannot help with "
                            + session.getSkillName() + " right now.",
                    "WARNING",
                    session.getId(),
                    "SESSION");
        }

        return mapToDto(session, user.getId());
    }

    public List<SessionDto> getMySessions(String email) {
        UserAuthEntity user = findUserByEmail(email);
        return sessionRepository.findByLearnerIdOrTeacherId(user.getId(), user.getId()).stream()
                .map(s -> mapToDto(s, user.getId()))
                .collect(Collectors.toList());
    }

    private UserAuthEntity findUserByEmail(String email) {
        return userAuthRepo.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private SessionDto mapToDto(SwapSessionEntity entity, Long currentUserId) {
        boolean isTeacher = entity.getTeacher().getId().equals(currentUserId);
        UserAuthEntity partner = isTeacher ? entity.getLearner() : entity.getTeacher();

        return SessionDto.builder()
                .sessionId(entity.getId())
                .skillName(entity.getSkillName())
                .status(entity.getStatus())
                .partnerId(partner.getId())
                .partnerName(partner.getName())
                .role(isTeacher ? "TEACHER" : "LEARNER")
                .createdAt(entity.getCreatedAt())
                .scheduledTime(entity.getScheduledTime())
                .build();
    }
}
