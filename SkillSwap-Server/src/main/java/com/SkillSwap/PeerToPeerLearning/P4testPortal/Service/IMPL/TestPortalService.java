package com.SkillSwap.PeerToPeerLearning.P4testPortal.Service.IMPL;

import com.SkillSwap.PeerToPeerLearning.P1Auth.Entity.UserAuthEntity;
import com.SkillSwap.PeerToPeerLearning.P1Auth.Repository.UserAuthRepo;
import com.SkillSwap.PeerToPeerLearning.P4testPortal.DTO.*;
import com.SkillSwap.PeerToPeerLearning.P4testPortal.Entity.UserSkillTestEntity;
import com.SkillSwap.PeerToPeerLearning.P4testPortal.Repository.UserSkillTestRepository;
import com.SkillSwap.PeerToPeerLearning.P2UserProfile.Service.UserSkillLevelService;
import com.SkillSwap.PeerToPeerLearning.P2UserProfile.Dto.SkillLevelDto;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class TestPortalService {

    private final UserAuthRepo userAuthRepo;
    private final UserSkillTestRepository testRepository;
    private final ObjectMapper objectMapper;
    private final UserSkillLevelService userSkillLevelService;

    private static final int TOTAL_QUESTIONS = 15;
    private static final int PASSING_SCORE = 10; // 67%
    private static final long TEST_DURATION_MINUTES = 30;

    public TestResponse generateTest(String email, GenerateTestRequest request) {
        UserAuthEntity user = findUserByEmail(email);

        // Already passed?
        if (testRepository.existsByUser_IdAndSkillNameAndIsPassed(user.getId(), request.getSkillName(), true)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "You have already passed the test for this skill");
        }

        // Reuse pending/non-expired test
        List<UserSkillTestEntity> pendingTests = testRepository.findByUser_IdAndTestStatusIn(
                user.getId(), List.of("PENDING", "IN_PROGRESS"));

        Optional<UserSkillTestEntity> existingTest = pendingTests.stream()
                .filter(t -> t.getSkillName().equalsIgnoreCase(request.getSkillName()))
                .findFirst();

        if (existingTest.isPresent()) {
            UserSkillTestEntity test = existingTest.get();
            if (test.getTestExpiresAt() > System.currentTimeMillis()) {
                return mapToTestResponse(test);
            } else {
                test.setTestStatus("EXPIRED");
                testRepository.save(test);
            }
        }

        // ---- Manual: no AI, pull from StaticQuestionBank ----
        List<TestQuestion> questions;
        try {
            questions = StaticQuestionBank.getQuestionsOrThrow(request.getSkillName());
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
        }

        if (questions.size() != TOTAL_QUESTIONS) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Static bank misconfigured: expected " + TOTAL_QUESTIONS + " questions");
        }

        UserSkillTestEntity testEntity = createTestEntity(user, request.getSkillName(), questions, "MANUAL");
        testEntity = testRepository.save(testEntity);

        return mapToTestResponse(testEntity);
    }

    public TestResponse getTest(String email, Long testId) {
        UserAuthEntity user = findUserByEmail(email);
        UserSkillTestEntity test = testRepository.findByIdAndUser_Id(testId, user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Test not found or does not belong to user"));

        if (test.getTestExpiresAt() < System.currentTimeMillis() && !test.getTestStatus().equals("COMPLETED")) {
            test.setTestStatus("EXPIRED");
            testRepository.save(test);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Test has expired");
        }

        return mapToTestResponse(test);
    }

    public TestResultResponse submitTest(String email, SubmitTestRequest request) {
        UserAuthEntity user = findUserByEmail(email);
        UserSkillTestEntity test = testRepository.findByIdAndUser_Id(request.getTestId(), user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Test not found or does not belong to user"));

        if (!test.getTestStatus().equals("PENDING") && !test.getTestStatus().equals("IN_PROGRESS")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Test has already been submitted or expired");
        }

        if (test.getTestExpiresAt() < System.currentTimeMillis()) {
            test.setTestStatus("EXPIRED");
            testRepository.save(test);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Test has expired");
        }

        if (request.getAnswers().size() != TOTAL_QUESTIONS) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "All questions must be answered");
        }

        List<TestQuestion> questions = parseQuestionsJson(test.getQuestionsJson());
        List<String> correctAnswers = parseAnswersJson(test.getAnswersJson());

        int score = calculateScore(request.getAnswers(), correctAnswers);
        boolean isPassed = score >= PASSING_SCORE;

        test.setUserResponsesJson(serializeUserAnswers(request.getAnswers()));
        test.setScore(score);
        test.setIsPassed(isPassed);
        test.setTestStatus("COMPLETED");
        testRepository.save(test);

        // AUTO-CREATE SKILL LEVEL IF PASSED
        if (isPassed) {
            try {
                SkillLevelDto skillLevelDto = SkillLevelDto.builder()
                        .skillName(test.getSkillName())
                        .proficiencyLevel("EXPERT")
                        .willingToTeach(true)
                        .selfRating(5)
                        .yearsOfExperience(1) // Default to 1 year
                        .build();
                userSkillLevelService.addOrUpdateSkillLevel(email, skillLevelDto);
                log.info("Auto-created EXPERT skill level for user {} skill {}", email, test.getSkillName());
            } catch (Exception e) {
                log.error("Failed to auto-create skill level for user {}", email, e);
                // Non-blocking
            }
        }

        return buildTestResult(test, questions, request.getAnswers(), correctAnswers);
    }

    @Transactional(readOnly = true)
    public List<TestHistoryDto> getTestHistory(String email) {
        UserAuthEntity user = findUserByEmail(email);
        return testRepository.findByUser_IdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::mapToHistoryDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TestResultResponse getTestResult(String email, Long testId) {
        UserAuthEntity user = findUserByEmail(email);
        UserSkillTestEntity test = testRepository.findByIdAndUser_Id(testId, user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Test not found or does not belong to user"));

        if (!test.getTestStatus().equals("COMPLETED")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Test has not been completed yet");
        }

        List<TestQuestion> questions = parseQuestionsJson(test.getQuestionsJson());
        List<String> correctAnswers = parseAnswersJson(test.getAnswersJson());
        List<UserAnswer> userAnswers = parseUserResponsesJson(test.getUserResponsesJson());

        return buildTestResult(test, questions, userAnswers, correctAnswers);
    }

    @Transactional(readOnly = true)
    public boolean isUserQualifiedForSkill(String email, String skillName) {
        UserAuthEntity user = findUserByEmail(email);
        return testRepository.existsByUser_IdAndSkillNameAndIsPassed(user.getId(), skillName, true);
    }

    @Transactional(readOnly = true)
    public Double getBestTestScore(Long userId, String skillName) {
        // Find all completed tests for this user and skill
        // This is a bit inefficient if there are many retries, but acceptable for now
        // Ideally we'd have a custom query
        List<UserSkillTestEntity> tests = testRepository.findByUser_IdAndTestStatusIn(userId, List.of("COMPLETED"));

        return tests.stream()
                .filter(t -> t.getSkillName().equalsIgnoreCase(skillName))
                .mapToDouble(t -> (double) t.getScore() / t.getTotalQuestions())
                .max()
                .orElse(0.0);
    }

    // ===== Helpers =====

    private UserAuthEntity findUserByEmail(String email) {
        return userAuthRepo.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private UserSkillTestEntity createTestEntity(UserAuthEntity user, String skillName,
            List<TestQuestion> questions, String provider) {
        long expiryTime = System.currentTimeMillis() + (TEST_DURATION_MINUTES * 60 * 1000);

        List<String> correctAnswers = questions.stream()
                .map(TestQuestion::getCorrectAnswer)
                .collect(Collectors.toList());

        return UserSkillTestEntity.builder()
                .user(user)
                .skillName(skillName)
                .difficultyLevel("HARD")
                .questionsJson(serializeQuestions(questions))
                .answersJson(serializeAnswers(correctAnswers))
                .totalQuestions(TOTAL_QUESTIONS)
                .passingScore(PASSING_SCORE)
                .isPassed(false)
                .testStatus("PENDING")
                .testExpiresAt(expiryTime)
                .aiProvider(provider) // will be "MANUAL"
                .build();
    }

    private int calculateScore(List<UserAnswer> userAnswers, List<String> correctAnswers) {
        int score = 0;
        Map<Integer, String> answerMap = userAnswers.stream()
                .collect(Collectors.toMap(UserAnswer::getQuestionNumber, UserAnswer::getSelectedAnswer));
        for (int i = 0; i < correctAnswers.size(); i++) {
            String userAnswer = answerMap.get(i + 1);
            if (isAnswerCorrect(userAnswer, correctAnswers.get(i))) {
                score++;
            }
        }
        return score;
    }

    private TestResultResponse buildTestResult(UserSkillTestEntity test, List<TestQuestion> questions,
            List<UserAnswer> userAnswers, List<String> correctAnswers) {
        Map<Integer, String> answerMap = userAnswers.stream()
                .collect(Collectors.toMap(UserAnswer::getQuestionNumber, UserAnswer::getSelectedAnswer));

        List<QuestionResult> questionResults = new ArrayList<>();
        for (int i = 0; i < questions.size(); i++) {
            TestQuestion q = questions.get(i);
            String userAnswer = answerMap.getOrDefault(i + 1, "Not Answered");
            String correctAnswer = correctAnswers.get(i);
            boolean isCorrect = isAnswerCorrect(userAnswer, correctAnswer);

            questionResults.add(QuestionResult.builder()
                    .questionNumber(q.getQuestionNumber())
                    .question(q.getQuestion())
                    .correctAnswer(correctAnswer)
                    .userAnswer(userAnswer)
                    .isCorrect(isCorrect)
                    .build());
        }

        return TestResultResponse.builder()
                .testId(test.getId())
                .skillName(test.getSkillName())
                .score(test.getScore())
                .totalQuestions(test.getTotalQuestions())
                .passingScore(test.getPassingScore())
                .isPassed(test.getIsPassed())
                .questionResults(questionResults)
                .build();
    }

    private boolean isAnswerCorrect(String userAnswer, String correctAnswer) {
        if (userAnswer == null || correctAnswer == null)
            return false;

        userAnswer = userAnswer.trim();
        correctAnswer = correctAnswer.trim();

        if (userAnswer.equalsIgnoreCase(correctAnswer))
            return true;

        // Handle case where user answer is "A. Foundational..." and correct answer is
        // "A"
        if (correctAnswer.length() == 1 && userAnswer.length() > 2) {
            char firstChar = Character.toUpperCase(userAnswer.charAt(0));
            char correctChar = Character.toUpperCase(correctAnswer.charAt(0));
            char delimiter = userAnswer.charAt(1);

            if (firstChar == correctChar && (delimiter == '.' || delimiter == ')' || delimiter == ' ')) {
                return true;
            }
        }

        // Handle reverse case (backend has full text, user sends 'A') - good to have
        if (userAnswer.length() == 1 && correctAnswer.length() > 2) {
            char firstChar = Character.toUpperCase(correctAnswer.charAt(0));
            char userChar = Character.toUpperCase(userAnswer.charAt(0));
            char delimiter = correctAnswer.charAt(1);

            if (firstChar == userChar && (delimiter == '.' || delimiter == ')' || delimiter == ' ')) {
                return true;
            }
        }

        return false;
    }

    private TestResponse mapToTestResponse(UserSkillTestEntity test) {
        List<TestQuestion> questions = parseQuestionsJson(test.getQuestionsJson());

        List<QuestionDto> questionDtos = questions.stream()
                .map(q -> QuestionDto.builder()
                        .questionNumber(q.getQuestionNumber())
                        .question(q.getQuestion())
                        .options(q.getOptions())
                        .build())
                .collect(Collectors.toList());

        return TestResponse.builder()
                .testId(test.getId())
                .skillName(test.getSkillName())
                .totalQuestions(test.getTotalQuestions())
                .passingScore(test.getPassingScore())
                .questions(questionDtos)
                .expiresAt(test.getTestExpiresAt())
                .testStatus(test.getTestStatus())
                .build();
    }

    // ===== JSON (de)serialization =====

    private String serializeQuestions(List<TestQuestion> questions) {
        if (questions == null)
            return null;
        try {
            return objectMapper.writeValueAsString(questions);
        } catch (JsonProcessingException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to serialize questions");
        }
    }

    private String serializeAnswers(List<String> answers) {
        if (answers == null)
            return null;
        try {
            return objectMapper.writeValueAsString(answers);
        } catch (JsonProcessingException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to serialize answers");
        }
    }

    private String serializeUserAnswers(List<UserAnswer> answers) {
        if (answers == null)
            return null;
        try {
            return objectMapper.writeValueAsString(answers);
        } catch (JsonProcessingException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to serialize user answers");
        }
    }

    private List<TestQuestion> parseQuestionsJson(String json) {
        if (json == null)
            return new ArrayList<>();
        try {
            return objectMapper.readValue(json,
                    objectMapper.getTypeFactory().constructCollectionType(List.class, TestQuestion.class));
        } catch (JsonProcessingException e) {
            log.error("Failed to parse questions JSON: {}", json, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to parse questions JSON");
        }
    }

    private List<String> parseAnswersJson(String json) {
        if (json == null)
            return new ArrayList<>();
        try {
            return objectMapper.readValue(json,
                    objectMapper.getTypeFactory().constructCollectionType(List.class, String.class));
        } catch (JsonProcessingException e) {
            log.error("Failed to parse answers JSON: {}", json, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to parse answers JSON");
        }
    }

    private List<UserAnswer> parseUserResponsesJson(String json) {
        if (json == null)
            return new ArrayList<>();
        try {
            return objectMapper.readValue(json,
                    objectMapper.getTypeFactory().constructCollectionType(List.class, UserAnswer.class));
        } catch (JsonProcessingException e) {
            log.error("Failed to parse user responses JSON: {}", json, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to parse user responses JSON");
        }
    }

    private TestHistoryDto mapToHistoryDto(UserSkillTestEntity test) {
        return TestHistoryDto.builder()
                .testId(test.getId())
                .skillName(test.getSkillName())
                .score(test.getScore())
                .totalQuestions(test.getTotalQuestions())
                .isPassed(test.getIsPassed())
                .testStatus(test.getTestStatus())
                .createdAt(test.getCreatedAt().toString())
                .testExpiresAt(test.getTestExpiresAt())
                .build();
    }
}
