package com.SkillSwap.PeerToPeerLearning.Common;

import com.SkillSwap.PeerToPeerLearning.P1Auth.Entity.UserAuthEntity;
import com.SkillSwap.PeerToPeerLearning.P1Auth.Repository.UserAuthRepo;
import com.SkillSwap.PeerToPeerLearning.P2UserProfile.Repository.UserProfileRepository;
import com.SkillSwap.PeerToPeerLearning.P2UserProfile.entity.UserProfileEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@RequiredArgsConstructor
public class DemoDataSeeder implements CommandLineRunner {

        private final UserAuthRepo userAuthRepo;
        private final UserProfileRepository userProfileRepository;
        private final com.SkillSwap.PeerToPeerLearning.P2UserProfile.Repository.UserSkillLevelRepository userSkillLevelRepository;
        private final com.SkillSwap.PeerToPeerLearning.P4testPortal.Repository.UserSkillTestRepository testRepository;
        private final PasswordEncoder passwordEncoder;

        @Override
        @Transactional
        public void run(String... args) throws Exception {
                seedUser(
                                "alice@example.com",
                                "Alice",
                                "Wonderland",
                                "Java",
                                "Python",
                                "I am a Java expert looking to learn Python.");

                seedUser(
                                "bob@example.com",
                                "Bob",
                                "Builder",
                                "Python, Django",
                                "Java",
                                "Python backend dev wanting to switch to Enterprise Java.");

                seedUser(
                                "charlie@example.com",
                                "Charlie",
                                "Chaplin",
                                "React, Node.js",
                                "Data Science",
                                "Frontend wizard curious about AI/ML.");

                seedUser(
                                "david@example.com",
                                "David",
                                "Beckham",
                                "Spring Boot, Microservices",
                                "React",
                                "Senior Backend Engineer wanting to learn modern Frontend.");

                seedUser(
                                "kaleshantanu2260@gmail.com",
                                "Shantanu",
                                "Kale",
                                "Java, Spring Boot, React",
                                "System Design, Cloud Native",
                                "Full Stack Developer passionate about peer learning.");
        }

        private void seedUser(String email, String firstName, String lastName, String skills, String skillsToLearn,
                        String bio) {
                if (userAuthRepo.findByEmail(email).isPresent()) {
                        return; // Already seeded
                }

                System.out.println("Seeding demo user: " + email);

                // 1. Create User Auth
                UserAuthEntity userAuth = UserAuthEntity.builder()
                                .email(email)
                                .name(firstName + " " + lastName)
                                .password(passwordEncoder.encode("password123")) // Default password
                                .userId(UUID.randomUUID().toString())
                                .isAccountVerified(true)
                                .build();

                userAuth = userAuthRepo.save(userAuth);

                // 2. Create User Profile
                UserProfileEntity profile = new UserProfileEntity();
                profile.setUser(userAuth);
                profile.setFirstName(firstName);
                profile.setLastName(lastName);
                profile.setBio(bio);
                profile.setSkills(skills);
                profile.setSkillsToLearn(skillsToLearn);

                // Default fields for better UI
                profile.setLocation("Demo City, Tech Land");
                profile.setHoursPerWeek(10);
                profile.setCommunicationPace("MODERATE");
                profile.setPreferredLearningMethod("PAIR_PROGRAMMING");
                profile.setLearningGoal("SKILL_SWAP");
                profile.setProfileCompletenessScore(80);

                userProfileRepository.save(profile);

                // 3. Create Qualified Skills & Test Results
                if (skills != null && !skills.isEmpty()) {
                        String[] skillArray = skills.split(",");
                        for (String skill : skillArray) {
                                String cleanSkill = skill.trim();

                                // A. Skill Level
                                com.SkillSwap.PeerToPeerLearning.P2UserProfile.entity.UserSkillLevel skillLevel = com.SkillSwap.PeerToPeerLearning.P2UserProfile.entity.UserSkillLevel
                                                .builder()
                                                .user(userAuth)
                                                .skillName(cleanSkill)
                                                .proficiencyLevel("EXPERT")
                                                .yearsOfExperience(3)
                                                .selfRating(5)
                                                .willingToTeach(true)
                                                .build();
                                userSkillLevelRepository.save(skillLevel);

                                // B. Passed Test Result
                                com.SkillSwap.PeerToPeerLearning.P4testPortal.Entity.UserSkillTestEntity test = com.SkillSwap.PeerToPeerLearning.P4testPortal.Entity.UserSkillTestEntity
                                                .builder()
                                                .user(userAuth)
                                                .skillName(cleanSkill)
                                                .difficultyLevel("HARD")
                                                .questionsJson("[]") // Dummy for seed
                                                .answersJson("[]") // Dummy for seed
                                                .totalQuestions(15)
                                                .score(15)
                                                .passingScore(10)
                                                .isPassed(true)
                                                .testStatus("COMPLETED")
                                                .testExpiresAt(System.currentTimeMillis() + 100000000L)
                                                .aiProvider("MANUAL")
                                                .build();
                                testRepository.save(test);
                        }
                }
        }
}
