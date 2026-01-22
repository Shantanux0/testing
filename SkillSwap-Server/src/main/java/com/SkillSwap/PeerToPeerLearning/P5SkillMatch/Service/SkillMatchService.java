package com.SkillSwap.PeerToPeerLearning.P5SkillMatch.Service;

import com.SkillSwap.PeerToPeerLearning.P1Auth.Entity.UserAuthEntity;
import com.SkillSwap.PeerToPeerLearning.P1Auth.Repository.UserAuthRepo;
import com.SkillSwap.PeerToPeerLearning.P2UserProfile.Repository.UserProfileRepository;
import com.SkillSwap.PeerToPeerLearning.P2UserProfile.Repository.UserSkillLevelRepository;
import com.SkillSwap.PeerToPeerLearning.P2UserProfile.entity.UserProfileEntity;
import com.SkillSwap.PeerToPeerLearning.P2UserProfile.entity.UserSkillLevel;
import com.SkillSwap.PeerToPeerLearning.P3ResumePortal.AResumeService.ResumeService;
import com.SkillSwap.PeerToPeerLearning.P3ResumePortal.Certification.DTO.CertificationDto;
import com.SkillSwap.PeerToPeerLearning.P4testPortal.Service.IMPL.TestPortalService;
import com.SkillSwap.PeerToPeerLearning.P5SkillMatch.Dto.SwapMatchDto;
import com.SkillSwap.PeerToPeerLearning.P5SkillMatch.Dto.MatchResponseDto;
import com.SkillSwap.PeerToPeerLearning.P6Feedback.Service.ReputationService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SkillMatchService {

        private final UserProfileRepository userProfileRepository;
        private final UserSkillLevelRepository userSkillLevelRepository;
        private final UserAuthRepo userAuthRepo;
        private final TestPortalService testPortalService;
        private final ResumeService resumeService;
        private final ReputationService reputationService;
        private final ObjectMapper objectMapper;

        // Self-reported matching criteria (50%)
        private static final double SKILL_LEVEL_WEIGHT = 0.20;
        private static final double GOAL_ALIGNMENT_WEIGHT = 0.10;
        private static final double AVAILABILITY_WEIGHT = 0.10;
        private static final double TIME_COMMITMENT_WEIGHT = 0.05;
        private static final double LEARNING_STYLE_WEIGHT = 0.05;

        // Historical/verified data (50%)
        private static final double TEST_WEIGHT = 0.30; // Required!
        private static final double CERT_WEIGHT = 0.10; // Optional
        private static final double REPUTATION_WEIGHT = 0.10; // Optional

        /**
         * ENHANCED BIDIRECTIONAL SKILL SWAP MATCHING
         * Requires test scores for teaching qualification
         */
        public List<SwapMatchDto> findSwapMatches(String userEmail, String skillToLearn, String skillToTeach) {
                // Get current user
                UserAuthEntity currentUser = userAuthRepo.findByEmail(userEmail)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

                UserProfileEntity currentUserProfile = userProfileRepository.findByUser_Email(userEmail)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "User profile not found"));

                // Validate inputs
                if (skillToLearn == null || skillToLearn.isBlank()) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Skill to learn is required");
                }
                if (skillToTeach == null || skillToTeach.isBlank()) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Skill to teach is required");
                }

                // STRICT VALIDATION: Verify current user can teach skillToTeach (including test
                // requirement)
                if (!canUserTeachSkill(currentUser.getId(), currentUserProfile, skillToTeach, userEmail)) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                        "You must have '" + skillToTeach
                                                        + "' in your skills, set proficiency level, and PASS A TEST (score >= 10/15) before finding swap partners");
                }

                // Get my skill levels
                UserSkillLevel myTeachSkillLevel = getUserSkillLevel(currentUser.getId(), skillToTeach);
                UserSkillLevel myLearnSkillLevel = getUserSkillLevel(currentUser.getId(), skillToLearn);

                // Get my test scores
                Double myTestScore = getTestScore(currentUser.getId(), userEmail, skillToTeach);
                Double myCertScore = getCertificationScore(userEmail, skillToTeach);
                Double myReputationScore = getReputationScore(currentUser.getId());

                // Find all potential matches
                List<UserProfileEntity> allProfiles = userProfileRepository.findAll();
                List<SwapMatchDto> matches = new ArrayList<>();

                for (UserProfileEntity candidateProfile : allProfiles) {
                        System.out.println("DEBUG: Checking candidate: " + candidateProfile.getUser().getEmail());

                        // Skip self
                        if (candidateProfile.getUser().getId().equals(currentUser.getId())) {
                                System.out.println("DEBUG: Skipped self.");
                                continue;
                        }

                        Long candidateId = candidateProfile.getUser().getId();
                        String candidateEmail = candidateProfile.getUser().getEmail();

                        // CHECK MATCHING CONDITIONS:

                        // 1. Can they teach me? (has skill, willing to teach, AND passed test)
                        boolean canTeach = canUserTeachSkill(candidateId, candidateProfile, skillToLearn,
                                        candidateEmail);
                        System.out.println("DEBUG: Can " + candidateEmail + " teach " + skillToLearn + "? " + canTeach);

                        if (!canTeach) {
                                // Extra debug why
                                if (candidateProfile.getSkills() == null || !candidateProfile.getSkills().toLowerCase()
                                                .contains(skillToLearn.toLowerCase())) {
                                        System.out.println("DEBUG: Failed skill string check. Skills: "
                                                        + candidateProfile.getSkills());
                                } else {
                                        Optional<UserSkillLevel> sl = userSkillLevelRepository
                                                        .findByUserIdAndSkillNameIgnoreCase(candidateId, skillToLearn);
                                        if (sl.isEmpty())
                                                System.out.println("DEBUG: Failed UserSkillLevel lookup.");
                                        else if (!sl.get().getWillingToTeach())
                                                System.out.println("DEBUG: Not willing to teach.");
                                        else {
                                                Double ts = testPortalService.getBestTestScore(candidateId,
                                                                skillToLearn);
                                                System.out.println("DEBUG: Test Score: " + ts);
                                                if (ts == null || ts < (10.0 / 15.0))
                                                        System.out.println("DEBUG: Failed test score requirement.");
                                        }
                                }
                                continue;
                        }

                        // Get their skill level for teaching me
                        UserSkillLevel theirTeachSkillLevel = getUserSkillLevel(candidateId, skillToLearn);

                        // 2. Do they want to learn what I teach?
                        boolean wantsMySkill = wantsToLearnSkill(candidateProfile, skillToTeach);
                        System.out.println("DEBUG: Does " + candidateEmail + " want to learn " + skillToTeach + "? "
                                        + wantsMySkill);

                        // Determine swap type
                        String swapType;
                        boolean mutualMatch;
                        double swapTypeMultiplier;

                        if (wantsMySkill) {
                                swapType = "PERFECT_SWAP";
                                mutualMatch = true;
                                swapTypeMultiplier = 1.0;
                        } else {
                                swapType = "PARTIAL_MATCH";
                                mutualMatch = false;
                                swapTypeMultiplier = 0.6; // Lower priority
                        }

                        // Calculate all component scores
                        double skillLevelGapScore = calculateSkillLevelGapScore(theirTeachSkillLevel,
                                        myLearnSkillLevel);
                        double goalAlignmentScore = calculateGoalAlignmentScore(currentUserProfile, candidateProfile);
                        double availabilityScore = calculateAvailabilityScore(currentUserProfile, candidateProfile);
                        double timeCommitmentScore = calculateTimeCommitmentScore(currentUserProfile, candidateProfile);
                        double learningStyleScore = calculateLearningStyleScore(currentUserProfile, candidateProfile);

                        // Historical scores (always available since tests are required)
                        double theirTestScore = getTestScore(candidateId, candidateEmail, skillToLearn);
                        double theirCertScore = getCertificationScore(candidateEmail, skillToLearn);
                        double theirReputationScore = getReputationScore(candidateId);

                        // Calculate base match score
                        double baseScore = (skillLevelGapScore * SKILL_LEVEL_WEIGHT) +
                                        (goalAlignmentScore * GOAL_ALIGNMENT_WEIGHT) +
                                        (availabilityScore * AVAILABILITY_WEIGHT) +
                                        (timeCommitmentScore * TIME_COMMITMENT_WEIGHT) +
                                        (learningStyleScore * LEARNING_STYLE_WEIGHT) +
                                        (theirTestScore * TEST_WEIGHT) +
                                        (theirCertScore * CERT_WEIGHT) +
                                        (theirReputationScore * REPUTATION_WEIGHT);

                        // Apply swap type multiplier
                        double finalScore = baseScore * swapTypeMultiplier;

                        // Calculate availability overlap
                        int overlapHours = calculateAvailabilityOverlapHours(
                                        currentUserProfile.getAvailabilitySchedule(),
                                        candidateProfile.getAvailabilitySchedule());

                        // Generate compatibility explanation
                        String compatibilityReason = generateCompatibilityReason(
                                        swapType, skillLevelGapScore, goalAlignmentScore,
                                        theirTeachSkillLevel, myLearnSkillLevel);

                        // Build match DTO
                        SwapMatchDto match = SwapMatchDto.builder()
                                        .partnerId(candidateId)
                                        .partnerName(candidateProfile.getFirstName() + " "
                                                        + candidateProfile.getLastName())
                                        .partnerEmail(candidateEmail)
                                        .profileImageUrl(candidateProfile.getProfileImageUrl())
                                        .location(candidateProfile.getLocation())
                                        .timezone(candidateProfile.getTimezone())
                                        .skillILearn(skillToLearn)
                                        .skillITeach(skillToTeach)
                                        .matchScore(finalScore)
                                        .swapType(swapType)
                                        .mutualMatch(mutualMatch)
                                        // Component scores
                                        .skillLevelGapScore(skillLevelGapScore)
                                        .goalAlignmentScore(goalAlignmentScore)
                                        .availabilityScore(availabilityScore)
                                        .timeCommitmentScore(timeCommitmentScore)
                                        .learningStyleScore(learningStyleScore)
                                        // Historical scores
                                        .theirTestScore(theirTestScore)
                                        .theirCertScore(theirCertScore)
                                        .theirReputationScore(theirReputationScore)
                                        .myTestScore(myTestScore)
                                        .myCertScore(myCertScore)
                                        .myReputationScore(myReputationScore)
                                        // Detailed breakdown
                                        .theirSkillLevel(theirTeachSkillLevel != null
                                                        ? theirTeachSkillLevel.getProficiencyLevel()
                                                        : "UNKNOWN")
                                        .mySkillLevel(myLearnSkillLevel != null
                                                        ? myLearnSkillLevel.getProficiencyLevel()
                                                        : "BEGINNER")
                                        .theirGoal(candidateProfile.getTeachingMotivation())
                                        .myGoal(currentUserProfile.getLearningGoal())
                                        .availabilityOverlapHours(overlapHours)
                                        .compatibilityReason(compatibilityReason)
                                        // Partner info
                                        .partnerBio(candidateProfile.getBio())
                                        .partnerSkills(candidateProfile.getSkills())
                                        .partnerSkillsToLearn(candidateProfile.getSkillsToLearn())
                                        .partnerHoursPerWeek(candidateProfile.getHoursPerWeek())
                                        .partnerLearningMethod(candidateProfile.getPreferredLearningMethod())
                                        .partnerDomainFocus(candidateProfile.getDomainFocus())
                                        .build();

                        matches.add(match);
                }

                // Sort by match score descending (perfect swaps naturally rank higher)
                matches.sort(Comparator.comparingDouble(SwapMatchDto::getMatchScore).reversed());

                return matches;
        }

        /**
         * SIMPLE TEACHER RECOMMENDATION API
         *
         * This method is used by FullFlowDemoTest. It focuses on recommending
         * teachers for a single skill based on:
         * - Test score (40%)
         * - Certification credibility score (30%)
         * - Reputation score (30%)
         */
        public List<MatchResponseDto> recommendTeachers(String learnerEmail, String skillName) {
                // Ensure learner exists (for future personalization if needed)
                userAuthRepo.findByEmail(learnerEmail)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Learner not found"));

                List<UserProfileEntity> allProfiles = userProfileRepository.findAll();
                List<MatchResponseDto> recommendations = new ArrayList<>();

                for (UserProfileEntity profile : allProfiles) {
                        if (profile.getUser() == null) {
                                continue;
                        }

                        Long teacherId = profile.getUser().getId();
                        String teacherEmail = profile.getUser().getEmail();

                        // Skip learner themselves
                        if (teacherEmail != null && teacherEmail.equalsIgnoreCase(learnerEmail)) {
                                continue;
                        }

                        // Must have the skill in their profile
                        if (profile.getSkills() == null
                                        || !profile.getSkills().toLowerCase().contains(skillName.toLowerCase())) {
                                continue;
                        }

                        // Test score (already normalized 0-1 by TestPortalService contract)
                        Double testScore = testPortalService.getBestTestScore(teacherId, skillName);
                        if (testScore == null) {
                                testScore = 0.0;
                        }

                        // Best certification credibility score for this skill (0-1)
                        List<CertificationDto> certs = resumeService.getAllCertifications(teacherEmail);
                        double certScore = 0.0;
                        if (certs != null) {
                                certScore = certs.stream()
                                                .filter(c -> c.getSkillName() != null && c.getSkillName()
                                                                .equalsIgnoreCase(skillName))
                                                .map(CertificationDto::getCredibilityScore)
                                                .filter(Objects::nonNull)
                                                .mapToDouble(Double::doubleValue)
                                                .max()
                                                .orElse(0.0);
                        }

                        // Reputation score (assume 0-5, normalize to 0-1)
                        Double reputation = reputationService.getUserReputation(teacherId);
                        if (reputation == null) {
                                reputation = 0.0;
                        }
                        double normalizedReputation = Math.max(0.0, Math.min(1.0, reputation / 5.0));

                        double matchScore = (testScore * 0.4)
                                        + (certScore * 0.3)
                                        + (normalizedReputation * 0.3);

                        String name = ((profile.getFirstName() != null) ? profile.getFirstName() : "")
                                        + (profile.getLastName() != null ? " " + profile.getLastName() : "");

                        MatchResponseDto dto = MatchResponseDto.builder()
                                        .userId(teacherId)
                                        .name(name.trim())
                                        .email(teacherEmail)
                                        .profileImageUrl(profile.getProfileImageUrl())
                                        .skillName(skillName)
                                        .matchScore(matchScore)
                                        .testScore(testScore)
                                        .certificationScore(certScore)
                                        .reputationScore(normalizedReputation)
                                        .role("TEACHER")
                                        .build();

                        recommendations.add(dto);
                }

                recommendations.sort(Comparator.comparingDouble(MatchResponseDto::getMatchScore).reversed());

                return recommendations;
        }

        // ===== HELPER METHODS =====

        /**
         * STRICT VALIDATION: User can teach if:
         * 1. Skill is in profile
         * 2. UserSkillLevel exists with willingToTeach = true
         * 3. REQUIRED: Passed test for this skill (score >= 10/15)
         */
        private boolean canUserTeachSkill(Long userId, UserProfileEntity profile, String skill, String email) {
                // Check if skill in profile
                if (profile.getSkills() == null ||
                                !profile.getSkills().toLowerCase().contains(skill.toLowerCase())) {
                        return false;
                }

                // Check if user has declared skill level (Case Insensitive)
                Optional<UserSkillLevel> skillLevel = userSkillLevelRepository
                                .findByUserIdAndSkillNameIgnoreCase(userId, skill);
                if (skillLevel.isEmpty()) {
                        return false;
                }

                // Must be willing to teach
                if (!skillLevel.get().getWillingToTeach()) {
                        return false;
                }

                // REQUIRED: Must have passed test
                Double testScore = testPortalService.getBestTestScore(userId, skill);
                if (testScore == null || testScore < (10.0 / 15.0)) { // Normalize to 0-1, require >= 10/15
                        return false;
                }

                return true;
        }

        private boolean wantsToLearnSkill(UserProfileEntity profile, String skill) {
                return profile.getSkillsToLearn() != null &&
                                profile.getSkillsToLearn().toLowerCase().contains(skill.toLowerCase());
        }

        private UserSkillLevel getUserSkillLevel(Long userId, String skill) {
                return userSkillLevelRepository.findByUserIdAndSkillNameIgnoreCase(userId, skill).orElse(null);
        }

        /**
         * Calculate skill level gap score
         * P2P Logic: Same level is great (practice partner), 1 level up is also great
         * (mentor)
         */
        private double calculateSkillLevelGapScore(UserSkillLevel teacherLevel, UserSkillLevel learnerLevel) {
                if (teacherLevel == null)
                        return 0.5; // Default if no data

                int teacherValue = getProficiencyValue(teacherLevel.getProficiencyLevel());
                int learnerValue = learnerLevel != null ? getProficiencyValue(learnerLevel.getProficiencyLevel()) : 1; // Assume
                                                                                                                       // beginner

                int gap = teacherValue - learnerValue;

                if (gap == 0)
                        return 1.0; // Perfect: Peer Learning (Same Level)
                if (gap == 1)
                        return 1.0; // Perfect: Mentor (One level above)
                if (gap == 2)
                        return 0.9; // Great: Expert
                if (gap >= 3)
                        return 0.8; // Good: Master
                return 0.4; // Poor: learner more advanced than teacher
        }

        private int getProficiencyValue(String level) {
                if (level == null)
                        return 1;
                switch (level.toUpperCase()) {
                        case "BEGINNER":
                                return 1;
                        case "INTERMEDIATE":
                                return 2;
                        case "ADVANCED":
                                return 3;
                        case "EXPERT":
                                return 4;
                        default:
                                return 1;
                }
        }

        /**
         * Match learning goals and teaching motivations
         */
        private double calculateGoalAlignmentScore(UserProfileEntity learnerProfile, UserProfileEntity teacherProfile) {
                String learningGoal = learnerProfile.getLearningGoal();
                String teachingMotivation = teacherProfile.getTeachingMotivation();

                if (learningGoal == null || teachingMotivation == null) {
                        return 0.5; // Default if no data
                }

                // High alignment combinations
                if ("JOB_PREP".equals(learningGoal) && "LOVE_TEACHING".equals(teachingMotivation))
                        return 1.0;
                if ("CAREER_SWITCH".equals(learningGoal) && "LOVE_TEACHING".equals(teachingMotivation))
                        return 1.0;
                if ("PERSONAL_PROJECT".equals(learningGoal) && "REINFORCE_KNOWLEDGE".equals(teachingMotivation))
                        return 0.9;
                if ("EXPLORATION".equals(learningGoal) && "NETWORKING".equals(teachingMotivation))
                        return 0.8;

                // Medium alignment
                if ("JOB_PREP".equals(learningGoal) && "BUILD_REPUTATION".equals(teachingMotivation))
                        return 0.7;

                // Default moderate alignment
                return 0.6;
        }

        /**
         * Parse JSON schedules and find time overlap
         */
        private double calculateAvailabilityScore(UserProfileEntity profile1, UserProfileEntity profile2) {
                String schedule1 = profile1.getAvailabilitySchedule();
                String schedule2 = profile2.getAvailabilitySchedule();

                if (schedule1 == null || schedule2 == null) {
                        return 0.5; // Default if no schedule data
                }

                try {
                        Map<String, List<String>> sched1 = objectMapper.readValue(schedule1, new TypeReference<>() {
                        });
                        Map<String, List<String>> sched2 = objectMapper.readValue(schedule2, new TypeReference<>() {
                        });

                        int overlapHours = 0;
                        int totalHours1 = 0;

                        for (Map.Entry<String, List<String>> entry : sched1.entrySet()) {
                                String day = entry.getKey();
                                List<String> slots1 = entry.getValue();
                                List<String> slots2 = sched2.get(day);

                                totalHours1 += slots1.size() * 3; // Assume 3-hour slots

                                if (slots2 != null) {
                                        for (String slot1 : slots1) {
                                                if (slots2.contains(slot1)) {
                                                        overlapHours += 3;
                                                }
                                        }
                                }
                        }

                        if (totalHours1 == 0)
                                return 0.5;
                        return Math.min(1.0, (double) overlapHours / Math.max(1, totalHours1 / 2)); // Need at least
                                                                                                    // half overlap for
                                                                                                    // 1.0

                } catch (Exception e) {
                        return 0.5; // Parse error, default score
                }
        }

        private int calculateAvailabilityOverlapHours(String schedule1, String schedule2) {
                if (schedule1 == null || schedule2 == null)
                        return 0;

                try {
                        Map<String, List<String>> sched1 = objectMapper.readValue(schedule1, new TypeReference<>() {
                        });
                        Map<String, List<String>> sched2 = objectMapper.readValue(schedule2, new TypeReference<>() {
                        });

                        int overlapHours = 0;
                        for (Map.Entry<String, List<String>> entry : sched1.entrySet()) {
                                String day = entry.getKey();
                                List<String> slots2 = sched2.get(day);
                                if (slots2 != null) {
                                        for (String slot : entry.getValue()) {
                                                if (slots2.contains(slot)) {
                                                        overlapHours += 3; // Assume 3-hour slots
                                                }
                                        }
                                }
                        }
                        return overlapHours;
                } catch (Exception e) {
                        return 0;
                }
        }

        /**
         * Match hours per week availability
         */
        private double calculateTimeCommitmentScore(UserProfileEntity profile1, UserProfileEntity profile2) {
                Integer hours1 = profile1.getHoursPerWeek();
                Integer hours2 = profile2.getHoursPerWeek();

                if (hours1 == null || hours2 == null) {
                        return 0.5; // Default if no data
                }

                int diff = Math.abs(hours1 - hours2);
                double maxHours = Math.max(hours1, hours2);

                if (diff == 0)
                        return 1.0; // Perfect match
                if (diff <= maxHours * 0.2)
                        return 0.8; // Within 20%
                if (diff <= maxHours * 0.5)
                        return 0.5; // Within 50%
                return 0.3; // Large difference
        }

        /**
         * Match teaching approach with learning method
         */
        private double calculateLearningStyleScore(UserProfileEntity learnerProfile, UserProfileEntity teacherProfile) {
                String learningMethod = learnerProfile.getPreferredLearningMethod();
                String teachingApproach = teacherProfile.getTeachingApproach();

                if (learningMethod == null || teachingApproach == null) {
                        return 0.5; // Default
                }

                // High compatibility combinations
                if ("PAIR_PROGRAMMING".equals(learningMethod) && "PROJECT_BASED".equals(teachingApproach))
                        return 1.0;
                if ("VIDEO_CALL".equals(learningMethod) && "STEP_BY_STEP".equals(teachingApproach))
                        return 0.9;
                if ("SCREEN_SHARE".equals(learningMethod) && "PROBLEM_SOLVING".equals(teachingApproach))
                        return 0.9;

                // Moderate compatibility
                return 0.6;
        }

        /**
         * Get test score (REQUIRED, normalized to 0-1)
         */
        private double getTestScore(Long userId, String email, String skill) {
                Double score = testPortalService.getBestTestScore(userId, skill);
                return score != null ? score : 0.0; // Should always exist if validation passed
        }

        /**
         * Get certification score (optional, 0-1)
         */
        private double getCertificationScore(String email, String skill) {
                try {
                        List<CertificationDto> certs = resumeService.getAllCertifications(email);
                        return certs.stream()
                                        .filter(c -> c.getSkillName() != null
                                                        && c.getSkillName().equalsIgnoreCase(skill))
                                        .mapToDouble(c -> c.getCredibilityScore() != null ? c.getCredibilityScore()
                                                        : 0.0)
                                        .max()
                                        .orElse(0.0);
                } catch (Exception e) {
                        return 0.0;
                }
        }

        /**
         * Get reputation score (optional, normalize 1-5 to 0-1)
         */
        private double getReputationScore(Long userId) {
                try {
                        Double reputation = reputationService.getUserReputation(userId);
                        return Math.min(reputation / 5.0, 1.0);
                } catch (Exception e) {
                        return 0.0;
                }
        }

        /**
         * Generate human-readable compatibility reason
         */
        private String generateCompatibilityReason(String swapType, double skillGapScore,
                        double goalScore, UserSkillLevel theirLevel,
                        UserSkillLevel myLevel) {
                StringBuilder reason = new StringBuilder();

                if ("PERFECT_SWAP".equals(swapType)) {
                        reason.append("Perfect bidirectional match! You both want to learn from each other. ");
                } else {
                        reason.append("One-way learning opportunity. ");
                }

                if (skillGapScore >= 0.9) {
                        String theirProf = theirLevel != null ? theirLevel.getProficiencyLevel() : "qualified";
                        reason.append("They are ").append(theirProf.toLowerCase())
                                        .append(" level, ideal for teaching you. ");
                }

                if (goalScore >= 0.8) {
                        reason.append("Your learning goals align well with their teaching style. ");
                }

                return reason.toString().trim();
        }
}
