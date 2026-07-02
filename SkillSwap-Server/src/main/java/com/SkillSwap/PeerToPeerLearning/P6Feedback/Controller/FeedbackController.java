package com.SkillSwap.PeerToPeerLearning.P6Feedback.Controller;

import com.SkillSwap.PeerToPeerLearning.P1Auth.Entity.UserAuthEntity;
import com.SkillSwap.PeerToPeerLearning.P1Auth.Repository.UserAuthRepo;
import com.SkillSwap.PeerToPeerLearning.P6Feedback.Dto.FeedbackDto;
import com.SkillSwap.PeerToPeerLearning.P6Feedback.Entity.FeedbackEntity;
import com.SkillSwap.PeerToPeerLearning.P6Feedback.Repository.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor

public class FeedbackController {

        private final FeedbackRepository feedbackRepository;
        private final UserAuthRepo userAuthRepo;
        private final com.SkillSwap.PeerToPeerLearning.P7Session.Repository.SessionFeedbackRepository sessionFeedbackRepository;

        @PostMapping("/submit")
        public ResponseEntity<String> submitFeedback(
                        @RequestBody FeedbackDto dto,
                        Authentication authentication) {

                String reviewerEmail = authentication.getName();
                UserAuthEntity reviewer = userAuthRepo.findByEmail(reviewerEmail)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Reviewer not found"));

                UserAuthEntity reviewee = userAuthRepo.findById(dto.getRevieweeId())
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Reviewee not found"));

                if (reviewer.getId().equals(reviewee.getId())) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot review yourself");
                }

                FeedbackEntity feedback = FeedbackEntity.builder()
                                .reviewer(reviewer)
                                .reviewee(reviewee)
                                .sessionId(dto.getSessionId())
                                .rating(dto.getRating())
                                .comments(dto.getComments())
                                .dimensions(dto.getDimensions())
                                .build();

                feedbackRepository.save(feedback);
                return ResponseEntity.ok("Feedback submitted successfully");
        }

        @GetMapping("/my-feedback")
        @Transactional(readOnly = true)
        public ResponseEntity<java.util.List<com.SkillSwap.PeerToPeerLearning.P6Feedback.Dto.FeedbackResponseDto>> getMyFeedback(
                        Authentication authentication) {

                String email = authentication.getName();
                UserAuthEntity user = userAuthRepo.findByEmail(email)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "User not found"));

                java.util.List<com.SkillSwap.PeerToPeerLearning.P6Feedback.Dto.FeedbackResponseDto> response = new java.util.ArrayList<>();

                // 1. Fetch from user_feedback (P6Feedback)
                feedbackRepository.findByRevieweeId(user.getId())
                                .forEach(f -> response.add(com.SkillSwap.PeerToPeerLearning.P6Feedback.Dto.FeedbackResponseDto.builder()
                                                .id(f.getId())
                                                .sessionId(f.getSessionId())
                                                .reviewerName(f.getReviewer().getName())
                                                .rating(f.getRating())
                                                .comments(f.getComments())
                                                .dimensions(f.getDimensions())
                                                .createdAt(f.getCreatedAt())
                                                .build()));

                // 2. Fetch from session_feedback (P7Session)
                sessionFeedbackRepository.findByGivenToId(user.getId())
                                .forEach(f -> response.add(com.SkillSwap.PeerToPeerLearning.P6Feedback.Dto.FeedbackResponseDto.builder()
                                                .id(f.getId())
                                                .sessionId(f.getSession().getId())
                                                .reviewerName(f.getGivenBy().getName())
                                                .rating(f.getRating())
                                                .comments(f.getComment())
                                                .dimensions("")
                                                .createdAt(f.getCreatedAt())
                                                .build()));

                // Sort by createdAt descending (newest first)
                response.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));

                return ResponseEntity.ok(response);
        }
}
