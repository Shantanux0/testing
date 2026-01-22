package com.SkillSwap.PeerToPeerLearning.P4TestPortal.Service;



import com.SkillSwap.PeerToPeerLearning.P4testPortal.DTO.TestQuestion;

import java.util.List;

/**
 * Interface for AI-powered question generation
 * Can be implemented by OpenAI, Gemini, or other AI providers
 */
public interface AIQuestionGeneratorService {

    /**
     * Generate hard-level questions for a specific skill
     * @param skillName The skill to generate questions for
     * @param numberOfQuestions Number of questions to generate (15)
     * @return List of generated questions with options and answers
     */
    List<TestQuestion> generateQuestions(String skillName, int numberOfQuestions);

    /**
     * Get the provider name (OPENAI or GEMINI)
     * @return Provider name
     */
    String getProviderName();
}