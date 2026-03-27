package com.SkillSwap.PeerToPeerLearning.P7Session.Service;

import com.SkillSwap.PeerToPeerLearning.P1Auth.Entity.UserAuthEntity;
import com.SkillSwap.PeerToPeerLearning.P1Auth.Repository.UserAuthRepo;
import com.SkillSwap.PeerToPeerLearning.P7Session.Dto.AgendaItemDto;
import com.SkillSwap.PeerToPeerLearning.P7Session.Dto.CreateAgendaRequest;
import com.SkillSwap.PeerToPeerLearning.P7Session.Entity.SessionAgendaEntity;
import com.SkillSwap.PeerToPeerLearning.P7Session.Entity.SwapSessionEntity;
import com.SkillSwap.PeerToPeerLearning.P7Session.Repository.SessionAgendaRepository;
import com.SkillSwap.PeerToPeerLearning.P7Session.Repository.SwapSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AgendaService {

    private final SessionAgendaRepository agendaRepository;
    private final SwapSessionRepository sessionRepository;
    private final UserAuthRepo userAuthRepo;

    /** Teacher creates agenda items for a session */
    public List<AgendaItemDto> createAgenda(String teacherEmail, Long sessionId, CreateAgendaRequest request) {
        UserAuthEntity teacher = findUserByEmail(teacherEmail);
        SwapSessionEntity session = findSessionById(sessionId);

        // Only the teacher of this session can create an agenda
        if (!session.getTeacher().getId().equals(teacher.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the teacher can create agenda items");
        }

        // Delete existing agenda for idempotent re-creation
        agendaRepository.deleteAll(agendaRepository.findBySessionIdOrderByOrderIndexAsc(sessionId));

        List<SessionAgendaEntity> items = request.getItems().stream()
                .map(item -> SessionAgendaEntity.builder()
                        .session(session)
                        .topic(item.getTopic())
                        .description(item.getDescription())
                        .orderIndex(item.getOrderIndex() != null ? item.getOrderIndex() : 0)
                        .isCompleted(false)
                        .build())
                .collect(Collectors.toList());

        return agendaRepository.saveAll(items).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /** Get all agenda items for a session */
    @Transactional(readOnly = true)
    public List<AgendaItemDto> getAgenda(Long sessionId) {
        return agendaRepository.findBySessionIdOrderByOrderIndexAsc(sessionId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /** Learner marks an agenda item as complete */
    public AgendaItemDto markItem(String learnerEmail, Long itemId, boolean completed) {
        UserAuthEntity learner = findUserByEmail(learnerEmail);
        SessionAgendaEntity item = agendaRepository.findById(itemId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Agenda item not found"));

        SwapSessionEntity session = item.getSession();

        // Only the learner of this session can mark items
        if (!session.getLearner().getId().equals(learner.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the learner can mark agenda items");
        }

        item.setIsCompleted(completed);
        item.setCompletedBy(completed ? learner : null);
        item.setCompletedAt(completed ? LocalDateTime.now() : null);

        return mapToDto(agendaRepository.save(item));
    }

    /** Get completion percentage for a session */
    @Transactional(readOnly = true)
    public double getCompletionRate(Long sessionId) {
        long total = agendaRepository.countBySessionId(sessionId);
        if (total == 0)
            return 0.0;
        long done = agendaRepository.countBySessionIdAndIsCompleted(sessionId, true);
        return Math.round((double) done / total * 100.0);
    }

    private UserAuthEntity findUserByEmail(String email) {
        return userAuthRepo.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private SwapSessionEntity findSessionById(Long sessionId) {
        return sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Session not found"));
    }

    private AgendaItemDto mapToDto(SessionAgendaEntity e) {
        return AgendaItemDto.builder()
                .id(e.getId())
                .sessionId(e.getSession().getId())
                .topic(e.getTopic())
                .description(e.getDescription())
                .orderIndex(e.getOrderIndex())
                .isCompleted(e.getIsCompleted())
                .completedByUserId(e.getCompletedBy() != null ? e.getCompletedBy().getId() : null)
                .completedAt(e.getCompletedAt())
                .createdAt(e.getCreatedAt())
                .build();
    }
}
