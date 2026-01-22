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

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor

public class FeedbackController {

        private final FeedbackRepository feedbackRepository;
        private final UserAuthRepo userAuthRepo;

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
}
