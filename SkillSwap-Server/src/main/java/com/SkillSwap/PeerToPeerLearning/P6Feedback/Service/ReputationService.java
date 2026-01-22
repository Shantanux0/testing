package com.SkillSwap.PeerToPeerLearning.P6Feedback.Service;

import com.SkillSwap.PeerToPeerLearning.P6Feedback.Repository.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReputationService {

    private final FeedbackRepository feedbackRepository;

    /**
     * Calculates the average reputation score for a user.
     * Returns 0.0 if no feedback exists.
     */
    public Double getUserReputation(Long userId) {
        Double avgRating = feedbackRepository.getAverageRatingForUser(userId);
        return avgRating != null ? avgRating : 0.0;
    }
}
