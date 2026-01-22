package com.SkillSwap.PeerToPeerLearning.P2UserProfile.Dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

import java.time.LocalDate;

@Data
// Request DTO for profile updates
public class UserProfileUpdateDto {

    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "First name must not exceed 50 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 50, message = "Last name must not exceed 50 characters")
    private String lastName;

    @Size(max = 500, message = "Bio must not exceed 500 characters")
    private String bio;

    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Invalid phone number format")
    private String phoneNumber;

    @Size(max = 100, message = "Location must not exceed 100 characters")
    private String location;

    @URL(message = "Invalid website URL")
    private String website;

    @URL(message = "Invalid LinkedIn URL")
    private String linkedinUrl;

    @URL(message = "Invalid GitHub URL")
    private String githubUrl;

    private String skills;
    private String interests;

    // NEW FIELDS FOR ENHANCED MATCHING (all optional)
    private String skillsToLearn;

    // Scheduling
    private String timezone;
    private Integer hoursPerWeek;
    private String availabilitySchedule; // JSON format

    // Goals
    private String learningGoal; // JOB_PREP, CAREER_SWITCH, PERSONAL_PROJECT, EXPLORATION
    private String goalTimeline; // URGENT, MEDIUM, FLEXIBLE, CASUAL

    // Teaching
    private String teachingMotivation; // LOVE_TEACHING, REINFORCE_KNOWLEDGE, BUILD_REPUTATION, NETWORKING
    private String teachingApproach; // STEP_BY_STEP, PROJECT_BASED, PROBLEM_SOLVING, CONCEPT_FIRST

    // Learning Preferences
    private String preferredLearningMethod; // VIDEO_CALL, SCREEN_SHARE, PAIR_PROGRAMMING, CODE_REVIEW, ASYNC
    private String communicationPace; // FAST, MODERATE, SLOW

    // Matching
    private String preferredLanguage;
    private String domainFocus; // WEB_DEV, MOBILE_DEV, DATA_SCIENCE, DEVOPS, GAME_DEV

}
