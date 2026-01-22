package com.SkillSwap.PeerToPeerLearning.P8AI.Interfaces;

import java.util.List;
import java.util.Map;

public interface RecommendationEngine {
    /**
     * Recommends content or users based on user profile and behavior.
     * 
     * @param userId  User ID
     * @param context Additional context (e.g., "SKILL_MATCHING", "CONTENT_FEED")
     * @return List of recommended IDs or items
     */
    List<Object> recommend(Long userId, String context);

    /**
     * Updates the model based on user interaction.
     * 
     * @param userId          User ID
     * @param itemId          Item ID
     * @param interactionType Type of interaction (e.g., "CLICK", "COMPLETE",
     *                        "IGNORE")
     */
    void learn(Long userId, String itemId, String interactionType);
}
