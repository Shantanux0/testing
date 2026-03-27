package com.SkillSwap.PeerToPeerLearning.P7Session.Service;

import com.SkillSwap.PeerToPeerLearning.P1Auth.Entity.UserAuthEntity;
import com.SkillSwap.PeerToPeerLearning.P1Auth.Repository.UserAuthRepo;
import com.SkillSwap.PeerToPeerLearning.P7Session.Dto.SessionFeedbackDto;
import com.SkillSwap.PeerToPeerLearning.P7Session.Entity.SessionFeedbackEntity;
import com.SkillSwap.PeerToPeerLearning.P7Session.Entity.SwapSessionEntity;
import com.SkillSwap.PeerToPeerLearning.P7Session.Repository.SessionFeedbackRepository;
import com.SkillSwap.PeerToPeerLearning.P7Session.Repository.SwapSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class FeedbackService {

    private final SessionFeedbackRepository feedbackRepository;
    private final SwapSessionRepository sessionRepository;
    private final UserAuthRepo userAuthRepo;

    /** Submit feedback for a session (star rating + optional comment) */
    public SessionFeedbackDto submitFeedback(String reviewerEmail, Long sessionId, Integer rating, String comment) {
        if (rating < 1 || rating > 5) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rating must be between 1 and 5");
        }

        UserAuthEntity reviewer = findUserByEmail(reviewerEmail);
        SwapSessionEntity session = findSessionById(sessionId);

        // Must be COMPLETED to leave feedback
        if (!"COMPLETED".equalsIgnoreCase(session.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Can only leave feedback for completed sessions");
        }

        // Determine role and the person being rated
        boolean isTeacher = session.getTeacher().getId().equals(reviewer.getId());
        boolean isLearner = session.getLearner().getId().equals(reviewer.getId());

        if (!isTeacher && !isLearner) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not a participant of this session");
        }

        // Already submitted?
        if (feedbackRepository.existsBySessionIdAndGivenById(sessionId, reviewer.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "You have already submitted feedback for this session");
        }

        // Learner rates Teacher, Teacher rates Learner
        UserAuthEntity rated = isLearner ? session.getTeacher() : session.getLearner();
        String role = isLearner ? "LEARNER" : "TEACHER";

        SessionFeedbackEntity feedback = SessionFeedbackEntity.builder()
                .session(session)
                .givenBy(reviewer)
                .givenTo(rated)
                .rating(rating)
                .comment(comment)
                .role(role)
                .build();

        return mapToDto(feedbackRepository.save(feedback));
    }

    /** Get all feedback for a session */
    @Transactional(readOnly = true)
    public List<SessionFeedbackDto> getSessionFeedback(Long sessionId) {
        return feedbackRepository.findBySessionId(sessionId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /** Check whether the current user has already submitted feedback */
    @Transactional(readOnly = true)
    public boolean hasSubmittedFeedback(String email, Long sessionId) {
        UserAuthEntity user = findUserByEmail(email);
        return feedbackRepository.existsBySessionIdAndGivenById(sessionId, user.getId());
    }

    /** Get average rating score for a user (as a teacher) */
    @Transactional(readOnly = true)
    public Map<String, Object> getTeacherStats(String email) {
        UserAuthEntity user = findUserByEmail(email);
        List<SessionFeedbackEntity> received = feedbackRepository.findByGivenToId(user.getId());

        double avg = received.stream().mapToInt(SessionFeedbackEntity::getRating).average().orElse(0.0);
        long totalRatings = received.size();

        return Map.of("averageRating", Math.round(avg * 10.0) / 10.0, "totalRatings", totalRatings);
    }

    private UserAuthEntity findUserByEmail(String email) {
        return userAuthRepo.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private SwapSessionEntity findSessionById(Long id) {
        return sessionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Session not found"));
    }

    private SessionFeedbackDto mapToDto(SessionFeedbackEntity e) {
        return SessionFeedbackDto.builder()
                .id(e.getId())
                .sessionId(e.getSession().getId())
                .givenByUserId(e.getGivenBy().getId())
                .givenByName(e.getGivenBy().getName())
                .givenToUserId(e.getGivenTo().getId())
                .givenToName(e.getGivenTo().getName())
                .rating(e.getRating())
                .comment(e.getComment())
                .role(e.getRole())
                .createdAt(e.getCreatedAt())
                .build();
    }
}
