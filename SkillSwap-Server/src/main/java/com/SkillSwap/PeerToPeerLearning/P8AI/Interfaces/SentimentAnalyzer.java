package com.SkillSwap.PeerToPeerLearning.P8AI.Interfaces;

public interface SentimentAnalyzer {
    /**
     * Analyzes text and returns a sentiment score.
     * 
     * @param text Text to analyze
     * @return Score between -1.0 (Negative) and 1.0 (Positive)
     */
    Double analyzeSentiment(String text);

    /**
     * Extracts key phrases or topics from text.
     * 
     * @param text Text to analyze
     * @return Array of key phrases
     */
    String[] extractKeyPhrases(String text);
}
