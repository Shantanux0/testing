package com.SkillSwap.PeerToPeerLearning.P4testPortal.Service.IMPL;

import com.SkillSwap.PeerToPeerLearning.P4testPortal.DTO.TestQuestion;
import com.SkillSwap.PeerToPeerLearning.P4testPortal.Service.AIQuestionGeneratorService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class GroqAIQuestionGeneratorServiceImpl implements AIQuestionGeneratorService {

    @Value("${groq.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper;

    private static final String GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

    @Override
    public List<TestQuestion> generateQuestions(String skillName, int numberOfQuestions) {
        log.info("Generating {} questions for skill: {} using Groq AI (Llama 3.3)", numberOfQuestions, skillName);

        String prompt = String.format(
                "Generate exactly %d hard-level multiple-choice questions for the skill '%s'. " +
                "Return the output strictly in the following JSON format: " +
                "[{\"questionNumber\": 1, \"question\": \"text\", \"options\": [\"A\", \"B\", \"C\", \"D\"], \"correctAnswer\": \"A\"}]. " +
                "Do not include any introductory text or explanation. Only the JSON array.",
                numberOfQuestions, skillName
        );

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> requestBody = Map.of(
                    "model", "llama-3.3-70b-versatile",
                    "messages", List.of(Map.of("role", "user", "content", prompt)),
                    "temperature", 0.7
            );

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            String response = restTemplate.postForObject(GROQ_URL, entity, String.class);

            JsonNode root = objectMapper.readTree(response);
            String content = root.path("choices").get(0).path("message").path("content").asText();

            // Clean up content if AI includes markdown code blocks
            if (content.contains("```json")) {
                content = content.substring(content.indexOf("```json") + 7);
                content = content.substring(0, content.lastIndexOf("```"));
            } else if (content.contains("```")) {
                content = content.substring(content.indexOf("```") + 3);
                content = content.substring(0, content.lastIndexOf("```"));
            }

            return objectMapper.readValue(content, 
                objectMapper.getTypeFactory().constructCollectionType(List.class, TestQuestion.class));

        } catch (Exception e) {
            log.error("Failed to generate questions using Groq AI: {}", e.getMessage());
            return new ArrayList<>(); // Fallback will be handled by the caller
        }
    }

    @Override
    public String getProviderName() {
        return "GROQ";
    }
}
